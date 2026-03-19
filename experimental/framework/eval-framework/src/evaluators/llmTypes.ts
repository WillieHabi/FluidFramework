/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * A plain text content block.
 * @public
 */
export interface TextContent {
	type: "text";
	text: string;
}

/**
 * A base64-encoded image content block.
 * @public
 */
export interface ImageContent {
	type: "image";
	mediaType: "image/png" | "image/jpeg" | "image/gif" | "image/webp";
	data: string; // base64-encoded
}

/**
 * A content block — either text or an image.
 * @public
 */
export type ContentBlock = TextContent | ImageContent;

/**
 * Chat message for LLM requests.
 * Content can be a plain string or an array of content blocks (for multimodal messages).
 * @public
 */
export interface ChatMessage {
	role: "system" | "user" | "assistant";
	content: string | ContentBlock[];
}

/**
 * Response from an LLM call
 * @public
 */
export interface LLMResponse {
	content: string;
	model?: string;
}

/**
 * LLM client interface for chat completions
 * @public
 */
export interface ILLMClient {
	chatCompletion(messages: ChatMessage[]): Promise<LLMResponse>;
}

/**
 * Parsed scores from LLM response — keyed by rubric name.
 * @public
 */
export type ParsedScores = Record<string, { score: number | null; reasoning: string }>;
