---
title: Silent command-line mapping in VIM 
slug: silent-command-line-mapping-vim
tags: vim, map, command
date: Sunday 27 August 2017 @ 17:42
place: From a very warm car
---

If you want to set a mapping to run something that is echoed into the command
line (something starting with `:` or `/` for example) to *not* be displayed, you
can use the special argument `silent`, like so for example:

```vim
map <silent> <leader>r :MyCommand
```

By the way, <tip-link to="vim-difference-map-noremap.md">you should (almost) always use
`noremap`</tip-link>.

Learn more: `:help :map-silent`


