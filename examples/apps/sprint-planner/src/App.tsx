/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { createRoot } from "react-dom/client";

import { SprintApp } from "./SprintApp.js";
import { createOrLoadContainer } from "./fluid.js";

async function start(): Promise<void> {
	const treeView = await createOrLoadContainer();
	const root = createRoot(document.getElementById("root")!);
	root.render(<SprintApp treeView={treeView} />);
}

start().catch((error) => {
	console.error("Failed to start:", error);
});
