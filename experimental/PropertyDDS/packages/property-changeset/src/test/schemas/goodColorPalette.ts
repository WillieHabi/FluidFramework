/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * @fileoverview
 * Test data for property set template schema testing
 */

/**
 * @namespace property-changeset.Test
 * @alias badNestedProperties.js
 * Namespace containing all schema-related data for property set validation
 */
export const templateSchema = {
	typeid: "Adsk.Library:Colors.ColorPalette-1.0.0",
	properties: [
		{ id: "colors", typeid: "Reference<Adsk.Core:Math.Color-1.0.0>", context: "map" },
		{ id: "testref", typeid: "Reference", context: "map" },
	],
};
