/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { useTree } from "@fluidframework/react/alpha";
import type { TreeViewAlpha } from "@fluidframework/tree/alpha";
import { SharedTreeSemanticAgent } from "@fluidframework/tree-agent/alpha";
import React, { useState } from "react";

import { ChatPanel } from "./components/ChatPanel.js";
import { KanbanBoard } from "./components/KanbanBoard.js";
import { TeamPanel } from "./components/TeamPanel.js";
import { ApiKeyInput } from "./components/ApiKeyInput.js";
import { OpenAiChatModel } from "./openAiChatModel.js";
import type { SprintBoard } from "./schema.js";

import "./styles.css";

export interface SprintAppProps {
	treeView: TreeViewAlpha<typeof SprintBoard>;
}

export function SprintApp({ treeView }: SprintAppProps): React.ReactElement {
	const [agent, setAgent] = useState<SharedTreeSemanticAgent<typeof SprintBoard> | null>(
		null,
	);

	useTree(treeView.root);

	const handleApiKey = (apiKey: string): void => {
		const chatModel = new OpenAiChatModel({ apiKey });
		const newAgent = new SharedTreeSemanticAgent(chatModel, treeView, {
			domainHints:
				"This is a sprint planning board for an agile software development team. " +
				"Work items have statuses: todo, in-progress, in-review, done. " +
				"Priorities are: critical, high, medium, low. " +
				"Story points use Fibonacci numbers: 1, 2, 3, 5, 8, 13.",
		});
		setAgent(newAgent);
	};

	if (agent === null) {
		return <ApiKeyInput onSubmit={handleApiKey} />;
	}

	const board = treeView.root;

	return (
		<div className="app-container">
			<header className="app-header">
				<div>
					<h1>{board.sprintName}</h1>
					<span className="subtitle">
						{board.workItems.length} items &middot; {board.team.length} members
					</span>
				</div>
			</header>
			<div className="app-body">
				<div className="main-content">
					<TeamPanel team={[...board.team]} workItems={[...board.workItems]} />
					<KanbanBoard workItems={[...board.workItems]} />
				</div>
				<ChatPanel agent={agent} />
			</div>
		</div>
	);
}
