/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { SchemaFactoryAlpha } from "@fluidframework/tree/alpha";

/**
 * Common schema factory — isolated in its own file to match the original
 * cross-package-schema setup (schemaUtils.ts).
 */
export const sf = new SchemaFactoryAlpha("cross-package-example");
