export interface ManifestData {
    id: string;
    version: string;
    name: string;
    description?: string;
    author?: string;
    homepage?: string;
    repository?: string;
    license?: string;
    permissions?: string[];
    dependencies?: Record<string, string>;
}
/**
 * Parse and validate manifest from package.json
 * Supports both package.json and legacy manifest.json
 */
export declare function parseManifest(manifestPath: string): Promise<ManifestData>;
