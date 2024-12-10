#!/usr/bin/env bash
stow -d .config -t ~/.config .
stow -d zsh -t ~ . --ignore=setup.sh --ignore=update.sh
