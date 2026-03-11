# vscode-almide

VS Code extension for the [Almide](https://github.com/almide/almide) programming language.

## Features

- Syntax highlighting for `.almd` files
- Bracket matching and auto-closing
- Comment toggling (`//` and `(* *)`)
- Code folding

## Install

Download the latest `.vsix` from [Releases](https://github.com/almide/vscode-almide/releases), then:

```bash
code --install-extension almide-lang-0.1.0.vsix
```

## Build from source

```bash
npm install -g @vscode/vsce
vsce package
code --install-extension almide-lang-0.1.0.vsix
```

## License

MIT
