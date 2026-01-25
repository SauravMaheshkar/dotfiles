find **/.DS_Store | xargs rm
brew upgrade && brew cleanup
uv self update
rustup update
