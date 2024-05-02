/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-test-generator in @fluidframework/build-tools.
 */

import type * as old from "@fluidframework/counter-previous/internal";
import type * as current from "../../index.js";

// See 'build-tools/src/type-test-generator/compatibility.ts' for more information.
type TypeOnly<T> = T extends number
	? number
	: T extends string
	? string
	: T extends boolean | bigint | symbol
	? T
	: {
			[P in keyof T]: TypeOnly<T[P]>;
	  };

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ISharedCounter": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_ISharedCounter():
    TypeOnly<old.ISharedCounter>;
declare function use_current_InterfaceDeclaration_ISharedCounter(
    use: TypeOnly<current.ISharedCounter>): void;
use_current_InterfaceDeclaration_ISharedCounter(
    get_old_InterfaceDeclaration_ISharedCounter());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ISharedCounter": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_ISharedCounter():
    TypeOnly<current.ISharedCounter>;
declare function use_old_InterfaceDeclaration_ISharedCounter(
    use: TypeOnly<old.ISharedCounter>): void;
use_old_InterfaceDeclaration_ISharedCounter(
    get_current_InterfaceDeclaration_ISharedCounter());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ISharedCounterEvents": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_ISharedCounterEvents():
    TypeOnly<old.ISharedCounterEvents>;
declare function use_current_InterfaceDeclaration_ISharedCounterEvents(
    use: TypeOnly<current.ISharedCounterEvents>): void;
use_current_InterfaceDeclaration_ISharedCounterEvents(
    get_old_InterfaceDeclaration_ISharedCounterEvents());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ISharedCounterEvents": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_ISharedCounterEvents():
    TypeOnly<current.ISharedCounterEvents>;
declare function use_old_InterfaceDeclaration_ISharedCounterEvents(
    use: TypeOnly<old.ISharedCounterEvents>): void;
use_old_InterfaceDeclaration_ISharedCounterEvents(
    get_current_InterfaceDeclaration_ISharedCounterEvents());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "RemovedClassDeclaration_SharedCounter": {"forwardCompat": false}
 */
declare function get_old_ClassDeclaration_SharedCounter():
    TypeOnly<old.SharedCounter>;
declare function use_current_RemovedClassDeclaration_SharedCounter(
    use: TypeOnly<current.SharedCounter>): void;
use_current_RemovedClassDeclaration_SharedCounter(
    get_old_ClassDeclaration_SharedCounter());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "RemovedClassDeclaration_SharedCounter": {"backCompat": false}
 */
