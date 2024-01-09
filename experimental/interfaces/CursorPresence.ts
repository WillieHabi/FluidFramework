// Copyright (C) Microsoft Corporation. All rights reserved.

export class CursorPresence implements CursorPresenceInterface {
    constructor(frequency: number) {
        // Setup code here, for example:
        this.setBroadcastFrequency(frequency);
    }

    setBroadcastFrequency(frequency: number): void {
        // Implementation here
    }

    broadcast(clientID: string, position: CursorPosition | undefined): void {
        // Implementation here
    }

    addListener(
        clientID: string,
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
	setBroadcastFrequency?(frequency: number): void;
	
	/**
	 * Submit cursor position to be broadcasted
	 */
	broadcast(clientID: string, position: CursorPosition | undefined): void;

	/**
	 * Add a listener function to clientID cursor position udpate
	 */
	addListener(
		clientID: string,
		listener: (position: CursorPosition | undefined) => void
	): () => void;
}


export interface CursorPosition {
	readonly x: number;
	readonly y: number;
}
