/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * This module contains default {@link VisualizeSharedObject | visualization}
 * implementations for our DDSs.
 */

import { SharedCell } from "@fluidframework/cell";
import { SharedCounter } from "@fluidframework/counter";
import { SharedMap } from "@fluidframework/map";
import { SharedMatrix } from "@fluidframework/matrix";
import { SharedString } from "@fluidframework/sequence";
import { ISharedObject } from "@fluidframework/shared-object-base";
import { VisualizeChildData, VisualizeSharedObject } from "./DataVisualization";

import {
	FluidObjectTreeNode,
	FluidObjectValueNode,
	FluidUnknownObjectNode,
	VisualNodeKind,
	VisualChildNode,
	VisualTreeNode,
} from "./VisualTree";

/**
 * Default {@link VisualizeSharedObject} for {@link SharedCell}.
 */
export const visualizeSharedCell: VisualizeSharedObject = async (
	sharedObject: ISharedObject,
	visualizeChildData: VisualizeChildData,
): Promise<FluidObjectTreeNode> => {
	const sharedCell = sharedObject as SharedCell<unknown>;
	const data = sharedCell.get();

	const renderedData = await visualizeChildData(data);

	return {
		fluidObjectId: sharedCell.id,
		children: { data: renderedData },
		typeMetadata: "SharedCell",
		nodeKind: VisualNodeKind.FluidTreeNode,
	};
};

/**
 * Default {@link VisualizeSharedObject} for {@link SharedCounter}.
 */
export const visualizeSharedCounter: VisualizeSharedObject = async (
	sharedObject: ISharedObject,
): Promise<FluidObjectValueNode> => {
	const sharedCounter = sharedObject as SharedCounter;
	return {
		fluidObjectId: sharedCounter.id,
		value: sharedCounter.value,
		typeMetadata: "SharedCounter",
		nodeKind: VisualNodeKind.FluidValueNode,
	};
};

/**
 * Default {@link VisualizeSharedObject} for {@link SharedMap}.
 */
export const visualizeSharedMap: VisualizeSharedObject = async (
	sharedObject: ISharedObject,
	visualizeChildData: VisualizeChildData,
): Promise<FluidObjectTreeNode> => {
	const sharedMap = sharedObject as SharedMap;

	const children: Record<string, VisualChildNode> = {};
	for (const [key, value] of sharedMap) {
		const renderedChild = await visualizeChildData(value);
		children[key] = renderedChild;
	}

	return {
		fluidObjectId: sharedMap.id,
		children,
		metadata: {
			size: sharedMap.size,
		},
		typeMetadata: "SharedMap",
		nodeKind: VisualNodeKind.FluidTreeNode,
	};
};

/**
 * Default {@link VisualizeSharedObject} for {@link SharedMap}.
 */
export const visualizeSharedMatrix: VisualizeSharedObject = async (
	sharedObject: ISharedObject,
	visualizeChildData: VisualizeChildData,
): Promise<FluidObjectTreeNode> => {
	const sharedMatrix = sharedObject as SharedMatrix;

	const { rowCount, colCount: columnCount, id: fluidObjectId } = sharedMatrix;

	// Output will list child contents by row first, then by cell (column).
	const rows: Record<string, VisualTreeNode> = {};
	for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
		const cells: Record<string, VisualChildNode> = {};
		for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
			const cell = sharedMatrix.getCell(rowIndex, columnIndex) as unknown;
			const renderedCell = await visualizeChildData(cell);
			cells[columnIndex] = renderedCell;
		}
		rows[rowIndex] = {
			children: cells,
			metadata: {
				cells: columnCount,
			},
			nodeKind: VisualNodeKind.TreeNode,
		};
	}

	return {
		fluidObjectId,
		children: rows,
		metadata: {
			rows: rowCount,
			columns: columnCount,
		},
		typeMetadata: "SharedMatrix",
		nodeKind: VisualNodeKind.FluidTreeNode,
	};
};

/**
 * Default {@link VisualizeSharedObject} for {@link SharedString}.
 */
export const visualizeSharedString: VisualizeSharedObject = async (
	sharedObject: ISharedObject,
): Promise<FluidObjectValueNode> => {
	const sharedString = sharedObject as SharedString;
	const text = sharedString.getText();

	return {
		fluidObjectId: sharedString.id,
		value: text,
		typeMetadata: "SharedString",
		nodeKind: VisualNodeKind.FluidValueNode,
	};
};

/**
 * {@link VisualizeSharedObject} for unrecognized {@link ISharedObject}s.
 */
export const visualizeUnknownSharedObject: VisualizeSharedObject = async (
	sharedObject: ISharedObject,
): Promise<FluidUnknownObjectNode> => {
	return {
		fluidObjectId: sharedObject.id,
		typeMetadata: sharedObject.attributes.type,
		nodeKind: VisualNodeKind.FluidUnknownObjectNode,
	};
};

/**
 * List of default visualizers included in the library.
 */
export const defaultVisualizers: Record<string, VisualizeSharedObject> = {
	[SharedCell.getFactory().type]: visualizeSharedCell,
	[SharedCounter.getFactory().type]: visualizeSharedCounter,
	[SharedMap.getFactory().type]: visualizeSharedMap,
	[SharedMatrix.getFactory().type]: visualizeSharedMatrix,
	[SharedString.getFactory().type]: visualizeSharedString,
	// TODO: the others
};
