# GitHub Workflows

This directory contains GitHub Actions workflows for the `nestjs-offline-oauth2` package.

## Workflows

### 1. CI Workflow (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**What it does:**
- Tests the package on Node.js 18.x and 20.x
- Runs linting and formatting checks
- Builds the project and verifies output
- Validates package.json configuration
- Performs a dry-run publish to ensure package is ready
- Runs security audits

### 2. NPM Publish Workflow (`npm-publish.yml`)

**Triggers:**
- **Automatic**: When a GitHub release is published
- **Manual**: Workflow dispatch with version bump options

**What it does:**
- Installs dependencies and runs quality checks
- Builds the project
- Bumps version (manual trigger only)
- Creates git tag (manual trigger only)
- Publishes to NPM
- Creates GitHub release (manual trigger only)

## Setup Instructions

### 1. NPM Token Setup

1. Go to [npmjs.com](https://www.npmjs.com) and log in
2. Navigate to your profile → Access Tokens
3. Generate a new token with "Automation" or "Publish" permissions
4. In your GitHub repository, go to Settings → Secrets and variables → Actions
5. Add a new repository secret named `NPM_TOKEN` with your token value

### 2. Repository Permissions

Ensure your repository has the following permissions:
- Actions: Read and write permissions
- Contents: Write permissions (for creating releases and tags)
- Metadata: Read permissions

To set these:
1. Go to Settings → Actions → General
2. Under "Workflow permissions", select "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"

## Usage

### Publishing a New Version

#### Method 1: Manual Workflow Dispatch (Recommended)

1. Go to Actions tab in your GitHub repository
2. Select "Publish to NPM" workflow
3. Click "Run workflow"
4. Choose the version bump type:
   - `patch`: Bug fixes (1.0.0 → 1.0.1)
   - `minor`: New features (1.0.0 → 1.1.0)
   - `major`: Breaking changes (1.0.0 → 2.0.0)
5. Click "Run workflow"

This will:
- Bump the version in package.json
- Create a git commit and tag
- Publish to NPM
- Create a GitHub release

#### Method 2: GitHub Release

1. Go to Releases in your repository
2. Click "Create a new release"
3. Create a new tag (e.g., `v1.0.1`)
4. Add release notes
5. Publish the release

This will automatically trigger the NPM publish workflow.

### Checking Build Status

- All pull requests will automatically run the CI workflow
- Check the Actions tab to see workflow status
- Green checkmarks indicate successful builds
- Red X marks indicate failures that need to be fixed

## Workflow Files Explained

### CI Workflow Features

- **Multi-Node Testing**: Tests on Node.js 18.x and 20.x
- **Code Quality**: Runs ESLint and Prettier checks
- **Build Verification**: Ensures TypeScript compilation works
- **Package Validation**: Checks package.json structure
- **Security**: Runs npm audit for vulnerabilities
- **Dry Run**: Tests publishing without actually publishing

### Publish Workflow Features

- **Quality Gates**: Runs linting and building before publishing
- **Version Management**: Automatic version bumping for manual triggers
- **Git Integration**: Creates commits and tags automatically
- **NPM Publishing**: Publishes with public access
- **Release Creation**: Generates GitHub releases with changelog
- **Error Handling**: Validates build output before publishing

## Troubleshooting

### Common Issues

1. **NPM_TOKEN not working**
   - Ensure the token has correct permissions
   - Check token hasn't expired
   - Verify secret name is exactly `NPM_TOKEN`

2. **Permission denied errors**
   - Check repository workflow permissions
   - Ensure GITHUB_TOKEN has write access

3. **Build failures**
   - Check TypeScript compilation locally
   - Ensure all dependencies are properly declared
   - Verify dist folder is created correctly

4. **Version conflicts**
   - Ensure the version doesn't already exist on NPM
   - Check if git tags already exist

### Manual Recovery

If workflows fail and you need to publish manually:

```bash
# Build the project
npm run build

# Publish to NPM
npm publish --access public
```

## Best Practices

1. **Always test locally** before pushing changes
2. **Use semantic versioning** for version bumps
3. **Write meaningful commit messages** for version bumps
4. **Test the package** after publishing to ensure it works
5. **Monitor workflow runs** and fix issues promptly
6. **Keep dependencies updated** to avoid security issues

## Security Considerations

- Never commit NPM tokens to the repository
- Regularly rotate access tokens
- Monitor package downloads for unusual activity
- Keep dependencies updated to avoid vulnerabilities
- Use `npm audit` regularly to check for security issues
