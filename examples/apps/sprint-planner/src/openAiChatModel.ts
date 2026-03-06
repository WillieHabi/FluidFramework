/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import OpenAI from "openai";
import type { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources/index";
import type {
	SharedTreeChatModel,
	SharedTreeChatQuery,
} from "@fluidframework/tree-agent/alpha";

/**
 * Options for creating an {@link OpenAiChatModel}.
 */
export interface OpenAiChatModelOptions {
	/**
	 * OpenAI API key. Defaults to the OPENAI_API_KEY environment variable.
	 */
	apiKey?: string;

	/**
	 * The model to use. Defaults to "gpt-4o".
	 */
	model?: string;

	/**
	 * Maximum number of tokens in the response.
	 */
	maxTokens?: number;
}

/**
 * A {@link SharedTreeChatModel} implementation that uses the OpenAI API directly.
 */
export class OpenAiChatModel implements SharedTreeChatModel {
	private readonly client: OpenAI;
	private readonly modelName: string;
	private readonly maxTokens: number;
	private readonly messages: ChatCompletionMessageParam[] = [];

	public readonly editToolName = "GenerateTreeEditingCode";

	public get name(): string {
		return this.modelName;
	}

	public constructor(options?: OpenAiChatModelOptions) {
		this.client = new OpenAI({
			apiKey: options?.apiKey,
			dangerouslyAllowBrowser: true,
		});
		this.modelName = options?.model ?? "gpt-4o";
		this.maxTokens = options?.maxTokens ?? 16384;
	}

	public appendContext(text: string): void {
		this.messages.push({ role: "system", content: text });
	}

	public async query(query: SharedTreeChatQuery): Promise<string> {
		this.messages.push({ role: "user", content: query.text });
		return this.queryEdit(async (js: string) => query.edit(js));
	}

	private async queryEdit(edit: SharedTreeChatQuery["edit"]): Promise<string> {
		const tool: ChatCompletionTool = {
			type: "function",
			function: {
				name: this.editToolName,
				description:
					"Invokes a JavaScript code snippet to edit a tree of application data.",
				parameters: {
					type: "object",
					properties: {
						js: {
							type: "string",
							description:
								"The JavaScript code to execute for editing the tree.",
						},
					},
					required: ["js"],
				},
			},
		};

		const response = await this.client.chat.completions.create({
			model: this.modelName,
			max_tokens: this.maxTokens,
			messages: this.messages,
			tools: [tool],
			tool_choice: "auto",
		});

		const choice = response.choices[0];
		if (choice === undefined) {
			return "No response from model.";
		}

		const assistantMessage = choice.message;

		// Push assistant response to message history
		this.messages.push(assistantMessage);

		// Check for tool calls
		if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
			for (const toolCall of assistantMessage.tool_calls) {
				if (toolCall.function.name === this.editToolName) {
					const args = JSON.parse(toolCall.function.arguments) as { js: string };
					const editResult = await edit(args.js);

					this.messages.push({
						role: "tool",
						tool_call_id: toolCall.id,
						content: JSON.stringify(editResult),
					});

					if (editResult.type === "tooManyEditsError") {
						return editResult.message;
					}
				} else {
					this.messages.push({
						role: "tool",
						tool_call_id: toolCall.id,
						content: `Unrecognized tool call: ${toolCall.function.name}`,
					});
				}
			}

			// Recurse to let the model continue
			return this.queryEdit(edit);
		}

		// No tool calls - return text response
		return assistantMessage.content ?? "";
	}
}
