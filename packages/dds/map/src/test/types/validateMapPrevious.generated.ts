/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-test-generator in @fluidframework/build-tools.
 */

import type * as old from "@fluidframework/map-previous/internal";
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
 * "ClassDeclaration_DirectoryFactory": {"forwardCompat": false}
 */
declare function get_old_ClassDeclaration_DirectoryFactory():
    TypeOnly<old.DirectoryFactory>;
declare function use_current_ClassDeclaration_DirectoryFactory(
    use: TypeOnly<current.DirectoryFactory>): void;
use_current_ClassDeclaration_DirectoryFactory(
    get_old_ClassDeclaration_DirectoryFactory());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassDeclaration_DirectoryFactory": {"backCompat": false}
 */
declare function get_current_ClassDeclaration_DirectoryFactory():
    TypeOnly<current.DirectoryFactory>;
declare function use_old_ClassDeclaration_DirectoryFactory(
    use: TypeOnly<old.DirectoryFactory>): void;
use_old_ClassDeclaration_DirectoryFactory(
    get_current_ClassDeclaration_DirectoryFactory());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IDirectory": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_IDirectory():
    TypeOnly<old.IDirectory>;
declare function use_current_InterfaceDeclaration_IDirectory(
    use: TypeOnly<current.IDirectory>): void;
use_current_InterfaceDeclaration_IDirectory(
    get_old_InterfaceDeclaration_IDirectory());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IDirectory": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_IDirectory():
    TypeOnly<current.IDirectory>;
declare function use_old_InterfaceDeclaration_IDirectory(
    use: TypeOnly<old.IDirectory>): void;
use_old_InterfaceDeclaration_IDirectory(
    get_current_InterfaceDeclaration_IDirectory());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IDirectoryEvents": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_IDirectoryEvents():
    TypeOnly<old.IDirectoryEvents>;
declare function use_current_InterfaceDeclaration_IDirectoryEvents(
    use: TypeOnly<current.IDirectoryEvents>): void;
use_current_InterfaceDeclaration_IDirectoryEvents(
    get_old_InterfaceDeclaration_IDirectoryEvents());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IDirectoryEvents": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_IDirectoryEvents():
    TypeOnly<current.IDirectoryEvents>;
declare function use_old_InterfaceDeclaration_IDirectoryEvents(
    use: TypeOnly<old.IDirectoryEvents>): void;
use_old_InterfaceDeclaration_IDirectoryEvents(
    get_current_InterfaceDeclaration_IDirectoryEvents());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IDirectoryValueChanged": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_IDirectoryValueChanged():
    TypeOnly<old.IDirectoryValueChanged>;
declare function use_current_InterfaceDeclaration_IDirectoryValueChanged(
    use: TypeOnly<current.IDirectoryValueChanged>): void;
use_current_InterfaceDeclaration_IDirectoryValueChanged(
    get_old_InterfaceDeclaration_IDirectoryValueChanged());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IDirectoryValueChanged": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_IDirectoryValueChanged():
    TypeOnly<current.IDirectoryValueChanged>;
declare function use_old_InterfaceDeclaration_IDirectoryValueChanged(
    use: TypeOnly<old.IDirectoryValueChanged>): void;
use_old_InterfaceDeclaration_IDirectoryValueChanged(
    get_current_InterfaceDeclaration_IDirectoryValueChanged());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ISharedDirectory": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_ISharedDirectory():
    TypeOnly<old.ISharedDirectory>;
declare function use_current_InterfaceDeclaration_ISharedDirectory(
    use: TypeOnly<current.ISharedDirectory>): void;
use_current_InterfaceDeclaration_ISharedDirectory(
    // @ts-expect-error compatibility expected to be broken
    get_old_InterfaceDeclaration_ISharedDirectory());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ISharedDirectory": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_ISharedDirectory():
    TypeOnly<current.ISharedDirectory>;
declare function use_old_InterfaceDeclaration_ISharedDirectory(
    use: TypeOnly<old.ISharedDirectory>): void;
use_old_InterfaceDeclaration_ISharedDirectory(
    // @ts-expect-error compatibility expected to be broken
    get_current_InterfaceDeclaration_ISharedDirectory());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ISharedDirectoryEvents": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_ISharedDirectoryEvents():
    TypeOnly<old.ISharedDirectoryEvents>;
declare function use_current_InterfaceDeclaration_ISharedDirectoryEvents(
    use: TypeOnly<current.ISharedDirectoryEvents>): void;
use_current_InterfaceDeclaration_ISharedDirectoryEvents(
    get_old_InterfaceDeclaration_ISharedDirectoryEvents());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ISharedDirectoryEvents": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_ISharedDirectoryEvents():
    TypeOnly<current.ISharedDirectoryEvents>;
declare function use_old_InterfaceDeclaration_ISharedDirectoryEvents(
    use: TypeOnly<old.ISharedDirectoryEvents>): void;
use_old_InterfaceDeclaration_ISharedDirectoryEvents(
    get_current_InterfaceDeclaration_ISharedDirectoryEvents());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ISharedMap": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_ISharedMap():
    TypeOnly<old.ISharedMap>;
declare function use_current_InterfaceDeclaration_ISharedMap(
    use: TypeOnly<current.ISharedMap>): void;
use_current_InterfaceDeclaration_ISharedMap(
    // @ts-expect-error compatibility expected to be broken
    get_old_InterfaceDeclaration_ISharedMap());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ISharedMap": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_ISharedMap():
    TypeOnly<current.ISharedMap>;
declare function use_old_InterfaceDeclaration_ISharedMap(
    use: TypeOnly<old.ISharedMap>): void;
use_old_InterfaceDeclaration_ISharedMap(
    // @ts-expect-error compatibility expected to be broken
    get_current_InterfaceDeclaration_ISharedMap());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ISharedMapEvents": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_ISharedMapEvents():
    TypeOnly<old.ISharedMapEvents>;
declare function use_current_InterfaceDeclaration_ISharedMapEvents(
    use: TypeOnly<current.ISharedMapEvents>): void;
use_current_InterfaceDeclaration_ISharedMapEvents(
    get_old_InterfaceDeclaration_ISharedMapEvents());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ISharedMapEvents": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_ISharedMapEvents():
    TypeOnly<current.ISharedMapEvents>;
declare function use_old_InterfaceDeclaration_ISharedMapEvents(
    use: TypeOnly<old.ISharedMapEvents>): void;
use_old_InterfaceDeclaration_ISharedMapEvents(
    get_current_InterfaceDeclaration_ISharedMapEvents());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IValueChanged": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_IValueChanged():
    TypeOnly<old.IValueChanged>;
declare function use_current_InterfaceDeclaration_IValueChanged(
    use: TypeOnly<current.IValueChanged>): void;
use_current_InterfaceDeclaration_IValueChanged(
    get_old_InterfaceDeclaration_IValueChanged());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IValueChanged": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_IValueChanged():
    TypeOnly<current.IValueChanged>;
declare function use_old_InterfaceDeclaration_IValueChanged(
    use: TypeOnly<old.IValueChanged>): void;
use_old_InterfaceDeclaration_IValueChanged(
    get_current_InterfaceDeclaration_IValueChanged());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassDeclaration_MapFactory": {"forwardCompat": false}
 */
declare function get_old_ClassDeclaration_MapFactory():
    TypeOnly<old.MapFactory>;
declare function use_current_ClassDeclaration_MapFactory(
    use: TypeOnly<current.MapFactory>): void;
use_current_ClassDeclaration_MapFactory(
    get_old_ClassDeclaration_MapFactory());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassDeclaration_MapFactory": {"backCompat": false}
 */
declare function get_current_ClassDeclaration_MapFactory():
    TypeOnly<current.MapFactory>;
declare function use_old_ClassDeclaration_MapFactory(
    use: TypeOnly<old.MapFactory>): void;
use_old_ClassDeclaration_MapFactory(
    get_current_ClassDeclaration_MapFactory());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "VariableDeclaration_SharedDirectory": {"forwardCompat": false}
 */
declare function get_old_VariableDeclaration_SharedDirectory():
    TypeOnly<typeof old.SharedDirectory>;
declare function use_current_VariableDeclaration_SharedDirectory(
    use: TypeOnly<typeof current.SharedDirectory>): void;
use_current_VariableDeclaration_SharedDirectory(
    get_old_VariableDeclaration_SharedDirectory());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "VariableDeclaration_SharedDirectory": {"backCompat": false}
 */
declare function get_current_VariableDeclaration_SharedDirectory():
    TypeOnly<typeof current.SharedDirectory>;
declare function use_old_VariableDeclaration_SharedDirectory(
    use: TypeOnly<typeof old.SharedDirectory>): void;
use_old_VariableDeclaration_SharedDirectory(
    get_current_VariableDeclaration_SharedDirectory());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_SharedDirectory": {"forwardCompat": false}
 */
declare function get_old_TypeAliasDeclaration_SharedDirectory():
    TypeOnly<old.SharedDirectory>;
declare function use_current_TypeAliasDeclaration_SharedDirectory(
    use: TypeOnly<current.SharedDirectory>): void;
use_current_TypeAliasDeclaration_SharedDirectory(
    // @ts-expect-error compatibility expected to be broken
    get_old_TypeAliasDeclaration_SharedDirectory());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_SharedDirectory": {"backCompat": false}
 */
declare function get_current_TypeAliasDeclaration_SharedDirectory():
    TypeOnly<current.SharedDirectory>;
declare function use_old_TypeAliasDeclaration_SharedDirectory(
    use: TypeOnly<old.SharedDirectory>): void;
use_old_TypeAliasDeclaration_SharedDirectory(
    // @ts-expect-error compatibility expected to be broken
    get_current_TypeAliasDeclaration_SharedDirectory());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "VariableDeclaration_SharedMap": {"forwardCompat": false}
 */
declare function get_old_VariableDeclaration_SharedMap():
    TypeOnly<typeof old.SharedMap>;
declare function use_current_VariableDeclaration_SharedMap(
    use: TypeOnly<typeof current.SharedMap>): void;
use_current_VariableDeclaration_SharedMap(
    get_old_VariableDeclaration_SharedMap());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "VariableDeclaration_SharedMap": {"backCompat": false}
 */
declare function get_current_VariableDeclaration_SharedMap():
    TypeOnly<typeof current.SharedMap>;
declare function use_old_VariableDeclaration_SharedMap(
    use: TypeOnly<typeof old.SharedMap>): void;
use_old_VariableDeclaration_SharedMap(
    get_current_VariableDeclaration_SharedMap());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_SharedMap": {"forwardCompat": false}
 */
declare function get_old_TypeAliasDeclaration_SharedMap():
    TypeOnly<old.SharedMap>;
declare function use_current_TypeAliasDeclaration_SharedMap(
    use: TypeOnly<current.SharedMap>): void;
use_current_TypeAliasDeclaration_SharedMap(
    // @ts-expect-error compatibility expected to be broken
    get_old_TypeAliasDeclaration_SharedMap());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_SharedMap": {"backCompat": false}
 */
declare function get_current_TypeAliasDeclaration_SharedMap():
    TypeOnly<current.SharedMap>;
declare function use_old_TypeAliasDeclaration_SharedMap(
    use: TypeOnly<old.SharedMap>): void;
use_old_TypeAliasDeclaration_SharedMap(
    // @ts-expect-error compatibility expected to be broken
    get_current_TypeAliasDeclaration_SharedMap());
