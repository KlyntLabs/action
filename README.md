# Klynt Miniapp GitHub Action

Official GitHub Action for building and deploying miniapps to the Klynt platform with SLSA Level 3 provenance.

## Features

- 🔨 **Automatic Building**: Builds miniapps from source using esbuild
- 🔏 **SLSA Attestation**: Generates cryptographic provenance using GitHub's built-in attestation
- 🔒 **Security Scanning**: Automatic security scanning on the Klynt platform
- 📦 **Multi-tenant Support**: Deploy to specific tenants
- 🚀 **Fast Deployment**: Optimized bundle upload with multipart form data

## Usage

### Basic Example

```yaml
name: Deploy Miniapp

on:
  push:
    tags:
      - 'v*'

permissions:
  contents: read
  id-token: write  # Required for SLSA attestation
  attestations: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci

      - uses: klynt/action@v1
        with:
          api-key: ${{ secrets.KLYNT_API_KEY }}
          tenant-id: ${{ vars.KLYNT_TENANT_ID }}
          manifest: ./manifest.json
          entry: ./src/index.tsx
```

### Using Pre-built Bundle

If you've already built your miniapp, you can skip the build step:

```yaml
- name: Build miniapp
  run: npm run build

- uses: klynt/action@v1
  with:
    api-key: ${{ secrets.KLYNT_API_KEY }}
    tenant-id: ${{ vars.KLYNT_TENANT_ID }}
    manifest: ./manifest.json
    bundle: ./dist/bundle.js
```

### Custom API URL

For self-hosted or staging environments:

```yaml
- uses: klynt/action@v1
  with:
    api-key: ${{ secrets.KLYNT_API_KEY }}
    tenant-id: ${{ vars.KLYNT_TENANT_ID }}
    manifest: ./manifest.json
    entry: ./src/index.tsx
    api-url: https://api-staging.klynt.com
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `api-key` | Klynt API key (use secrets) | Yes | - |
| `tenant-id` | Target tenant ID for deployment | Yes | - |
| `manifest` | Path to manifest.json | No | `./manifest.json` |
| `entry` | Entry point for build | No | `./src/index.tsx` |
| `bundle` | Path to pre-built bundle (skips build) | No | - |
| `skip-attestation` | Skip SLSA attestation (not recommended) | No | `false` |
| `api-url` | Klynt API base URL | No | `https://api.klynt.com` |

## Outputs

| Output | Description |
|--------|-------------|
| `deployment-id` | UUID of the created deployment |
| `status` | Deployment status (`deployed`, `pending_review`, `rejected`) |
| `bundle-url` | CDN URL of the deployed bundle |
| `bundle-hash` | SHA-256 hash of the bundle |
| `attestation-id` | GitHub attestation ID for SLSA verification |

## Deployment Status

The action returns different statuses based on security scanning:

- **`deployed`** (HTTP 201): Auto-approved, miniapp is live
- **`pending_review`** (HTTP 202): Flagged for manual review
- **`rejected`** (HTTP 422): Security scan failed, deployment blocked

### Handling Status in Workflow

```yaml
- uses: klynt/action@v1
  id: deploy
  with:
    api-key: ${{ secrets.KLYNT_API_KEY }}
    tenant-id: ${{ vars.KLYNT_TENANT_ID }}
    manifest: ./manifest.json
    entry: ./src/index.tsx

- name: Check deployment status
  run: |
    if [ "${{ steps.deploy.outputs.status }}" == "deployed" ]; then
      echo "✅ Deployed to ${{ steps.deploy.outputs.bundle-url }}"
    elif [ "${{ steps.deploy.outputs.status }}" == "pending_review" ]; then
      echo "⏳ Pending review (ID: ${{ steps.deploy.outputs.deployment-id }})"
    else
      echo "❌ Deployment rejected"
      exit 1
    fi
```

## Manifest File

Your miniapp must have a `manifest.json` file:

```json
{
  "id": "my-miniapp",
  "version": "1.0.0",
  "name": "My Miniapp",
  "description": "Description of my miniapp",
  "author": "Your Name",
  "homepage": "https://github.com/yourorg/your-miniapp",
  "repository": "https://github.com/yourorg/your-miniapp",
  "license": "MIT",
  "permissions": ["workspace:read", "files:read"],
  "dependencies": {
    "@klynt/miniapp-sdk": "^1.0.0"
  }
}
```

### Required Fields

- `id`: Unique identifier (alphanumeric, hyphens, underscores)
- `version`: Semver version (e.g., `1.0.0`)
- `name`: Display name

## SLSA Attestation

The action automatically generates SLSA Level 3 provenance using GitHub's built-in attestation. This provides:

- Cryptographic proof of source code integrity
- Traceable build provenance
- Supply chain security

### Required Permissions

```yaml
permissions:
  contents: read
  id-token: write  # Required for SLSA
  attestations: write
```

### Skipping Attestation

Not recommended, but you can skip attestation:

```yaml
- uses: klynt/action@v1
  with:
    skip-attestation: true
    # ...other inputs
```

Note: Deployments without attestation may be flagged for manual review.

## Security Scanning

All deployments are automatically scanned for:

- Code injection patterns (`eval`, `Function()`)
- XSS vulnerabilities (`innerHTML`, `document.write`)
- Prototype pollution attempts

Based on scan results, deployments are assigned a risk tier:

- **Tier 1-2**: Auto-approved
- **Tier 3**: Manual review required
- **Tier 4**: Auto-rejected

## Secrets Setup

### 1. Generate API Key

In your Klynt dashboard:
1. Go to Settings → API Keys
2. Create new API key with `miniapp:deploy` permission
3. Copy the key

### 2. Add to GitHub Secrets

In your repository:
1. Go to Settings → Secrets and variables → Actions
2. Add `KLYNT_API_KEY` with the copied key
3. Add `KLYNT_TENANT_ID` as a variable (not a secret)

## Troubleshooting

### "Missing required GitHub environment variables"

Ensure you're running in a GitHub Actions environment. This action requires:
- `GITHUB_REPOSITORY`
- `GITHUB_SHA`
- `GITHUB_WORKFLOW`
- `GITHUB_RUN_ID`
- `GITHUB_ACTOR`

### "Attestation generation failed"

Make sure you have the required permissions:

```yaml
permissions:
  id-token: write
  attestations: write
```

### "Manifest file not found"

Check that the `manifest` input points to the correct file:

```yaml
- uses: klynt/action@v1
  with:
    manifest: ./path/to/manifest.json
```

### "Deploy API returned 401"

Your API key is invalid or expired. Generate a new key in the Klynt dashboard.

## Development

```bash
# Install dependencies
pnpm install

# Build action
pnpm build

# Run tests
pnpm test

# Type check
pnpm check-types

# Lint
pnpm lint
```

## License

MIT
