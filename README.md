# almide-editors

Editor support for the [Almide](https://github.com/almide/almide) programming language.

## Structure

```
grammar/        TextMate grammar (shared by all editors)
vscode/         VS Code extension
chrome/         Chrome extension for syntax highlighting
```

## VS Code Extension — "Almide"

Syntax highlighting for `.almd` files in VS Code.

### Install

Download the latest `.vsix` from [Releases](https://github.com/almide/almide-editors/releases), then:

```bash
code --install-extension almide-lang-0.1.0.vsix
```

### Build from source

```bash
cd vscode
npm install -g @vscode/vsce
vsce package
code --install-extension almide-lang-0.1.0.vsix
```

### Features

- Syntax highlighting for `.almd` files
- Bracket matching and auto-closing
- Comment toggling (`//` and `(* *)`)
- Code folding

## Chrome Extension — "Almide Highlight"

Syntax highlighting for Almide on the web.

- `.almd` files on GitHub (blob view)
- `` ```almide `` / `` ```almd `` fenced code blocks on any website
- Light / dark theme support (based on system preference or GitHub setting)

### Install

1. Clone this repo
2. Build the extension:
   ```bash
   cd chrome
   npm install
   node build.mjs
   ```
3. Open `chrome://extensions` → Enable "Developer mode"
4. Click "Load unpacked" → Select the `chrome/dist/` directory

## TextMate Grammar

The grammar at `grammar/almide.tmLanguage.json` can be used by any editor that supports TextMate grammars (VS Code, Sublime Text, etc.).

## License

MIT
