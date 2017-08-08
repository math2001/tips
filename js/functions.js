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
