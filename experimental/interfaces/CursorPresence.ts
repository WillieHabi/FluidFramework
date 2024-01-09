// Copyright (C) Microsoft Corporation. All rights reserved.

export class CursorPresence implements CursorPresenceInterface {
    constructor(broadcastFrequency?: number) {
        // Implementation here
    }

    setBroadcastFrequency(broadcastFrequency: number): void {
        // Implementation here
    }

    broadcast(senderClientID: string, position: CursorPosition | undefined): void {
        // Implementation here
    }

    addListener(
        senderClientID: string,
        listener: (position: CursorPosition | undefined) => void
    ): () => void {
        // Implementation here
		return () => {};
    }
}


export interface CursorPresenceInterface {
	/**
	 * Set frequency at which batched messages are broadcasted (could be moved to constructor)
	 */
	setBroadcastFrequency?(broadcastFrequency: number): void;
	
	/**
	 * Submit cursor position to be broadcasted
	 */
	broadcast(senderClientID: string, position: CursorPosition | undefined): void;

	/**
	 * Add a listener function to clientID cursor position udpate
	 */
	addListener(
		senderClientID: string,
		listener: (position: CursorPosition | undefined) => void
	): () => void;
}


export interface CursorPosition {
	readonly x: number;
	readonly y: number;
}
