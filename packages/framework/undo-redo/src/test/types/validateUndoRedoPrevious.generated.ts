/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by flub generate:typetests in @fluid-tools/build-cli.
 */

import type { TypeOnly, MinimalType, FullType } from "@fluidframework/build-tools";
import type * as old from "@fluidframework/undo-redo-previous/internal";

import type * as current from "../../index.js";

declare type MakeUnusedImportErrorsGoAway<T> = TypeOnly<T> | MinimalType<T> | FullType<T> | typeof old | typeof current;

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IRevertible": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_IRevertible():
    TypeOnly<old.IRevertible>;
declare function use_current_InterfaceDeclaration_IRevertible(
    use: TypeOnly<current.IRevertible>): void;
use_current_InterfaceDeclaration_IRevertible(
    get_old_InterfaceDeclaration_IRevertible());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IRevertible": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_IRevertible():
    TypeOnly<current.IRevertible>;
declare function use_old_InterfaceDeclaration_IRevertible(
    use: TypeOnly<old.IRevertible>): void;
use_old_InterfaceDeclaration_IRevertible(
    get_current_InterfaceDeclaration_IRevertible());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassDeclaration_SharedMapRevertible": {"forwardCompat": false}
 */
declare function get_old_ClassDeclaration_SharedMapRevertible():
    TypeOnly<old.SharedMapRevertible>;
declare function use_current_ClassDeclaration_SharedMapRevertible(
    use: TypeOnly<current.SharedMapRevertible>): void;
use_current_ClassDeclaration_SharedMapRevertible(
    get_old_ClassDeclaration_SharedMapRevertible());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassDeclaration_SharedMapRevertible": {"backCompat": false}
 */
declare function get_current_ClassDeclaration_SharedMapRevertible():
    TypeOnly<current.SharedMapRevertible>;
declare function use_old_ClassDeclaration_SharedMapRevertible(
    use: TypeOnly<old.SharedMapRevertible>): void;
use_old_ClassDeclaration_SharedMapRevertible(
    get_current_ClassDeclaration_SharedMapRevertible());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassDeclaration_SharedMapUndoRedoHandler": {"forwardCompat": false}
 */
declare function get_old_ClassDeclaration_SharedMapUndoRedoHandler():
    TypeOnly<old.SharedMapUndoRedoHandler>;
declare function use_current_ClassDeclaration_SharedMapUndoRedoHandler(
    use: TypeOnly<current.SharedMapUndoRedoHandler>): void;
use_current_ClassDeclaration_SharedMapUndoRedoHandler(
    get_old_ClassDeclaration_SharedMapUndoRedoHandler());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassDeclaration_SharedMapUndoRedoHandler": {"backCompat": false}
 */
declare function get_current_ClassDeclaration_SharedMapUndoRedoHandler():
    TypeOnly<current.SharedMapUndoRedoHandler>;
declare function use_old_ClassDeclaration_SharedMapUndoRedoHandler(
    use: TypeOnly<old.SharedMapUndoRedoHandler>): void;
use_old_ClassDeclaration_SharedMapUndoRedoHandler(
    get_current_ClassDeclaration_SharedMapUndoRedoHandler());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassDeclaration_SharedSegmentSequenceRevertible": {"forwardCompat": false}
 */
declare function get_old_ClassDeclaration_SharedSegmentSequenceRevertible():
    TypeOnly<old.SharedSegmentSequenceRevertible>;
declare function use_current_ClassDeclaration_SharedSegmentSequenceRevertible(
    use: TypeOnly<current.SharedSegmentSequenceRevertible>): void;
use_current_ClassDeclaration_SharedSegmentSequenceRevertible(
    get_old_ClassDeclaration_SharedSegmentSequenceRevertible());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassDeclaration_SharedSegmentSequenceRevertible": {"backCompat": false}
 */
declare function get_current_ClassDeclaration_SharedSegmentSequenceRevertible():
    TypeOnly<current.SharedSegmentSequenceRevertible>;
declare function use_old_ClassDeclaration_SharedSegmentSequenceRevertible(
    use: TypeOnly<old.SharedSegmentSequenceRevertible>): void;
use_old_ClassDeclaration_SharedSegmentSequenceRevertible(
    // @ts-expect-error compatibility expected to be broken
    get_current_ClassDeclaration_SharedSegmentSequenceRevertible());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassDeclaration_SharedSegmentSequenceUndoRedoHandler": {"forwardCompat": false}
 */
declare function get_old_ClassDeclaration_SharedSegmentSequenceUndoRedoHandler():
    TypeOnly<old.SharedSegmentSequenceUndoRedoHandler>;
declare function use_current_ClassDeclaration_SharedSegmentSequenceUndoRedoHandler(
    use: TypeOnly<current.SharedSegmentSequenceUndoRedoHandler>): void;
use_current_ClassDeclaration_SharedSegmentSequenceUndoRedoHandler(
    get_old_ClassDeclaration_SharedSegmentSequenceUndoRedoHandler());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassDeclaration_SharedSegmentSequenceUndoRedoHandler": {"backCompat": false}
 */
declare function get_current_ClassDeclaration_SharedSegmentSequenceUndoRedoHandler():
    TypeOnly<current.SharedSegmentSequenceUndoRedoHandler>;
declare function use_old_ClassDeclaration_SharedSegmentSequenceUndoRedoHandler(
    use: TypeOnly<old.SharedSegmentSequenceUndoRedoHandler>): void;
use_old_ClassDeclaration_SharedSegmentSequenceUndoRedoHandler(
    get_current_ClassDeclaration_SharedSegmentSequenceUndoRedoHandler());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassDeclaration_UndoRedoStackManager": {"forwardCompat": false}
 */
declare function get_old_ClassDeclaration_UndoRedoStackManager():
    TypeOnly<old.UndoRedoStackManager>;
declare function use_current_ClassDeclaration_UndoRedoStackManager(
    use: TypeOnly<current.UndoRedoStackManager>): void;
use_current_ClassDeclaration_UndoRedoStackManager(
    get_old_ClassDeclaration_UndoRedoStackManager());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassDeclaration_UndoRedoStackManager": {"backCompat": false}
 */
declare function get_current_ClassDeclaration_UndoRedoStackManager():
    TypeOnly<current.UndoRedoStackManager>;
declare function use_old_ClassDeclaration_UndoRedoStackManager(
    use: TypeOnly<old.UndoRedoStackManager>): void;
use_old_ClassDeclaration_UndoRedoStackManager(
    get_current_ClassDeclaration_UndoRedoStackManager());
