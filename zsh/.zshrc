# set aliases
alias c="clear"
alias ls="ls -Alh --color=auto"

# set homebrew path
export PATH="/opt/homebrew/bin:$PATH"

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
