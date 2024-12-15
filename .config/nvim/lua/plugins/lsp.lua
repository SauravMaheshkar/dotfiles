return {
  { import = "lazyvim.plugins.extras.lang.json" },

  { import = "lazyvim.plugins.extras.lang.python" },

  {
    "williamboman/mason.nvim",
    opts = {
      ensure_installed = {
        "stylua",
        "shellcheck",
        "shfmt",
        "ruff",
      },
    },
  },
}
