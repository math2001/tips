---
title: The confirm option on VIM
slug: config-option-vim
tags: vim, option
date: Sunday 03 September 2017 @ 14:51
---

This is probably one of my favorite option in VIM. Just add this to your `.vimrc`:

    set confirm

This will affect different command in VIM: instead of just failing (and telling
you to use force if you want to overwrite), it'll show a confirm "popup" at the
bottom and you'll be good to do.

## Quick example

When you want to quit a file that isn't saved, here's what you get:

    E37: No write since last change (add ! to override)

With the `confirm` option on, you get

    Save changes to "tips/vim-confirm.md"?
    [Y]es, (N)o, (C)ancel:

You just need to press the corresponding letter (not even <kbd>enter</kbd>), and
you'll be good to go!

