/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { JsonObject } from "../boardEval/types/jsonTypes.js";

interface WorkItemData {
	title: string;
	status: string;
	priority: string;
	assignee?: string;
	storyPoints?: number;
	description?: string;
}

const columns = [
	{ key: "todo", label: "Todo" },
	{ key: "in-progress", label: "In Progress" },
	{ key: "in-review", label: "In Review" },
	{ key: "done", label: "Done" },
];

const priorityColors: Record<string, { bg: string; color: string }> = {
	critical: { bg: "#ff3b30", color: "#fff" },
	high: { bg: "#ff9500", color: "#fff" },
	medium: { bg: "#ffcc00", color: "#1d1d1f" },
	low: { bg: "#34c759", color: "#fff" },
};

/**
 * Extract work items from a VerboseTree output (JsonObject).
 * Walks through the nested fields/entries structure.
 */
function extractWorkItems(output: JsonObject): WorkItemData[] {
	const items: WorkItemData[] = [];

	try {
		const fields = (output as Record<string, unknown>).fields as Record<
			string,
			unknown
		>;
		const workItemsField = fields?.workItems as Record<string, unknown>;
		// VerboseTree arrays store items in the `fields` property (not `entries`)
		const entries =
			(workItemsField?.fields as unknown[]) ??
			(workItemsField?.entries as unknown[]) ??
			(workItemsField as unknown as unknown[]);

		if (!Array.isArray(entries)) return items;

		for (const entry of entries) {
			const f = (entry as Record<string, unknown>).fields as Record<
				string,
				unknown
			>;
			if (!f) continue;
			items.push({
				title: String(f.title ?? "Untitled"),
				status: String(f.status ?? "todo"),
				priority: String(f.priority ?? "medium"),
				assignee: f.assignee != null ? String(f.assignee) : undefined,
				storyPoints:
					typeof f.storyPoints === "number"
						? f.storyPoints
						: undefined,
				description:
					f.description != null ? String(f.description) : undefined,
			});
		}
	} catch {
		// Gracefully return empty if structure doesn't match
	}

	return items;
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function renderCardHtml(item: WorkItemData): string {
	const p = priorityColors[item.priority] ?? { bg: "#ffcc00", color: "#1d1d1f" };
	const spHtml =
		item.storyPoints !== undefined
			? `<span style="font-size:12px;font-weight:600;color:#86868b;background:#f5f5f7;padding:2px 8px;border-radius:4px">${item.storyPoints} SP</span>`
			: "";
	const descHtml =
		item.description !== undefined
			? `<div style="font-size:12px;color:#86868b;line-height:1.4;margin-bottom:8px">${escapeHtml(item.description)}</div>`
			: "";
	const assigneeHtml =
		item.assignee !== undefined
			? `<span style="width:22px;height:22px;border-radius:50%;background:#007aff;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;margin-right:6px">${escapeHtml(item.assignee.charAt(0).toUpperCase())}</span><span style="font-size:12px;color:#86868b">${escapeHtml(item.assignee)}</span>`
			: `<span style="font-size:12px;color:#86868b;font-style:italic">Unassigned</span>`;

	return `<div style="background:#fff;border-radius:12px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,0.08);margin-bottom:8px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <span style="font-size:11px;font-weight:600;padding:2px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.3px;background:${p.bg};color:${p.color}">${escapeHtml(item.priority)}</span>
      ${spHtml}
    </div>
    <div style="font-size:14px;font-weight:600;color:#1d1d1f;margin-bottom:4px;line-height:1.3">${escapeHtml(item.title)}</div>
    ${descHtml}
    <div style="display:flex;align-items:center">${assigneeHtml}</div>
  </div>`;
}

function renderBoardHtml(
	workItems: WorkItemData[],
	sprintName?: string,
): string {
	const header = sprintName
		? `<div style="background:#fff;border-bottom:1px solid #e5e5e5;padding:16px 32px;font-size:20px;font-weight:600;color:#1d1d1f">${escapeHtml(sprintName)}</div>`
		: "";

	const columnsHtml = columns
		.map((col) => {
			const items = workItems.filter((item) => item.status === col.key);
			const cardsHtml = items.map(renderCardHtml).join("\n");
			return `<div style="flex:1;min-width:250px;display:flex;flex-direction:column">
        <div style="font-size:13px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;display:flex;align-items:center;gap:8px">
          ${escapeHtml(col.label)}
          <span style="background:#e5e5e5;color:#86868b;font-size:11px;padding:1px 7px;border-radius:10px">${items.length}</span>
        </div>
        <div style="flex:1;display:flex;flex-direction:column">${cardsHtml}</div>
      </div>`;
		})
		.join("\n");

	return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,Helvetica,Arial,sans-serif; background:#f5f5f7; color:#1d1d1f; -webkit-font-smoothing:antialiased; }
</style></head><body>
  ${header}
  <div id="board" style="display:flex;gap:16px;padding:24px 32px">
    ${columnsHtml}
  </div>
</body></html>`;
}

/**
 * Generate a PNG screenshot of a sprint board from its tree state.
 *
 * Renders a static HTML kanban board and captures it with Puppeteer.
 * Returns a base64-encoded PNG string, or undefined if Puppeteer is not available.
 */
export async function generateScreenshot(
	output: JsonObject,
): Promise<string | undefined> {
	const workItems = extractWorkItems(output);
	if (workItems.length === 0) return undefined;

	// Extract sprint name from the tree
	const fields = (output as Record<string, unknown>).fields as
		| Record<string, unknown>
		| undefined;
	const sprintName = fields?.sprintName as string | undefined;

	const html = renderBoardHtml(workItems, sprintName);

	try {
		// Dynamic import so the eval framework still works without puppeteer installed
		const puppeteer = await import("puppeteer");
		const browser = await puppeteer.default.launch({ headless: true });
		const page = await browser.newPage();
		await page.setViewport({ width: 1200, height: 800 });
		await page.setContent(html, { waitUntil: "networkidle0" });

		const boardElement = await page.$("#board");
		const screenshotBuffer = boardElement
			? await boardElement.screenshot({ encoding: "base64" })
			: await page.screenshot({ encoding: "base64", fullPage: true });

		await browser.close();
		return screenshotBuffer as string;
	} catch (error) {
		const msg = error instanceof Error ? error.message : String(error);
		// If puppeteer is not installed, gracefully skip
		if (msg.includes("Cannot find module") || msg.includes("ERR_MODULE_NOT_FOUND")) {
			console.warn(
				"[Screenshot] Puppeteer not installed, skipping screenshot. Install with: npm install puppeteer",
			);
			return undefined;
		}
		console.error(`[Screenshot] Failed to capture: ${msg}`);
		return undefined;
	}
}
