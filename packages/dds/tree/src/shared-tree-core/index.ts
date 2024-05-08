/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

export {
	onForkTransitive,
	SharedTreeBranch,
	SharedTreeBranchChange,
	SharedTreeBranchEvents,
	getChangeReplaceType,
} from "./branch.js";

export {
	ExplicitCoreCodecVersions,
	SharedTreeCore,
	Summarizable,
	SummaryElementParser,
	SummaryElementStringifier,
} from "./sharedTreeCore.js";

export { CommitEnricher as ICommitEnricher } from "./commitEnricher.js";

export { TransactionStack } from "./transactionStack.js";

export { makeEditManagerCodec } from "./editManagerCodecs.js";
export { EditManagerSummarizer } from "./editManagerSummarizer.js";
export { EditManager, minimumPossibleSequenceNumber, SummaryData } from "./editManager.js";
export {
	Commit,
	SeqNumber,
	SequencedCommit,
	SummarySessionBranch,
	EncodedCommit,
} from "./editManagerFormat.js";
