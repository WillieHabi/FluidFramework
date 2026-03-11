/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
Re-exports from crossPackageSchemaDefinitions.ts.
Three-file split matching Jason's original cross-package-schema setup:
  schemaUtils.ts -> schema.ts -> index.ts (re-exports)
*/

export {
	AppState,
	Container,
	Dimensions,
	Position,
} from "./crossPackageSchemaDefinitions.js";
