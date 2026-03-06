/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "node:assert";

import { TreeViewConfiguration } from "@fluidframework/tree";
import { TreeAlpha, independentView, type VerboseTreeNode } from "@fluidframework/tree/alpha";
import type {
	SharedTreeChatModel,
	SharedTreeChatQuery,
} from "@fluidframework/tree-agent/alpha";
import { SharedTreeSemanticAgent } from "@fluidframework/tree-agent/alpha";

import { sampleSprintBoard } from "../sampleData.js";
import { SprintBoard } from "../schema.js";

/**
 * A mock chat model that directly executes JS code via the edit function,
 * bypassing LLM calls entirely.
 */
class MockChatModel implements SharedTreeChatModel {
	public readonly editToolName = "GenerateTreeEditingCode";
	public readonly name = "MockChatModel";

	private editCode: string;

	public constructor(editCode: string) {
		this.editCode = editCode;
	}

	public appendContext(): void {
		// No-op for mock
	}

	public async query(message: SharedTreeChatQuery): Promise<string> {
		const result = await message.edit(this.editCode);
		return result.message;
	}

	public setEditCode(code: string): void {
		this.editCode = code;
	}
}

describe("Sprint Planner Schema", () => {
	it("can initialize with sample data", () => {
		const view = independentView(new TreeViewConfiguration({ schema: SprintBoard }));
		view.initialize(sampleSprintBoard());

		assert.equal(view.root.sprintName, "Sprint 24");
		assert.equal(view.root.workItems.length, 6);
		assert.equal(view.root.team.length, 3);
	});

	it("can read work item properties", () => {
		const view = independentView(new TreeViewConfiguration({ schema: SprintBoard }));
		view.initialize(sampleSprintBoard());

		const firstItem = view.root.workItems[0];
		assert(firstItem !== undefined);
		assert.equal(firstItem.title, "Set up CI/CD pipeline");
		assert.equal(firstItem.status, "done");
		assert.equal(firstItem.priority, "critical");
		assert.equal(firstItem.assignee, "Alice");
		assert.equal(firstItem.storyPoints, 5);
	});

	it("can read team member properties", () => {
		const view = independentView(new TreeViewConfiguration({ schema: SprintBoard }));
		view.initialize(sampleSprintBoard());

		const alice = view.root.team[0];
		assert(alice !== undefined);
		assert.equal(alice.name, "Alice");
		assert.equal(alice.capacity, 13);
	});

	it("can create a work item via mock agent", async () => {
		const view = independentView(new TreeViewConfiguration({ schema: SprintBoard }));
		view.initialize(sampleSprintBoard());

		const mockModel = new MockChatModel(
			`context.root.workItems.insertAtEnd(context.create.WorkItem({ title: "New Task", status: "todo", priority: "high" }));`,
		);
		const agent = new SharedTreeSemanticAgent(mockModel, view);

		await agent.query("Create a new task");

		assert.equal(view.root.workItems.length, 7);
		const newItem = view.root.workItems[6];
		assert(newItem !== undefined);
		assert.equal(newItem.title, "New Task");
		assert.equal(newItem.status, "todo");
		assert.equal(newItem.priority, "high");
	});

	it("can change work item status via mock agent", async () => {
		const view = independentView(new TreeViewConfiguration({ schema: SprintBoard }));
		view.initialize(sampleSprintBoard());

		const mockModel = new MockChatModel(
			`for (const item of context.root.workItems) { if (item.title === "Design database schema") { item.status = "done"; } }`,
		);
		const agent = new SharedTreeSemanticAgent(mockModel, view);

		await agent.query("Move design database schema to done");

		const item = [...view.root.workItems].find(
			(wi) => wi.title === "Design database schema",
		);
		assert(item !== undefined);
		assert.equal(item.status, "done");
	});

	it("can assign work items via mock agent", async () => {
		const view = independentView(new TreeViewConfiguration({ schema: SprintBoard }));
		view.initialize(sampleSprintBoard());

		const mockModel = new MockChatModel(
			`for (const item of context.root.workItems) { if (item.assignee === undefined) { item.assignee = "Alice"; } }`,
		);
		const agent = new SharedTreeSemanticAgent(mockModel, view);

		await agent.query("Assign unassigned tasks to Alice");

		for (const item of view.root.workItems) {
			assert(item.assignee !== undefined, `Item "${item.title}" should be assigned`);
		}
	});

	it("can export tree to verbose format", () => {
		const view = independentView(new TreeViewConfiguration({ schema: SprintBoard }));
		view.initialize(sampleSprintBoard());

		const verbose = TreeAlpha.exportVerbose(view.root) as VerboseTreeNode<never>;
		assert.equal(verbose.type, "com.microsoft.fluid.sprint-planner.SprintBoard");
		assert(typeof verbose.fields === "object" && !Array.isArray(verbose.fields));
	});
});
