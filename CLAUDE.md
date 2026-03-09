# almide-editors

Editor integrations for the Almide programming language (.almd).

## Branch Strategy

- **main** — protected. Never commit directly. Only accepts PRs from `develop`
- **develop** — the working branch. All commits go here
- Always confirm `git branch` before committing
- Push to main triggers CI release (`.vsix` + Chrome zip → GitHub Releases)

## Git Commit Rules

- Write commit messages in **English only**
- No prefix (feat:, fix:, etc.)
- Keep it to one concise line

## Structure

- `grammar/` - Shared TextMate grammar (`almide.tmLanguage.json`)
- `vscode/` - VS Code extension ("Almide")
- `chrome/` - Chrome extension ("Almide Highlight")

## Grammar

The TextMate grammar in `grammar/` is the single source of truth. Both extensions reference it:
- VS Code: copied to `vscode/syntaxes/` at packaging time
- Chrome: imported directly via `../../grammar/` and bundled by esbuild

## VS Code Extension

```bash
cd vscode
npx vsce package
code --install-extension almide-lang-*.vsix
```

## Chrome Extension

```bash
cd chrome
npm install
node build.mjs    # outputs to dist/
```

Load `chrome/dist/` as unpacked extension in `chrome://extensions`.

## CI / Release

GitHub Actions (`.github/workflows/release.yml`) runs on push to main:
1. Builds `.vsix` (VS Code extension)
2. Builds `chrome-extension.zip` (Chrome extension)
3. Creates GitHub Release with version from `vscode/package.json`

To bump version: update `version` in `vscode/package.json` and `chrome/manifest.json`.
