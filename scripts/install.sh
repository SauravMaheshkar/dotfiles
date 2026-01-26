#!/bin/bash

detect_os() {
  case "$(uname -s)" in
  Darwin*)
    echo "macos"
    ;;
  Linux*)
    echo "linux"
    ;;
  *)
    echo "unknown"
    ;;
  esac
}

install_macos_packages() {
  local brewfile="packages/brew-deps.txt"

  if ! brew bundle --file="$brewfile"; then
    echo "Error: Failed to install packages using brew bundle"
    exit 1
  fi
  echo "Successfully installed pkgs"
}

main() {
  local os_type=$(detect_os)

  case "$os_type" in
  "macos")
    echo "Detected macOS, installing packages..."
    install_macos_packages
    ;;
  "linux")
    echo "NotImplementedError: Linux package installation not yet implemented"
    exit 1
    ;;
  *)
    echo "Error: Unsupported operating system: $os_type"
    exit 1
    ;;
  esac
}

main "$@"
