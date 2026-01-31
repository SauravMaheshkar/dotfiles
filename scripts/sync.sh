#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOTFILES_DIR="$(dirname "$SCRIPT_DIR")"

run_stow() {
  stow -d "$DOTFILES_DIR/.config" -t ~/.config .
  stow -d "$DOTFILES_DIR/zsh" -t ~ . --ignore=setup.sh --ignore=update.sh
  echo "Dotfiles synced successfully!"
}

main() {
  run_stow
}

main "$@"
