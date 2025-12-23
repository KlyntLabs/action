/**
 * Generate SLSA attestation using Sigstore with GitHub OIDC
 *
 * This approach uses Sigstore directly instead of @actions/attest
 * to avoid strict predicate format requirements. Based on CryptoGuard's
 * proven implementation.
 */
export declare function generateAttestation(bundlePath: string, manifestId: string, bundleHash: string): Promise<string>;
