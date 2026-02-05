import type { Plugin } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";

export const CodeSimplifierPlugin: Plugin = async ({ project, client, $, directory, worktree }) => {
  return {
    tool: {
      simplify_code: tool({
        description: `Simplifies and refines code for clarity, consistency, and maintainability while preserving exact functionality.

Focus on recently modified code unless instructed otherwise. This tool:
1. Analyzes code for complexity and readability issues
2. Applies simplifications that preserve all functionality
3. Follows project coding standards and best practices
4. Focuses on code that has been recently modified

Use this tool when:
- The user asks to "simplify", "clean up", or "refactor for clarity"
- After significant code changes to ensure maintainability
- Code reviews identify overly complex or verbose code`,
        args: {
          target: tool.schema.string().optional().describe("Path to file or directory to simplify. If not provided, analyzes recently modified code"),
          scope: tool.schema.enum(["recent", "file", "directory"]).default("recent").describe("Scope of code to analyze: recent changes, single file, or directory"),
        },
        async execute(args, context) {
          const { directory, worktree } = context;

          // Determine what files to analyze
          let filesToAnalyze: string[] = [];

          if (args.scope === "recent") {
            // Get recently modified files using git
            try {
              const stagedFiles = await $`git diff --staged --name-only`.text();
              const unstagedFiles = await $`git diff --name-only`.text();
              filesToAnalyze = [...stagedFiles.split('\n').filter(f => f), ...unstagedFiles.split('\n').filter(f => f)];

              if (filesToAnalyze.length === 0) {
                return "No recently modified files found. Try specifying a target file or directory.";
              }
            } catch (e) {
              return "Could not detect recently modified files. Try specifying a target file or directory.";
            }
          } else if (args.target) {
            // Check if it's a file or directory
            try {
              const stat = await $`test -d ${args.target} && echo "dir" || echo "file"`.text();
              if (stat.trim() === "dir") {
                // Get all files in directory
                const files = await $`find ${args.target} -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.py" -o -name "*.go" -o -name "*.rs"`.text();
                filesToAnalyze = files.split('\n').filter(f => f);
              } else {
                filesToAnalyze = [args.target];
              }
            } catch (e) {
              return `Could not access ${args.target}. Please check the path.`;
            }
          }

          // Read the content of files to analyze
          const fileContents: { path: string; content: string }[] = [];
          for (const file of filesToAnalyze.slice(0, 10)) { // Limit to 10 files
            try {
              const content = await $`cat ${file}`.text();
              fileContents.push({ path: file, content });
            } catch (e) {
              // Skip files that can't be read
              continue;
            }
          }

          if (fileContents.length === 0) {
            return "No valid files to analyze found.";
          }

          // Build the simplification prompt (modified slightly from original)
          const simplificationPrompt = `You are an expert code simplification specialist focused on enhancing code clarity, consistency, and maintainability while preserving exact functionality. Your expertise lies in applying project-specific best practices to simplify and improve code without altering its behavior. You prioritize readable, explicit code over overly compact solutions. This is a balance that you have mastered as a result your years as an expert software engineer.

You will analyze recently modified code and apply refinements that:

1. **Preserve Functionality**: Never change what the code does - only how it does it. All original features, outputs, and behaviors must remain intact.

2. **Apply Project Standards**: Follow the established coding standards including:

   **For TypeScript/JavaScript:**
   - Use ES modules with proper import sorting and extensions
   - Prefer \`function\` keyword over arrow functions
   - Use explicit return type annotations for top-level functions
   - Follow proper React component patterns with explicit Props types
   - Use proper error handling patterns (avoid try/catch when possible)
   - Maintain consistent naming conventions

   **For Python:**
   - Use \`uv\` for dependency management and running Python scripts
   - Follow PEP 8 naming conventions (snake_case for functions/variables, PascalCase for classes)
   - Use type hints for function signatures and variable annotations
   - Prefer explicit \`return\` statements over implicit None returns
   - Use list/dict comprehensions where they improve readability, but avoid over-complex one-liners
   - Follow the principle of "explicit is better than implicit" (PEP 20)

3. **Enhance Clarity**: Simplify code structure by:

   - Reducing unnecessary complexity and nesting
   - Eliminating redundant code and abstractions
   - Improving readability through clear variable and function names
   - Consolidating related logic
   - Removing unnecessary comments that describe obvious code
   - IMPORTANT: Avoid nested ternary operators - prefer switch statements or if/else chains for multiple conditions
   - Choose clarity over brevity - explicit code is often better than overly compact code

   **For Python specifically:**
   - Add assertions where they help document assumptions and catch bugs early
   - Use docstrings for modules, classes, and functions following Google style or NumPy style
   - Prefer \`pathlib.Path\` over \`os.path\` for path manipulations
   - Use f-strings for string formatting instead of % formatting or .format()
   - Leverage built-in functions like \`enumerate()\`, \`zip()\`, and context managers (\`with\` statements)

4. **Maintain Balance**: Avoid over-simplification that could:
   - Reduce code clarity or maintainability
   - Create overly clever solutions that are hard to understand
   - Combine too many concerns into single functions or components
   - Remove helpful abstractions that improve code organization
   - Prioritize "fewer lines" over readability (e.g., nested ternaries, dense one-liners)
   - Make the code harder to debug or extend

5. **Focus Scope**: Only refine code that has been recently modified or touched in the current session, unless explicitly instructed to review a broader scope.

6. **Linting and Formatting for Python**:
   - Ensure code adheres to \`ruff\` linting rules (replaces flake8, black, isort, pydocstyle)
   - Run \`ruff check .\` and \`ruff format .\` on Python files
   - Follow ruff's default rule set including: E (pycodestyle errors), F (Pyflakes), I (isort), N (pep8-naming), W (pycodestyle warnings)
   - Use \`# noqa\` comments sparingly and only when absolutely necessary
   - Keep import sections organized: stdlib, third-party, first-party, with proper spacing

Your refinement process:

1. Identify the recently modified code sections
2. Analyze for opportunities to improve elegance and consistency
3. Apply project-specific best practices and coding standards
4. Ensure all functionality remains unchanged
5. Verify the refined code is simpler and more maintainable
6. Document only significant changes that affect understanding

For Python files, after simplification:
- Suggest running \`uv run ruff check <file>\` and \`uv run ruff format <file>\` to verify compliance
- Recommend adding type hints if they're missing
- Point out where assertions could strengthen the code

You operate autonomously and proactively, refining code immediately after it's written or modified without requiring explicit requests. Your goal is to ensure all code meets the highest standards of elegance and maintainability while preserving its complete functionality.

Files to analyze:
${fileContents.map(f => `\n=== ${f.path} ===\n${f.content}`).join('\n')}`;

          // Use the client to invoke simplification
          const response = await client.models.chat({
            messages: [
              {
                role: "system",
                content: simplificationPrompt,
              },
              {
                role: "user",
                content: "Please analyze and simplify the provided code files. Focus on improving clarity and maintainability while preserving exact functionality.",
              },
            ],
          });

          return response.content || "No simplifications suggested.";
        },
      }),
    },

    // Auto-suggest simplification after file edits
    "file.edited": async (input, output) => {
      // Check if the file is a code file
      const codeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.java', '.cpp', '.c', '.rb'];
      const isCodeFile = codeExtensions.some(ext => input.path.endsWith(ext));

      if (!isCodeFile) return;

      // Log suggestion (in practice, this would integrate with opencode's notification system)
      await client.app.log({
        body: {
          service: "code-simplifier",
          level: "info",
          message: `Code file edited: ${input.path}`,
          extra: { suggestion: "Consider running simplify_code to check for simplification opportunities" },
        },
      });
    },
  };
};
