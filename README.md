# almide-editors

Editor integrations for the [Almide](https://github.com/almide/almide) programming language.

## VS Code Extension

Syntax highlighting, bracket matching, comment toggling, code folding for `.almd` files.

```bash
cd vscode
npx vsce package
code --install-extension almide-lang-*.vsix
```

Or download the latest `.vsix` from [Releases](https://github.com/almide/vscode-almide/releases).

## Grammar

The TextMate grammar (`syntaxes/almide.tmLanguage.json`) is generated from Almide source code:

```bash
almide run generator/main.almd
```

Keywords and scopes come from [almide-grammar](https://github.com/almide/almide-grammar) — the single source of truth for Almide syntax. When keywords change in `almide-grammar`, regenerating the TextMate grammar picks them up automatically.

## Structure

```
almide-editors/
  almide.toml                   declares almide-grammar dependency
  syntaxes/
    almide.tmLanguage.json      generated TextMate grammar (shared by both extensions)
  generator/
    main.almd                   TextMate grammar generator (Almide)
    almide_textmate.almd        pattern definitions — imports almide_grammar
    tmrule.almd                 TextMate rule types
  vscode/                       VS Code extension packaging
  language-configuration.json   bracket/comment config
```

## Dependencies

```toml
# almide.toml
[dependencies]
almide-grammar = { git = "https://github.com/almide/almide-grammar" }
```

The generator imports `almide_grammar` to get keyword groups, aliases, and scopes — no hardcoded keyword lists in the grammar definition.

## CI / Release

GitHub Actions (`.github/workflows/release.yml`) runs on push to main:

1. Builds `.vsix` (VS Code extension)
2. Creates GitHub Release with version from `vscode/package.json`

## License

MIT
