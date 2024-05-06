/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by flub generate:typetests in @fluid-tools/build-cli.
 */

import type * as old from "@fluidframework/devtools-previous/internal";

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
 * "InterfaceDeclaration_ContainerDevtoolsProps": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_ContainerDevtoolsProps():
    TypeOnly<old.ContainerDevtoolsProps>;
declare function use_current_InterfaceDeclaration_ContainerDevtoolsProps(
    use: TypeOnly<current.ContainerDevtoolsProps>): void;
use_current_InterfaceDeclaration_ContainerDevtoolsProps(
    get_old_InterfaceDeclaration_ContainerDevtoolsProps());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ContainerDevtoolsProps": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_ContainerDevtoolsProps():
    TypeOnly<current.ContainerDevtoolsProps>;
declare function use_old_InterfaceDeclaration_ContainerDevtoolsProps(
    use: TypeOnly<old.ContainerDevtoolsProps>): void;
use_old_InterfaceDeclaration_ContainerDevtoolsProps(
    get_current_InterfaceDeclaration_ContainerDevtoolsProps());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_ContainerKey": {"forwardCompat": false}
 */
declare function get_old_TypeAliasDeclaration_ContainerKey():
    TypeOnly<old.ContainerKey>;
declare function use_current_TypeAliasDeclaration_ContainerKey(
    use: TypeOnly<current.ContainerKey>): void;
use_current_TypeAliasDeclaration_ContainerKey(
    get_old_TypeAliasDeclaration_ContainerKey());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_ContainerKey": {"backCompat": false}
 */
declare function get_current_TypeAliasDeclaration_ContainerKey():
    TypeOnly<current.ContainerKey>;
declare function use_old_TypeAliasDeclaration_ContainerKey(
    use: TypeOnly<old.ContainerKey>): void;
use_old_TypeAliasDeclaration_ContainerKey(
    get_current_TypeAliasDeclaration_ContainerKey());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_DevtoolsProps": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_DevtoolsProps():
    TypeOnly<old.DevtoolsProps>;
declare function use_current_InterfaceDeclaration_DevtoolsProps(
    use: TypeOnly<current.DevtoolsProps>): void;
use_current_InterfaceDeclaration_DevtoolsProps(
    get_old_InterfaceDeclaration_DevtoolsProps());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_DevtoolsProps": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_DevtoolsProps():
    TypeOnly<current.DevtoolsProps>;
declare function use_old_InterfaceDeclaration_DevtoolsProps(
    use: TypeOnly<old.DevtoolsProps>): void;
use_old_InterfaceDeclaration_DevtoolsProps(
    get_current_InterfaceDeclaration_DevtoolsProps());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_HasContainerKey": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_HasContainerKey():
    TypeOnly<old.HasContainerKey>;
declare function use_current_InterfaceDeclaration_HasContainerKey(
    use: TypeOnly<current.HasContainerKey>): void;
use_current_InterfaceDeclaration_HasContainerKey(
    get_old_InterfaceDeclaration_HasContainerKey());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_HasContainerKey": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_HasContainerKey():
    TypeOnly<current.HasContainerKey>;
declare function use_old_InterfaceDeclaration_HasContainerKey(
    use: TypeOnly<old.HasContainerKey>): void;
use_old_InterfaceDeclaration_HasContainerKey(
    get_current_InterfaceDeclaration_HasContainerKey());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IDevtools": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_IDevtools():
    TypeOnly<old.IDevtools>;
declare function use_current_InterfaceDeclaration_IDevtools(
    use: TypeOnly<current.IDevtools>): void;
use_current_InterfaceDeclaration_IDevtools(
    get_old_InterfaceDeclaration_IDevtools());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IDevtools": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_IDevtools():
    TypeOnly<current.IDevtools>;
declare function use_old_InterfaceDeclaration_IDevtools(
    use: TypeOnly<old.IDevtools>): void;
use_old_InterfaceDeclaration_IDevtools(
    get_current_InterfaceDeclaration_IDevtools());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IDevtoolsLogger": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_IDevtoolsLogger():
    TypeOnly<old.IDevtoolsLogger>;
declare function use_current_InterfaceDeclaration_IDevtoolsLogger(
    use: TypeOnly<current.IDevtoolsLogger>): void;
use_current_InterfaceDeclaration_IDevtoolsLogger(
    get_old_InterfaceDeclaration_IDevtoolsLogger());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IDevtoolsLogger": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_IDevtoolsLogger():
    TypeOnly<current.IDevtoolsLogger>;
declare function use_old_InterfaceDeclaration_IDevtoolsLogger(
    use: TypeOnly<old.IDevtoolsLogger>): void;
use_old_InterfaceDeclaration_IDevtoolsLogger(
    get_current_InterfaceDeclaration_IDevtoolsLogger());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "FunctionDeclaration_createDevtoolsLogger": {"forwardCompat": false}
 */
declare function get_old_FunctionDeclaration_createDevtoolsLogger():
    TypeOnly<typeof old.createDevtoolsLogger>;
declare function use_current_FunctionDeclaration_createDevtoolsLogger(
    use: TypeOnly<typeof current.createDevtoolsLogger>): void;
use_current_FunctionDeclaration_createDevtoolsLogger(
    get_old_FunctionDeclaration_createDevtoolsLogger());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "FunctionDeclaration_createDevtoolsLogger": {"backCompat": false}
 */
declare function get_current_FunctionDeclaration_createDevtoolsLogger():
    TypeOnly<typeof current.createDevtoolsLogger>;
declare function use_old_FunctionDeclaration_createDevtoolsLogger(
    use: TypeOnly<typeof old.createDevtoolsLogger>): void;
use_old_FunctionDeclaration_createDevtoolsLogger(
    get_current_FunctionDeclaration_createDevtoolsLogger());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "FunctionDeclaration_initializeDevtools": {"forwardCompat": false}
 */
declare function get_old_FunctionDeclaration_initializeDevtools():
    TypeOnly<typeof old.initializeDevtools>;
declare function use_current_FunctionDeclaration_initializeDevtools(
    use: TypeOnly<typeof current.initializeDevtools>): void;
use_current_FunctionDeclaration_initializeDevtools(
    get_old_FunctionDeclaration_initializeDevtools());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "FunctionDeclaration_initializeDevtools": {"backCompat": false}
 */
declare function get_current_FunctionDeclaration_initializeDevtools():
    TypeOnly<typeof current.initializeDevtools>;
declare function use_old_FunctionDeclaration_initializeDevtools(
    use: TypeOnly<typeof old.initializeDevtools>): void;
use_old_FunctionDeclaration_initializeDevtools(
    get_current_FunctionDeclaration_initializeDevtools());
