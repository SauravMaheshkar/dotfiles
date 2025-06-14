# set aliases
alias c="clear"
alias ls="ls -Alh --color=auto"

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

# The next line updates PATH for the Google Cloud SDK.
if [ -f '/Users/sauravmaheshkar/google-cloud-sdk/path.zsh.inc' ]; then . '/Users/sauravmaheshkar/google-cloud-sdk/path.zsh.inc'; fi

# The next line enables shell command completion for gcloud.
if [ -f '/Users/sauravmaheshkar/google-cloud-sdk/completion.zsh.inc' ]; then . '/Users/sauravmaheshkar/google-cloud-sdk/completion.zsh.inc'; fi
