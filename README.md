# almide-editors

Editor support for the [Almide](https://github.com/almide/almide) programming language.

## Structure

```
grammar/        TextMate grammar (shared by all editors)
vscode/         VS Code extension
chrome/         Chrome extension for GitHub highlighting (planned)
```

## VS Code Extension

### Install from source

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

## TextMate Grammar

The grammar at `grammar/almide.tmLanguage.json` can be used by any editor that supports TextMate grammars (VS Code, Sublime Text, etc.).

## License

MIT
