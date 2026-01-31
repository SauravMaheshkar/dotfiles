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

install_homebrew() {
  if command -v brew &>/dev/null; then
    echo "Homebrew is already installed"
    return 0
  fi

  echo "Homebrew is not installed. Installing now..."

  if NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; then
    echo "Homebrew installation successful"

    if [[ "$(uname -m)" == "arm64" ]]; then
      eval "$(/opt/homebrew/bin/brew shellenv)"
    else
      eval "$(/usr/local/bin/brew shellenv)"
    fi
  else
    echo "Error: Homebrew installation failed"
    return 1
  fi
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
    install_homebrew
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
