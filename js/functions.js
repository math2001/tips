"use strict";

const markdownToHTML = (function () {
    const converter = new showdown.Converter()
    converter.setOption('simplifiedAutoLink', true)
    converter.setOption('excludeTrailingPunctuationFromURLs', true)
    converter.setOption('tables', true)
    converter.setOption('strikethrough', true)
    converter.setOption('ghCodeBlocks', true)
    converter.setOption('ghMentions', true)
    converter.setOption('ghMentionsLink', true)
    converter.setOption('openLinksInNewWindow', true)
    converter.setOption('tasklists', true)
    converter.setOption('ghCodeBlocks', true)

    return function (markdown) {
        const nodes = new DOMParser().parseFromString(converter.makeHtml(markdown), 'text/html')
        const codes = nodes.querySelectorAll('pre code')
        for (var i = codes.length - 1; i >= 0; i--) {
            hljs.highlightBlock(codes[i])
        }
        return nodes.body.innerHTML
    }
})()

var copyToClipboard = (function () {

    const textarea = document.createElement('textarea')
    // hide the textarea (since we can't use display: none, it's a bit long)
    textarea.style.opacity = 0
    textarea.style.width = 0
    textarea.style.height = 0
    textarea.style.position = 'absolute'
    textarea.style.bottom = '-100%'
    textarea.style.left = '-100%'
    textarea.style.margin = 0
    document.body.appendChild(textarea)

    return function (text) {
        textarea.value = text
        textarea.select()
        document.execCommand('copy')
    }
})()
