{ pkgs }:

let
  basic = with pkgs; [ jq fd git tree wget unzip ripgrep coreutils findutils ];

  buildTools = with pkgs; [ cmake just pkg-config pre-commit rustc ];

  jsTools = (with pkgs; [ nodejs ] ++ (with nodePackages; [ pnpm ]));

  misc = with pkgs; [ neofetch stow gh glow tokei ];

  nixTools = with pkgs; [ nixfmt ];

  pythonTools = with pkgs; [ python310 python310Packages.pip ];

  rustTools = with pkgs; [ cargo clippy ];
in
basic ++ buildTools ++ jsTools ++ misc ++ nixTools ++ pythonTools
++ rustTools
