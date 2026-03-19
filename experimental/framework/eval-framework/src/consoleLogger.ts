/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Default console logger
 */

import type { Logger } from "./loggerTypes.js";

/**
 * Default console logger.
 * @public
 */
/* eslint-disable no-console -- Logger implementation uses console */
export const consoleLogger: Logger = {
	info: (msg) => console.log(`[INFO] ${msg}`),
	warn: (msg) => console.warn(`[WARN] ${msg}`),
	error: (msg) => console.error(`[ERROR] ${msg}`),
	debug: (msg) => console.log(`[DEBUG] ${msg}`),
};
/* eslint-enable no-console */
