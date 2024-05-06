/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";
import { describeCompat } from "@fluid-private/test-version-utils";
import { SharedString, Side } from "@fluidframework/sequence/internal";
import {
	TestFluidObjectFactory,
	type ITestFluidObject,
	type ITestObjectProvider,
} from "@fluidframework/test-utils/internal";
import type { IContainerRuntimeOptions } from "@fluidframework/container-runtime/internal";
import type { ILoaderProps } from "@fluidframework/container-loader/internal";

describeCompat("Container", "NoCompat", (getTestObjectProvider, apis) => {
	const { ContainerRuntimeFactoryWithDefaultDataStore } = apis.containerRuntime;
	const loaderProps: Partial<ILoaderProps> = {
		options: {
			intervalStickinessEnabled: true,
		},
	} as unknown as ILoaderProps;

	const sharedType = "sharedString";
	let provider: ITestObjectProvider;
	const defaultFactory = new TestFluidObjectFactory([[sharedType, SharedString.getFactory()]]);
	const runtimeOptions: IContainerRuntimeOptions = {
		summaryOptions: { summaryConfigOverrides: { state: "disabled" } },
	};
	const runtimeFactory = new ContainerRuntimeFactoryWithDefaultDataStore({
		defaultFactory,
		registryEntries: [[defaultFactory.type, Promise.resolve(defaultFactory)]],
		runtimeOptions,
	});

	const assertConsistent = (...sharedStrings: SharedString[]) => {
		const text = sharedStrings[0].getText();
		for (let i = 1; i < sharedStrings.length; i++) {
			assert.equal(sharedStrings[i].getText(), text, `SharedString ${i} is inconsistent`);
		}
	};

	beforeEach(() => {
		provider = getTestObjectProvider();
	});

	it("e2e zamboni avoids modifying segments with pending interval changes", async () => {
		const container1 = await provider.createContainer(runtimeFactory, loaderProps);
		const container2 = await provider.loadContainer(runtimeFactory, loaderProps);
		const container3 = await provider.loadContainer(runtimeFactory, loaderProps);

		const dataObject1 = (await container1.getEntryPoint()) as ITestFluidObject;
		const dataObject2 = (await container2.getEntryPoint()) as ITestFluidObject;
		const dataObject3 = (await container3.getEntryPoint()) as ITestFluidObject;

		const sharedString1 = await dataObject1.getSharedObject<SharedString>(sharedType);
		const sharedString2 = await dataObject2.getSharedObject<SharedString>(sharedType);
		const sharedString3 = await dataObject3.getSharedObject<SharedString>(sharedType);

		// C-AB
		// D-C-AB
		// HIJ-FG-D-C-AB
		// ^----------^
		// HIJ-FG-E-D-CAB
		// ^-----------^
		sharedString3.insertText(0, "AB");
		// This needs to be created on container1 before container1 knows about container3's changes
		sharedString1.insertText(0, "C");
		// This is an attempt at sequencing container3's changes before container1's
		await provider.ensureSynchronized(container3);
		await provider.ensureSynchronized();
		assertConsistent(sharedString1, sharedString2, sharedString3);
		container2.disconnect();
		sharedString3.insertText(0, "D");
		await provider.ensureSynchronized(container1, container3);
		assertConsistent(sharedString1, sharedString3);
		sharedString3.insertText(0, "E");
		sharedString2.insertText(0, "FG");
		sharedString2.insertText(0, "HIJ");
		container1.disconnect();
		const collection2 = sharedString2.getIntervalCollection("comments");
		collection2.add({ start: 0, end: 7 });
		await provider.ensureSynchronized(container3);
		container2.connect();
		await provider.ensureSynchronized(container2, container3);
		assertConsistent(sharedString2, sharedString3);
		assert.equal(sharedString2.getText(), "HIJFGEDCAB");
	});

	it("e2e zamboni avoids modifying segments with pending interval changes through multiple reconnects", async () => {
		const containerA = await provider.createDetachedContainer(runtimeFactory, loaderProps);
		const dataObjectA = (await containerA.getEntryPoint()) as ITestFluidObject;
		const sharedStringA = await dataObjectA.getSharedObject<SharedString>(sharedType);

		sharedStringA.insertText(0, "Rr");
		await provider.attachDetachedContainer(containerA);

		const containerB = await provider.loadContainer(runtimeFactory, loaderProps);
		const dataObjectB = (await containerB.getEntryPoint()) as ITestFluidObject;
		const sharedStringB = await dataObjectB.getSharedObject<SharedString>(sharedType);
		sharedStringB.removeRange(0, 1);

		const collection = sharedStringA.getIntervalCollection("comments");
		collection.add({ start: { pos: 1, side: Side.After }, end: { pos: 0, side: Side.Before } });
		containerA.disconnect();
		await provider.ensureSynchronized(containerB);
		sharedStringB.insertText(0, "8");
		containerA.connect();
		containerA.disconnect();
		sharedStringB.insertText(0, "J");
		await provider.ensureSynchronized(containerB);
		containerA.connect();
		await provider.ensureSynchronized(containerA, containerB);
		assertConsistent(sharedStringA, sharedStringB);
	});
});