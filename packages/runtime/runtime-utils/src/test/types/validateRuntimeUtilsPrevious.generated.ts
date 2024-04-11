/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-test-generator in @fluidframework/build-tools.
 */

import type * as old from "@fluidframework/runtime-utils-previous";
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
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_Factory": {"forwardCompat": false}
*/
declare function get_old_TypeAliasDeclaration_Factory():
    TypeOnly<old.Factory>;
declare function use_current_TypeAliasDeclaration_Factory(
    use: TypeOnly<current.Factory>): void;
use_current_TypeAliasDeclaration_Factory(
    get_old_TypeAliasDeclaration_Factory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_Factory": {"backCompat": false}
*/
declare function get_current_TypeAliasDeclaration_Factory():
    TypeOnly<current.Factory>;
declare function use_old_TypeAliasDeclaration_Factory(
    use: TypeOnly<old.Factory>): void;
use_old_TypeAliasDeclaration_Factory(
    get_current_TypeAliasDeclaration_Factory());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_GCDataBuilder": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_GCDataBuilder():
    TypeOnly<old.GCDataBuilder>;
declare function use_current_ClassDeclaration_GCDataBuilder(
    use: TypeOnly<current.GCDataBuilder>): void;
use_current_ClassDeclaration_GCDataBuilder(
    get_old_ClassDeclaration_GCDataBuilder());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_GCDataBuilder": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_GCDataBuilder():
    TypeOnly<current.GCDataBuilder>;
declare function use_old_ClassDeclaration_GCDataBuilder(
    use: TypeOnly<old.GCDataBuilder>): void;
use_old_ClassDeclaration_GCDataBuilder(
    get_current_ClassDeclaration_GCDataBuilder());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_ObjectStoragePartition": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_ObjectStoragePartition():
    TypeOnly<old.ObjectStoragePartition>;
declare function use_current_ClassDeclaration_ObjectStoragePartition(
    use: TypeOnly<current.ObjectStoragePartition>): void;
use_current_ClassDeclaration_ObjectStoragePartition(
    get_old_ClassDeclaration_ObjectStoragePartition());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_ObjectStoragePartition": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_ObjectStoragePartition():
    TypeOnly<current.ObjectStoragePartition>;
declare function use_old_ClassDeclaration_ObjectStoragePartition(
    use: TypeOnly<old.ObjectStoragePartition>): void;
use_old_ClassDeclaration_ObjectStoragePartition(
    get_current_ClassDeclaration_ObjectStoragePartition());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_ReadAndParseBlob": {"forwardCompat": false}
*/
declare function get_old_TypeAliasDeclaration_ReadAndParseBlob():
    TypeOnly<old.ReadAndParseBlob>;
declare function use_current_TypeAliasDeclaration_ReadAndParseBlob(
    use: TypeOnly<current.ReadAndParseBlob>): void;
use_current_TypeAliasDeclaration_ReadAndParseBlob(
    get_old_TypeAliasDeclaration_ReadAndParseBlob());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_ReadAndParseBlob": {"backCompat": false}
*/
declare function get_current_TypeAliasDeclaration_ReadAndParseBlob():
    TypeOnly<current.ReadAndParseBlob>;
declare function use_old_TypeAliasDeclaration_ReadAndParseBlob(
    use: TypeOnly<old.ReadAndParseBlob>): void;
use_old_TypeAliasDeclaration_ReadAndParseBlob(
    get_current_TypeAliasDeclaration_ReadAndParseBlob());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_RequestParser": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_RequestParser():
    TypeOnly<old.RequestParser>;
declare function use_current_ClassDeclaration_RequestParser(
    use: TypeOnly<current.RequestParser>): void;
use_current_ClassDeclaration_RequestParser(
    get_old_ClassDeclaration_RequestParser());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_RequestParser": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_RequestParser():
    TypeOnly<current.RequestParser>;
declare function use_old_ClassDeclaration_RequestParser(
    use: TypeOnly<old.RequestParser>): void;
use_old_ClassDeclaration_RequestParser(
    get_current_ClassDeclaration_RequestParser());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_RuntimeFactoryHelper": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_RuntimeFactoryHelper():
    TypeOnly<old.RuntimeFactoryHelper>;
declare function use_current_ClassDeclaration_RuntimeFactoryHelper(
    use: TypeOnly<current.RuntimeFactoryHelper>): void;
use_current_ClassDeclaration_RuntimeFactoryHelper(
    get_old_ClassDeclaration_RuntimeFactoryHelper());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_RuntimeFactoryHelper": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_RuntimeFactoryHelper():
    TypeOnly<current.RuntimeFactoryHelper>;
declare function use_old_ClassDeclaration_RuntimeFactoryHelper(
    use: TypeOnly<old.RuntimeFactoryHelper>): void;
use_old_ClassDeclaration_RuntimeFactoryHelper(
    get_current_ClassDeclaration_RuntimeFactoryHelper());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_SummaryTreeBuilder": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_SummaryTreeBuilder():
    TypeOnly<old.SummaryTreeBuilder>;
declare function use_current_ClassDeclaration_SummaryTreeBuilder(
    use: TypeOnly<current.SummaryTreeBuilder>): void;
use_current_ClassDeclaration_SummaryTreeBuilder(
    get_old_ClassDeclaration_SummaryTreeBuilder());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_SummaryTreeBuilder": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_SummaryTreeBuilder():
    TypeOnly<current.SummaryTreeBuilder>;
declare function use_old_ClassDeclaration_SummaryTreeBuilder(
    use: TypeOnly<old.SummaryTreeBuilder>): void;
use_old_ClassDeclaration_SummaryTreeBuilder(
    get_current_ClassDeclaration_SummaryTreeBuilder());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TelemetryContext": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_TelemetryContext():
    TypeOnly<old.TelemetryContext>;
declare function use_current_ClassDeclaration_TelemetryContext(
    use: TypeOnly<current.TelemetryContext>): void;
use_current_ClassDeclaration_TelemetryContext(
    get_old_ClassDeclaration_TelemetryContext());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TelemetryContext": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_TelemetryContext():
    TypeOnly<current.TelemetryContext>;
declare function use_old_ClassDeclaration_TelemetryContext(
    use: TypeOnly<old.TelemetryContext>): void;
use_old_ClassDeclaration_TelemetryContext(
    get_current_ClassDeclaration_TelemetryContext());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_addBlobToSummary": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_addBlobToSummary():
    TypeOnly<typeof old.addBlobToSummary>;
declare function use_current_FunctionDeclaration_addBlobToSummary(
    use: TypeOnly<typeof current.addBlobToSummary>): void;
use_current_FunctionDeclaration_addBlobToSummary(
    get_old_FunctionDeclaration_addBlobToSummary());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_addBlobToSummary": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_addBlobToSummary():
    TypeOnly<typeof current.addBlobToSummary>;
declare function use_old_FunctionDeclaration_addBlobToSummary(
    use: TypeOnly<typeof old.addBlobToSummary>): void;
use_old_FunctionDeclaration_addBlobToSummary(
    get_current_FunctionDeclaration_addBlobToSummary());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_addSummarizeResultToSummary": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_addSummarizeResultToSummary():
    TypeOnly<typeof old.addSummarizeResultToSummary>;
declare function use_current_FunctionDeclaration_addSummarizeResultToSummary(
    use: TypeOnly<typeof current.addSummarizeResultToSummary>): void;
use_current_FunctionDeclaration_addSummarizeResultToSummary(
    get_old_FunctionDeclaration_addSummarizeResultToSummary());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_addSummarizeResultToSummary": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_addSummarizeResultToSummary():
    TypeOnly<typeof current.addSummarizeResultToSummary>;
declare function use_old_FunctionDeclaration_addSummarizeResultToSummary(
    use: TypeOnly<typeof old.addSummarizeResultToSummary>): void;
use_old_FunctionDeclaration_addSummarizeResultToSummary(
    get_current_FunctionDeclaration_addSummarizeResultToSummary());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedFunctionDeclaration_addTreeToSummary": {"forwardCompat": false}
*/

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedFunctionDeclaration_addTreeToSummary": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_calculateStats": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_calculateStats():
    TypeOnly<typeof old.calculateStats>;
declare function use_current_FunctionDeclaration_calculateStats(
    use: TypeOnly<typeof current.calculateStats>): void;
use_current_FunctionDeclaration_calculateStats(
    get_old_FunctionDeclaration_calculateStats());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_calculateStats": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_calculateStats():
    TypeOnly<typeof current.calculateStats>;
declare function use_old_FunctionDeclaration_calculateStats(
    use: TypeOnly<typeof old.calculateStats>): void;
use_old_FunctionDeclaration_calculateStats(
    get_current_FunctionDeclaration_calculateStats());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_convertSnapshotTreeToSummaryTree": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_convertSnapshotTreeToSummaryTree():
    TypeOnly<typeof old.convertSnapshotTreeToSummaryTree>;
declare function use_current_FunctionDeclaration_convertSnapshotTreeToSummaryTree(
    use: TypeOnly<typeof current.convertSnapshotTreeToSummaryTree>): void;
use_current_FunctionDeclaration_convertSnapshotTreeToSummaryTree(
    get_old_FunctionDeclaration_convertSnapshotTreeToSummaryTree());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_convertSnapshotTreeToSummaryTree": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_convertSnapshotTreeToSummaryTree():
    TypeOnly<typeof current.convertSnapshotTreeToSummaryTree>;
declare function use_old_FunctionDeclaration_convertSnapshotTreeToSummaryTree(
    use: TypeOnly<typeof old.convertSnapshotTreeToSummaryTree>): void;
use_old_FunctionDeclaration_convertSnapshotTreeToSummaryTree(
    get_current_FunctionDeclaration_convertSnapshotTreeToSummaryTree());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_convertSummaryTreeToITree": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_convertSummaryTreeToITree():
    TypeOnly<typeof old.convertSummaryTreeToITree>;
declare function use_current_FunctionDeclaration_convertSummaryTreeToITree(
    use: TypeOnly<typeof current.convertSummaryTreeToITree>): void;
use_current_FunctionDeclaration_convertSummaryTreeToITree(
    get_old_FunctionDeclaration_convertSummaryTreeToITree());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_convertSummaryTreeToITree": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_convertSummaryTreeToITree():
    TypeOnly<typeof current.convertSummaryTreeToITree>;
declare function use_old_FunctionDeclaration_convertSummaryTreeToITree(
    use: TypeOnly<typeof old.convertSummaryTreeToITree>): void;
use_old_FunctionDeclaration_convertSummaryTreeToITree(
    get_current_FunctionDeclaration_convertSummaryTreeToITree());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_convertToSummaryTree": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_convertToSummaryTree():
    TypeOnly<typeof old.convertToSummaryTree>;
declare function use_current_FunctionDeclaration_convertToSummaryTree(
    use: TypeOnly<typeof current.convertToSummaryTree>): void;
use_current_FunctionDeclaration_convertToSummaryTree(
    get_old_FunctionDeclaration_convertToSummaryTree());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_convertToSummaryTree": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_convertToSummaryTree():
    TypeOnly<typeof current.convertToSummaryTree>;
declare function use_old_FunctionDeclaration_convertToSummaryTree(
    use: TypeOnly<typeof old.convertToSummaryTree>): void;
use_old_FunctionDeclaration_convertToSummaryTree(
    get_current_FunctionDeclaration_convertToSummaryTree());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_convertToSummaryTreeWithStats": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_convertToSummaryTreeWithStats():
    TypeOnly<typeof old.convertToSummaryTreeWithStats>;
declare function use_current_FunctionDeclaration_convertToSummaryTreeWithStats(
    use: TypeOnly<typeof current.convertToSummaryTreeWithStats>): void;
use_current_FunctionDeclaration_convertToSummaryTreeWithStats(
    get_old_FunctionDeclaration_convertToSummaryTreeWithStats());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_convertToSummaryTreeWithStats": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_convertToSummaryTreeWithStats():
    TypeOnly<typeof current.convertToSummaryTreeWithStats>;
declare function use_old_FunctionDeclaration_convertToSummaryTreeWithStats(
    use: TypeOnly<typeof old.convertToSummaryTreeWithStats>): void;
use_old_FunctionDeclaration_convertToSummaryTreeWithStats(
    get_current_FunctionDeclaration_convertToSummaryTreeWithStats());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_create404Response": {"forwardCompat": false}
*/
declare function get_old_VariableDeclaration_create404Response():
    TypeOnly<typeof old.create404Response>;
declare function use_current_VariableDeclaration_create404Response(
    use: TypeOnly<typeof current.create404Response>): void;
use_current_VariableDeclaration_create404Response(
    get_old_VariableDeclaration_create404Response());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_create404Response": {"backCompat": false}
*/
declare function get_current_VariableDeclaration_create404Response():
    TypeOnly<typeof current.create404Response>;
declare function use_old_VariableDeclaration_create404Response(
    use: TypeOnly<typeof old.create404Response>): void;
use_old_VariableDeclaration_create404Response(
    get_current_VariableDeclaration_create404Response());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_createDataStoreFactory": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_createDataStoreFactory():
    TypeOnly<typeof old.createDataStoreFactory>;
declare function use_current_FunctionDeclaration_createDataStoreFactory(
    use: TypeOnly<typeof current.createDataStoreFactory>): void;
use_current_FunctionDeclaration_createDataStoreFactory(
    get_old_FunctionDeclaration_createDataStoreFactory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_createDataStoreFactory": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_createDataStoreFactory():
    TypeOnly<typeof current.createDataStoreFactory>;
declare function use_old_FunctionDeclaration_createDataStoreFactory(
    use: TypeOnly<typeof old.createDataStoreFactory>): void;
use_old_FunctionDeclaration_createDataStoreFactory(
    get_current_FunctionDeclaration_createDataStoreFactory());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_createResponseError": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_createResponseError():
    TypeOnly<typeof old.createResponseError>;
declare function use_current_FunctionDeclaration_createResponseError(
    use: TypeOnly<typeof current.createResponseError>): void;
use_current_FunctionDeclaration_createResponseError(
    get_old_FunctionDeclaration_createResponseError());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_createResponseError": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_createResponseError():
    TypeOnly<typeof current.createResponseError>;
declare function use_old_FunctionDeclaration_createResponseError(
    use: TypeOnly<typeof old.createResponseError>): void;
use_old_FunctionDeclaration_createResponseError(
    get_current_FunctionDeclaration_createResponseError());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_exceptionToResponse": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_exceptionToResponse():
    TypeOnly<typeof old.exceptionToResponse>;
declare function use_current_FunctionDeclaration_exceptionToResponse(
    use: TypeOnly<typeof current.exceptionToResponse>): void;
use_current_FunctionDeclaration_exceptionToResponse(
    get_old_FunctionDeclaration_exceptionToResponse());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_exceptionToResponse": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_exceptionToResponse():
    TypeOnly<typeof current.exceptionToResponse>;
declare function use_old_FunctionDeclaration_exceptionToResponse(
    use: TypeOnly<typeof old.exceptionToResponse>): void;
use_old_FunctionDeclaration_exceptionToResponse(
    get_current_FunctionDeclaration_exceptionToResponse());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_generateHandleContextPath": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_generateHandleContextPath():
    TypeOnly<typeof old.generateHandleContextPath>;
declare function use_current_FunctionDeclaration_generateHandleContextPath(
    use: TypeOnly<typeof current.generateHandleContextPath>): void;
use_current_FunctionDeclaration_generateHandleContextPath(
    get_old_FunctionDeclaration_generateHandleContextPath());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_generateHandleContextPath": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_generateHandleContextPath():
    TypeOnly<typeof current.generateHandleContextPath>;
declare function use_old_FunctionDeclaration_generateHandleContextPath(
    use: TypeOnly<typeof old.generateHandleContextPath>): void;
use_old_FunctionDeclaration_generateHandleContextPath(
    get_current_FunctionDeclaration_generateHandleContextPath());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_getBlobSize": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_getBlobSize():
    TypeOnly<typeof old.getBlobSize>;
declare function use_current_FunctionDeclaration_getBlobSize(
    use: TypeOnly<typeof current.getBlobSize>): void;
use_current_FunctionDeclaration_getBlobSize(
    get_old_FunctionDeclaration_getBlobSize());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_getBlobSize": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_getBlobSize():
    TypeOnly<typeof current.getBlobSize>;
declare function use_old_FunctionDeclaration_getBlobSize(
    use: TypeOnly<typeof old.getBlobSize>): void;
use_old_FunctionDeclaration_getBlobSize(
    get_current_FunctionDeclaration_getBlobSize());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_getNormalizedObjectStoragePathParts": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_getNormalizedObjectStoragePathParts():
    TypeOnly<typeof old.getNormalizedObjectStoragePathParts>;
declare function use_current_FunctionDeclaration_getNormalizedObjectStoragePathParts(
    use: TypeOnly<typeof current.getNormalizedObjectStoragePathParts>): void;
use_current_FunctionDeclaration_getNormalizedObjectStoragePathParts(
    get_old_FunctionDeclaration_getNormalizedObjectStoragePathParts());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_getNormalizedObjectStoragePathParts": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_getNormalizedObjectStoragePathParts():
    TypeOnly<typeof current.getNormalizedObjectStoragePathParts>;
declare function use_old_FunctionDeclaration_getNormalizedObjectStoragePathParts(
    use: TypeOnly<typeof old.getNormalizedObjectStoragePathParts>): void;
use_old_FunctionDeclaration_getNormalizedObjectStoragePathParts(
    get_current_FunctionDeclaration_getNormalizedObjectStoragePathParts());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_listBlobsAtTreePath": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_listBlobsAtTreePath():
    TypeOnly<typeof old.listBlobsAtTreePath>;
declare function use_current_FunctionDeclaration_listBlobsAtTreePath(
    use: TypeOnly<typeof current.listBlobsAtTreePath>): void;
use_current_FunctionDeclaration_listBlobsAtTreePath(
    get_old_FunctionDeclaration_listBlobsAtTreePath());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_listBlobsAtTreePath": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_listBlobsAtTreePath():
    TypeOnly<typeof current.listBlobsAtTreePath>;
declare function use_old_FunctionDeclaration_listBlobsAtTreePath(
    use: TypeOnly<typeof old.listBlobsAtTreePath>): void;
use_old_FunctionDeclaration_listBlobsAtTreePath(
    get_current_FunctionDeclaration_listBlobsAtTreePath());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_mergeStats": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_mergeStats():
    TypeOnly<typeof old.mergeStats>;
declare function use_current_FunctionDeclaration_mergeStats(
    use: TypeOnly<typeof current.mergeStats>): void;
use_current_FunctionDeclaration_mergeStats(
    get_old_FunctionDeclaration_mergeStats());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_mergeStats": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_mergeStats():
    TypeOnly<typeof current.mergeStats>;
declare function use_old_FunctionDeclaration_mergeStats(
    use: TypeOnly<typeof old.mergeStats>): void;
use_old_FunctionDeclaration_mergeStats(
    get_current_FunctionDeclaration_mergeStats());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_responseToException": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_responseToException():
    TypeOnly<typeof old.responseToException>;
declare function use_current_FunctionDeclaration_responseToException(
    use: TypeOnly<typeof current.responseToException>): void;
use_current_FunctionDeclaration_responseToException(
    get_old_FunctionDeclaration_responseToException());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_responseToException": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_responseToException():
    TypeOnly<typeof current.responseToException>;
declare function use_old_FunctionDeclaration_responseToException(
    use: TypeOnly<typeof old.responseToException>): void;
use_old_FunctionDeclaration_responseToException(
    get_current_FunctionDeclaration_responseToException());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_seqFromTree": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_seqFromTree():
    TypeOnly<typeof old.seqFromTree>;
declare function use_current_FunctionDeclaration_seqFromTree(
    use: TypeOnly<typeof current.seqFromTree>): void;
use_current_FunctionDeclaration_seqFromTree(
    get_old_FunctionDeclaration_seqFromTree());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_seqFromTree": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_seqFromTree():
    TypeOnly<typeof current.seqFromTree>;
declare function use_old_FunctionDeclaration_seqFromTree(
    use: TypeOnly<typeof old.seqFromTree>): void;
use_old_FunctionDeclaration_seqFromTree(
    get_current_FunctionDeclaration_seqFromTree());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_unpackChildNodesUsedRoutes": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_unpackChildNodesUsedRoutes():
    TypeOnly<typeof old.unpackChildNodesUsedRoutes>;
declare function use_current_FunctionDeclaration_unpackChildNodesUsedRoutes(
    use: TypeOnly<typeof current.unpackChildNodesUsedRoutes>): void;
use_current_FunctionDeclaration_unpackChildNodesUsedRoutes(
    get_old_FunctionDeclaration_unpackChildNodesUsedRoutes());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_unpackChildNodesUsedRoutes": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_unpackChildNodesUsedRoutes():
    TypeOnly<typeof current.unpackChildNodesUsedRoutes>;
declare function use_old_FunctionDeclaration_unpackChildNodesUsedRoutes(
    use: TypeOnly<typeof old.unpackChildNodesUsedRoutes>): void;
use_old_FunctionDeclaration_unpackChildNodesUsedRoutes(
    get_current_FunctionDeclaration_unpackChildNodesUsedRoutes());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_utf8ByteLength": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_utf8ByteLength():
    TypeOnly<typeof old.utf8ByteLength>;
declare function use_current_FunctionDeclaration_utf8ByteLength(
    use: TypeOnly<typeof current.utf8ByteLength>): void;
use_current_FunctionDeclaration_utf8ByteLength(
    get_old_FunctionDeclaration_utf8ByteLength());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_utf8ByteLength": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_utf8ByteLength():
    TypeOnly<typeof current.utf8ByteLength>;
declare function use_old_FunctionDeclaration_utf8ByteLength(
    use: TypeOnly<typeof old.utf8ByteLength>): void;
use_old_FunctionDeclaration_utf8ByteLength(
    get_current_FunctionDeclaration_utf8ByteLength());
