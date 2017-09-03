---
title: How do I get the ASCII value of a character in vim?
slug: get-ascii-value-character-vim
tags: vim, ascii
date: Saturday 26 August 2017 @ 08:53
place: In the car, going to ski
---

To get the ASCII value of the character under the cursor, just press `ga` (or
run `:ascii`).

It'll print it in three format: in decimal, hexadecimal and octal.

So, when your cursor is on an arrow and that you press `ga`: →, you'll see at the
bottom:

```
<→> 8594, Hex: 2192, Octal: 20622
```
> Mnemonic: Get ASCII value.
> ­ from `:help :ascii`

