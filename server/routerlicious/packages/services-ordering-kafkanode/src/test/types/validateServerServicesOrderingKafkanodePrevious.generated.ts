/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-test-generator in @fluidframework/build-tools.
 */
import type * as old from "@fluidframework/server-services-ordering-kafkanode-previous";
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
* "InterfaceDeclaration_IKafkaResources": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IKafkaResources():
    TypeOnly<old.IKafkaResources>;
declare function use_current_InterfaceDeclaration_IKafkaResources(
    use: TypeOnly<current.IKafkaResources>): void;
use_current_InterfaceDeclaration_IKafkaResources(
    get_old_InterfaceDeclaration_IKafkaResources());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IKafkaResources": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IKafkaResources():
    TypeOnly<current.IKafkaResources>;
declare function use_old_InterfaceDeclaration_IKafkaResources(
    use: TypeOnly<old.IKafkaResources>): void;
use_old_InterfaceDeclaration_IKafkaResources(
    get_current_InterfaceDeclaration_IKafkaResources());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_KafkaNodeConsumer": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_KafkaNodeConsumer():
    TypeOnly<old.KafkaNodeConsumer>;
declare function use_current_ClassDeclaration_KafkaNodeConsumer(
    use: TypeOnly<current.KafkaNodeConsumer>): void;
use_current_ClassDeclaration_KafkaNodeConsumer(
    get_old_ClassDeclaration_KafkaNodeConsumer());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_KafkaNodeConsumer": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_KafkaNodeConsumer():
    TypeOnly<current.KafkaNodeConsumer>;
declare function use_old_ClassDeclaration_KafkaNodeConsumer(
    use: TypeOnly<old.KafkaNodeConsumer>): void;
use_old_ClassDeclaration_KafkaNodeConsumer(
    get_current_ClassDeclaration_KafkaNodeConsumer());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_KafkaNodeProducer": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_KafkaNodeProducer():
    TypeOnly<old.KafkaNodeProducer>;
declare function use_current_ClassDeclaration_KafkaNodeProducer(
    use: TypeOnly<current.KafkaNodeProducer>): void;
use_current_ClassDeclaration_KafkaNodeProducer(
    get_old_ClassDeclaration_KafkaNodeProducer());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_KafkaNodeProducer": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_KafkaNodeProducer():
    TypeOnly<current.KafkaNodeProducer>;
declare function use_old_ClassDeclaration_KafkaNodeProducer(
    use: TypeOnly<old.KafkaNodeProducer>): void;
use_old_ClassDeclaration_KafkaNodeProducer(
    get_current_ClassDeclaration_KafkaNodeProducer());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_KafkaResources": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_KafkaResources():
    TypeOnly<old.KafkaResources>;
declare function use_current_ClassDeclaration_KafkaResources(
    use: TypeOnly<current.KafkaResources>): void;
use_current_ClassDeclaration_KafkaResources(
    get_old_ClassDeclaration_KafkaResources());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_KafkaResources": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_KafkaResources():
    TypeOnly<current.KafkaResources>;
declare function use_old_ClassDeclaration_KafkaResources(
    use: TypeOnly<old.KafkaResources>): void;
use_old_ClassDeclaration_KafkaResources(
    get_current_ClassDeclaration_KafkaResources());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_KafkaResourcesFactory": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_KafkaResourcesFactory():
    TypeOnly<old.KafkaResourcesFactory>;
declare function use_current_ClassDeclaration_KafkaResourcesFactory(
    use: TypeOnly<current.KafkaResourcesFactory>): void;
use_current_ClassDeclaration_KafkaResourcesFactory(
    get_old_ClassDeclaration_KafkaResourcesFactory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_KafkaResourcesFactory": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_KafkaResourcesFactory():
    TypeOnly<current.KafkaResourcesFactory>;
declare function use_old_ClassDeclaration_KafkaResourcesFactory(
    use: TypeOnly<old.KafkaResourcesFactory>): void;
use_old_ClassDeclaration_KafkaResourcesFactory(
    get_current_ClassDeclaration_KafkaResourcesFactory());
