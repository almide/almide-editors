# almide-editors

Editor integrations for the Almide programming language (.almd).

## Structure

- `grammar/` - Shared TextMate grammar (`almide.tmLanguage.json`)
- `vscode/` - VS Code extension ("Almide")
- `chrome/` - Chrome extension ("Almide Highlight for GitHub")

## Grammar

The TextMate grammar in `grammar/` is the single source of truth. Both extensions reference it:
- VS Code: copied to `vscode/syntaxes/` at packaging time
- Chrome: imported directly via `../../grammar/` and bundled by esbuild

## VS Code Extension

```bash
cd vscode
# Package
npx vsce package
# Publish (requires Azure DevOps PAT)
npx vsce publish
```

## Chrome Extension

```bash
cd chrome
npm install
node build.mjs    # outputs to dist/
```

Load `chrome/dist/` as unpacked extension in `chrome://extensions`.

Uses Shiki (with JS regex engine) to highlight .almd files on GitHub.
Fetches raw source via `/raw/` URL and tokenizes with the shared grammar.

## Publishing

- VS Code Marketplace: publisher `almide`, package `almide-lang`
- Chrome Web Store: developer registration ($5), upload dist/ as zip
