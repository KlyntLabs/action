/**
 * Compute SHA-256 hash of bundle content
 * Returns hash in format: "sha256:<hex>"
 */
export declare function computeHash(content: Buffer): string;
/**
 * Verify bundle hash matches expected value
 */
export declare function verifyHash(content: Buffer, expectedHash: string): boolean;
