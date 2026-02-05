opencode plugin variant of [anthropic's code-simplifier plugin](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-simplifier)

> [!NOTE]
  This plugin was generated with the help of opencode

## Tool Parameters

- **target** (optional): Path to file or directory to simplify
- **scope** (default: "recent"): Scope of code to analyze
  - `recent`: Analyze recently modified code (git diff)
  - `file`: Analyze a specific file
  - `directory`: Analyze all code files in a directory
