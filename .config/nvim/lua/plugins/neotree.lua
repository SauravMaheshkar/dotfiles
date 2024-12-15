return {
  "nvim-neo-tree/neo-tree.nvim",
  opts = {
    filesystem = {
      filtered_items = {
        visible = true, -- Shows hidden files (dotfiles)
        hide_dotfiles = false, -- Don't hide dotfiles
      },
    },
  },
}
