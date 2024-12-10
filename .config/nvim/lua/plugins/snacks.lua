-- References:-
-- * https://github.com/folke/snacks.nvim
return {
	"folke/snacks.nvim",
	priority = 1000,
	lazy = false,
	opts = {
		bigfile = { enabled = true },
		notifier = { enabled = true },
		statuscolumn = { enabled = true },
		words = { enabled = true },
	},
}
