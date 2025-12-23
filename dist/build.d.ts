import type { ManifestData } from './manifest';
export interface BuildResult {
    outputPath: string;
    content: Buffer;
}
/**
 * Build miniapp using esbuild
 */
export declare function buildMiniapp(entryPoint: string, manifest: ManifestData): Promise<BuildResult>;
