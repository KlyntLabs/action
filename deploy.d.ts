import type { ManifestData } from './manifest';
export interface DeployOptions {
    apiKey: string;
    tenantId: string;
    apiUrl: string;
    manifest: ManifestData;
    bundle: Buffer;
    bundleHash: string;
    attestationId?: string;
    github: {
        repo_url: string;
        commit_sha: string;
        tag?: string;
        actor: string;
        workflow_path: string;
        run_id: string;
    };
}
export interface DeployResult {
    deploymentId: string;
    status: 'deployed' | 'pending_review' | 'rejected';
    bundleUrl?: string;
    message: string;
}
/**
 * Deploy miniapp to Klynt platform
 */
export declare function deployToKlynt(options: DeployOptions): Promise<DeployResult>;
