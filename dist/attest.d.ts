/**
 * Generate SLSA attestation using GitHub's built-in attestation
 *
 * NOTE: This uses @actions/attest which requires proper GitHub Actions context
 * and permissions (id-token: write, attestations: write)
 */
export declare function generateAttestation(bundlePath: string, manifestId: string, bundleHash: string): Promise<string>;
