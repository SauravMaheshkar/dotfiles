# set aliases
alias .. = "cd .."
alias c="clear"
alias ls="ls -Alh --color=auto"
alias fetch="fastfetch"

# set homebrew path
export PATH="/opt/homebrew/bin:$PATH"
export PATH="/opt/homebrew/sbin:$PATH"

# set config home
export XDG_CONFIG_HOME="$HOME/.config"

# source cargo
. "$HOME/.cargo/env"

# source starship prompt
eval "$(starship init zsh)"

# source fzf
source <(fzf --zsh)

# source zoxide
eval "$(zoxide init zsh --cmd cd)"

# helper scripts
nvim-clean() {
  rm -rf ~/.local/share/nvim/lazy/mason.nvim \
         ~/.local/share/nvim/lazy/mason-lspconfig.nvim \
         ~/.local/share/nvim/lazy/lazy.nvim \
         ~/.local/share/nvim/mason \
         ~/.local/state/nvim/lazy
}

# bun completions
[ -s "/Users/sauravmaheshkar/.bun/_bun" ] && source "/Users/sauravmaheshkar/.bun/_bun"

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
