/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by flub generate:typetests in @fluid-tools/build-cli.
 */

import type * as old from "@fluidframework/azure-client-previous/internal";

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
 * "ClassDeclaration_AzureClient": {"forwardCompat": false}
 */
declare function get_old_ClassDeclaration_AzureClient():
    TypeOnly<old.AzureClient>;
declare function use_current_ClassDeclaration_AzureClient(
    use: TypeOnly<current.AzureClient>): void;
use_current_ClassDeclaration_AzureClient(
    // @ts-expect-error compatibility expected to be broken
    get_old_ClassDeclaration_AzureClient());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassDeclaration_AzureClient": {"backCompat": false}
 */
declare function get_current_ClassDeclaration_AzureClient():
    TypeOnly<current.AzureClient>;
declare function use_old_ClassDeclaration_AzureClient(
    use: TypeOnly<old.AzureClient>): void;
use_old_ClassDeclaration_AzureClient(
    // @ts-expect-error compatibility expected to be broken
    get_current_ClassDeclaration_AzureClient());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_AzureClientProps": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_AzureClientProps():
    TypeOnly<old.AzureClientProps>;
declare function use_current_InterfaceDeclaration_AzureClientProps(
    use: TypeOnly<current.AzureClientProps>): void;
use_current_InterfaceDeclaration_AzureClientProps(
    get_old_InterfaceDeclaration_AzureClientProps());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_AzureClientProps": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_AzureClientProps():
    TypeOnly<current.AzureClientProps>;
declare function use_old_InterfaceDeclaration_AzureClientProps(
    use: TypeOnly<old.AzureClientProps>): void;
use_old_InterfaceDeclaration_AzureClientProps(
    get_current_InterfaceDeclaration_AzureClientProps());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_AzureConnectionConfig": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_AzureConnectionConfig():
    TypeOnly<old.AzureConnectionConfig>;
declare function use_current_InterfaceDeclaration_AzureConnectionConfig(
    use: TypeOnly<current.AzureConnectionConfig>): void;
use_current_InterfaceDeclaration_AzureConnectionConfig(
    get_old_InterfaceDeclaration_AzureConnectionConfig());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_AzureConnectionConfig": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_AzureConnectionConfig():
    TypeOnly<current.AzureConnectionConfig>;
declare function use_old_InterfaceDeclaration_AzureConnectionConfig(
    use: TypeOnly<old.AzureConnectionConfig>): void;
use_old_InterfaceDeclaration_AzureConnectionConfig(
    get_current_InterfaceDeclaration_AzureConnectionConfig());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_AzureConnectionConfigType": {"forwardCompat": false}
 */
declare function get_old_TypeAliasDeclaration_AzureConnectionConfigType():
    TypeOnly<old.AzureConnectionConfigType>;
declare function use_current_TypeAliasDeclaration_AzureConnectionConfigType(
    use: TypeOnly<current.AzureConnectionConfigType>): void;
use_current_TypeAliasDeclaration_AzureConnectionConfigType(
    get_old_TypeAliasDeclaration_AzureConnectionConfigType());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_AzureConnectionConfigType": {"backCompat": false}
 */
declare function get_current_TypeAliasDeclaration_AzureConnectionConfigType():
    TypeOnly<current.AzureConnectionConfigType>;
declare function use_old_TypeAliasDeclaration_AzureConnectionConfigType(
    use: TypeOnly<old.AzureConnectionConfigType>): void;
use_old_TypeAliasDeclaration_AzureConnectionConfigType(
    get_current_TypeAliasDeclaration_AzureConnectionConfigType());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_AzureContainerServices": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_AzureContainerServices():
    TypeOnly<old.AzureContainerServices>;
declare function use_current_InterfaceDeclaration_AzureContainerServices(
    use: TypeOnly<current.AzureContainerServices>): void;
use_current_InterfaceDeclaration_AzureContainerServices(
    get_old_InterfaceDeclaration_AzureContainerServices());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_AzureContainerServices": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_AzureContainerServices():
    TypeOnly<current.AzureContainerServices>;
declare function use_old_InterfaceDeclaration_AzureContainerServices(
    use: TypeOnly<old.AzureContainerServices>): void;
use_old_InterfaceDeclaration_AzureContainerServices(
    get_current_InterfaceDeclaration_AzureContainerServices());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_AzureContainerVersion": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_AzureContainerVersion():
    TypeOnly<old.AzureContainerVersion>;
declare function use_current_InterfaceDeclaration_AzureContainerVersion(
    use: TypeOnly<current.AzureContainerVersion>): void;
use_current_InterfaceDeclaration_AzureContainerVersion(
    get_old_InterfaceDeclaration_AzureContainerVersion());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_AzureContainerVersion": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_AzureContainerVersion():
    TypeOnly<current.AzureContainerVersion>;
declare function use_old_InterfaceDeclaration_AzureContainerVersion(
    use: TypeOnly<old.AzureContainerVersion>): void;
use_old_InterfaceDeclaration_AzureContainerVersion(
    get_current_InterfaceDeclaration_AzureContainerVersion());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassDeclaration_AzureFunctionTokenProvider": {"forwardCompat": false}
 */
declare function get_old_ClassDeclaration_AzureFunctionTokenProvider():
    TypeOnly<old.AzureFunctionTokenProvider>;
declare function use_current_ClassDeclaration_AzureFunctionTokenProvider(
    use: TypeOnly<current.AzureFunctionTokenProvider>): void;
use_current_ClassDeclaration_AzureFunctionTokenProvider(
    get_old_ClassDeclaration_AzureFunctionTokenProvider());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassDeclaration_AzureFunctionTokenProvider": {"backCompat": false}
 */
declare function get_current_ClassDeclaration_AzureFunctionTokenProvider():
    TypeOnly<current.AzureFunctionTokenProvider>;
declare function use_old_ClassDeclaration_AzureFunctionTokenProvider(
    use: TypeOnly<old.AzureFunctionTokenProvider>): void;
use_old_ClassDeclaration_AzureFunctionTokenProvider(
    get_current_ClassDeclaration_AzureFunctionTokenProvider());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_AzureGetVersionsOptions": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_AzureGetVersionsOptions():
    TypeOnly<old.AzureGetVersionsOptions>;
declare function use_current_InterfaceDeclaration_AzureGetVersionsOptions(
    use: TypeOnly<current.AzureGetVersionsOptions>): void;
use_current_InterfaceDeclaration_AzureGetVersionsOptions(
    get_old_InterfaceDeclaration_AzureGetVersionsOptions());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_AzureGetVersionsOptions": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_AzureGetVersionsOptions():
    TypeOnly<current.AzureGetVersionsOptions>;
declare function use_old_InterfaceDeclaration_AzureGetVersionsOptions(
    use: TypeOnly<old.AzureGetVersionsOptions>): void;
use_old_InterfaceDeclaration_AzureGetVersionsOptions(
    get_current_InterfaceDeclaration_AzureGetVersionsOptions());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_AzureLocalConnectionConfig": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_AzureLocalConnectionConfig():
    TypeOnly<old.AzureLocalConnectionConfig>;
declare function use_current_InterfaceDeclaration_AzureLocalConnectionConfig(
    use: TypeOnly<current.AzureLocalConnectionConfig>): void;
use_current_InterfaceDeclaration_AzureLocalConnectionConfig(
    get_old_InterfaceDeclaration_AzureLocalConnectionConfig());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_AzureLocalConnectionConfig": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_AzureLocalConnectionConfig():
    TypeOnly<current.AzureLocalConnectionConfig>;
declare function use_old_InterfaceDeclaration_AzureLocalConnectionConfig(
    use: TypeOnly<old.AzureLocalConnectionConfig>): void;
use_old_InterfaceDeclaration_AzureLocalConnectionConfig(
    get_current_InterfaceDeclaration_AzureLocalConnectionConfig());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_AzureMember": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_AzureMember():
    TypeOnly<old.AzureMember>;
declare function use_current_InterfaceDeclaration_AzureMember(
    use: TypeOnly<current.AzureMember>): void;
use_current_InterfaceDeclaration_AzureMember(
    // @ts-expect-error compatibility expected to be broken
    get_old_InterfaceDeclaration_AzureMember());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_AzureMember": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_AzureMember():
    TypeOnly<current.AzureMember>;
declare function use_old_InterfaceDeclaration_AzureMember(
    use: TypeOnly<old.AzureMember>): void;
use_old_InterfaceDeclaration_AzureMember(
    // @ts-expect-error compatibility expected to be broken
    get_current_InterfaceDeclaration_AzureMember());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_AzureRemoteConnectionConfig": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_AzureRemoteConnectionConfig():
    TypeOnly<old.AzureRemoteConnectionConfig>;
declare function use_current_InterfaceDeclaration_AzureRemoteConnectionConfig(
    use: TypeOnly<current.AzureRemoteConnectionConfig>): void;
use_current_InterfaceDeclaration_AzureRemoteConnectionConfig(
    get_old_InterfaceDeclaration_AzureRemoteConnectionConfig());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_AzureRemoteConnectionConfig": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_AzureRemoteConnectionConfig():
    TypeOnly<current.AzureRemoteConnectionConfig>;
declare function use_old_InterfaceDeclaration_AzureRemoteConnectionConfig(
    use: TypeOnly<old.AzureRemoteConnectionConfig>): void;
use_old_InterfaceDeclaration_AzureRemoteConnectionConfig(
    get_current_InterfaceDeclaration_AzureRemoteConnectionConfig());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_AzureUser": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_AzureUser():
    TypeOnly<old.AzureUser>;
declare function use_current_InterfaceDeclaration_AzureUser(
    use: TypeOnly<current.AzureUser>): void;
use_current_InterfaceDeclaration_AzureUser(
    get_old_InterfaceDeclaration_AzureUser());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_AzureUser": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_AzureUser():
    TypeOnly<current.AzureUser>;
declare function use_old_InterfaceDeclaration_AzureUser(
    use: TypeOnly<old.AzureUser>): void;
use_old_InterfaceDeclaration_AzureUser(
    get_current_InterfaceDeclaration_AzureUser());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_IAzureAudience": {"forwardCompat": false}
 */
declare function get_old_TypeAliasDeclaration_IAzureAudience():
    TypeOnly<old.IAzureAudience>;
declare function use_current_TypeAliasDeclaration_IAzureAudience(
    use: TypeOnly<current.IAzureAudience>): void;
use_current_TypeAliasDeclaration_IAzureAudience(
    get_old_TypeAliasDeclaration_IAzureAudience());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_IAzureAudience": {"backCompat": false}
 */
declare function get_current_TypeAliasDeclaration_IAzureAudience():
    TypeOnly<current.IAzureAudience>;
declare function use_old_TypeAliasDeclaration_IAzureAudience(
    use: TypeOnly<old.IAzureAudience>): void;
use_old_TypeAliasDeclaration_IAzureAudience(
    get_current_TypeAliasDeclaration_IAzureAudience());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ITelemetryBaseEvent": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_ITelemetryBaseEvent():
    TypeOnly<old.ITelemetryBaseEvent>;
declare function use_current_InterfaceDeclaration_ITelemetryBaseEvent(
    use: TypeOnly<current.ITelemetryBaseEvent>): void;
use_current_InterfaceDeclaration_ITelemetryBaseEvent(
    get_old_InterfaceDeclaration_ITelemetryBaseEvent());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ITelemetryBaseEvent": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_ITelemetryBaseEvent():
    TypeOnly<current.ITelemetryBaseEvent>;
declare function use_old_InterfaceDeclaration_ITelemetryBaseEvent(
    use: TypeOnly<old.ITelemetryBaseEvent>): void;
use_old_InterfaceDeclaration_ITelemetryBaseEvent(
    get_current_InterfaceDeclaration_ITelemetryBaseEvent());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ITelemetryBaseLogger": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_ITelemetryBaseLogger():
    TypeOnly<old.ITelemetryBaseLogger>;
declare function use_current_InterfaceDeclaration_ITelemetryBaseLogger(
    use: TypeOnly<current.ITelemetryBaseLogger>): void;
use_current_InterfaceDeclaration_ITelemetryBaseLogger(
    get_old_InterfaceDeclaration_ITelemetryBaseLogger());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ITelemetryBaseLogger": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_ITelemetryBaseLogger():
    TypeOnly<current.ITelemetryBaseLogger>;
declare function use_old_InterfaceDeclaration_ITelemetryBaseLogger(
    use: TypeOnly<old.ITelemetryBaseLogger>): void;
use_old_InterfaceDeclaration_ITelemetryBaseLogger(
    get_current_InterfaceDeclaration_ITelemetryBaseLogger());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ITokenClaims": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_ITokenClaims():
    TypeOnly<old.ITokenClaims>;
declare function use_current_InterfaceDeclaration_ITokenClaims(
    use: TypeOnly<current.ITokenClaims>): void;
use_current_InterfaceDeclaration_ITokenClaims(
    get_old_InterfaceDeclaration_ITokenClaims());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ITokenClaims": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_ITokenClaims():
    TypeOnly<current.ITokenClaims>;
declare function use_old_InterfaceDeclaration_ITokenClaims(
    use: TypeOnly<old.ITokenClaims>): void;
use_old_InterfaceDeclaration_ITokenClaims(
    get_current_InterfaceDeclaration_ITokenClaims());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ITokenProvider": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_ITokenProvider():
    TypeOnly<old.ITokenProvider>;
declare function use_current_InterfaceDeclaration_ITokenProvider(
    use: TypeOnly<current.ITokenProvider>): void;
use_current_InterfaceDeclaration_ITokenProvider(
    get_old_InterfaceDeclaration_ITokenProvider());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ITokenProvider": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_ITokenProvider():
    TypeOnly<current.ITokenProvider>;
declare function use_old_InterfaceDeclaration_ITokenProvider(
    use: TypeOnly<old.ITokenProvider>): void;
use_old_InterfaceDeclaration_ITokenProvider(
    get_current_InterfaceDeclaration_ITokenProvider());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ITokenResponse": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_ITokenResponse():
    TypeOnly<old.ITokenResponse>;
declare function use_current_InterfaceDeclaration_ITokenResponse(
    use: TypeOnly<current.ITokenResponse>): void;
use_current_InterfaceDeclaration_ITokenResponse(
    get_old_InterfaceDeclaration_ITokenResponse());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ITokenResponse": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_ITokenResponse():
    TypeOnly<current.ITokenResponse>;
declare function use_old_InterfaceDeclaration_ITokenResponse(
    use: TypeOnly<old.ITokenResponse>): void;
use_old_InterfaceDeclaration_ITokenResponse(
    get_current_InterfaceDeclaration_ITokenResponse());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IUser": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_IUser():
    TypeOnly<old.IUser>;
declare function use_current_InterfaceDeclaration_IUser(
    use: TypeOnly<current.IUser>): void;
use_current_InterfaceDeclaration_IUser(
    get_old_InterfaceDeclaration_IUser());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IUser": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_IUser():
    TypeOnly<current.IUser>;
declare function use_old_InterfaceDeclaration_IUser(
    use: TypeOnly<old.IUser>): void;
use_old_InterfaceDeclaration_IUser(
    get_current_InterfaceDeclaration_IUser());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "EnumDeclaration_ScopeType": {"forwardCompat": false}
 */
declare function get_old_EnumDeclaration_ScopeType():
    TypeOnly<old.ScopeType>;
declare function use_current_EnumDeclaration_ScopeType(
    use: TypeOnly<current.ScopeType>): void;
use_current_EnumDeclaration_ScopeType(
    get_old_EnumDeclaration_ScopeType());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "EnumDeclaration_ScopeType": {"backCompat": false}
 */
declare function get_current_EnumDeclaration_ScopeType():
    TypeOnly<current.ScopeType>;
declare function use_old_EnumDeclaration_ScopeType(
    use: TypeOnly<old.ScopeType>): void;
use_old_EnumDeclaration_ScopeType(
    get_current_EnumDeclaration_ScopeType());
