---
title: Vim digraphs
slug: vim-digraphs
tags: vim, symbols
date: Friday 25 August 2017 @ 21:12
place: In the car, next to my sister
---

This is a pretty good thing if you use symbols that aren't on your keyboard, like
the copyright symbol for example (©).

Do you know how much time it took me to insert this symbol? Less than a second...
Do you know how much time it would have took you? Well, depending on your
internet connection, it might be about 10 seconds.

So, how did I do that? I just pressed <kbd>ctr+k</kbd>+<kbd>Co</kbd> (in insert
mode).

<kbd>ctrl+k</kbd> *in insert mode* listens for a shortcut, which will then insert
the corresponding symbol.

How do you know which one it is? Just look for it in the `:digraphs` list!

You can also define your own digraph:

```vim
:digraph .. …
```

You can also specify the decimal value of the symbol, like so:

```vim
:diagraph .. 8230
```

You might be wondering how you get the value... Well, have a look at this: <tiplink to="vim-ascii.md"></tiplink>

## Little cheat sheet

Because I'm nice (:smile:), I made a little list of the ones you might be likely
to use:

| Abbreviation | Symbol |
|--------------|--------|
| `Co`         | ©      |
| `TM`         | ™      |
| `->`         | →      |
| `<-`         | ←      |
| `=>`         | ⇒      |
| `<=`         | ⇐      |
| `12`         | ½      |
| `22`         | ²      |
| `<<`         | «      |
| `>>`         | »      |
| `Eu`         | €      |
| `$$`         | £      |
| `RT`         | √      |
| `--`         | ­      |


### If you're french

| Abbreviation | Symbol |
|--------------|--------|
| `e!`         | è      |
| `e'`         | é      |
| `e>`         | ê      |
| `oe`         | œ      |

Note: use upper cased abbreviation to get upper cased symbols

To learn more: `:help digraphs`
