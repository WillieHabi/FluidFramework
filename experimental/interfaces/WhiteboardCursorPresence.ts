// Copyright (C) Microsoft Corporation. All rights reserved.

export interface WBCursorPresenceInterface {
	/**
	 * Set frequency at which batched messages are broadcasted (could be moved to constructor)
	 */
	setBroadcastFrequency?(frequency: number): void;
	
	/**
	 * Submit cursor position to be broadcasted
	 */
	broadcastCursorPresence(clientID: string, position: TimedCursorPosition | undefined): void;

	/**
	 * Add a listener function to clientID cursor position udpate
	 */
	addCursorPresenceListener(
		clientID: string,
		listener: (position: TimedCursorPosition | undefined) => void
	): () => void;
}


/** The device ID (used in multi-pen, -1 if unsupported) and position of a cursor in canvas/board space */
export interface CursorPosition {
	readonly id: number;
	readonly x: number;
	readonly y: number;
}

export interface TimedCursorPosition extends CursorPosition {
	/** The number of milliseconds since the previous position update occurred */
	readonly delta?: number;
}