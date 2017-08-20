"use strict";

if (typeof document === "undefined") {
    var showdown = require('showdown')
    var hljs = require('highlight.js')
    var {JSDOM} = require('jsdom')
}

const DOMParser = function (html) {
    return new JSDOM(html).window.document
}

const markdownToHTML = (function () {
    const converter = new showdown.Converter()
    converter.setOption('simplifiedAutoLink', true)
    converter.setOption('excludeTrailingPunctuationFromURLs', true)
    converter.setOption('tables', true)
    converter.setOption('strikethrough', true)
    converter.setOption('ghMentions', true)
    converter.setOption('ghMentionsLink', true)
    converter.setOption('ghCodeBlocks', true)
    converter.setOption('openLinksInNewWindow', true)
    converter.setOption('tasklists', true)

    return function (markdown) {
        const nodes = DOMParser.parseFromString(converter.makeHtml(markdown), 'text/html')
        const codes = Array.from(nodes.getElementsByTagName('pre'))
            .map(pre => pre.getElementsByTagName('code')[0])
            .filter(code => code !== null)
        for (var i = codes.length - 1; i >= 0; i--) {
            codes[i].className = codes[i].getAttribute('class')
            hljs.highlightBlock(codes[i])
        }
        return nodes.body.innerHTML
    }
})()

var copyToClipboard = (function () {
    if (typeof document === "undefined") {
        return 
    }

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

if (typeof module !== "undefined") {
    module.exports = {
        markdownToHTML: markdownToHTML
    }
}
