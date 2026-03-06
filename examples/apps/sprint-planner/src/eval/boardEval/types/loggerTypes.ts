/**
 * Logger interface used throughout the eval framework.
 * Provides a consistent logging API for CLI tools, generators, and auth modules.
 */
export interface Logger {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  debug: (message: string) => void;
}

/**
 * Default console logger
 */
/* eslint-disable no-console -- Logger implementation uses console */
export const consoleLogger: Logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
  debug: (msg) => console.log(`[DEBUG] ${msg}`)
};
/* eslint-enable no-console */
