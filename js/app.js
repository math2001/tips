"use strict";

const tip_template = document.getElementById('tip-template').textContent
const tipsElement = document.getElementById('tips')
const baseurl = '/tips/#'
let tips

function getLocationObject() {
    return new URI(location.hash.substring(1))
}

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

function renderTips(tips) {
    tipsElement.classList.add('fadeOut')
    let html = ''
    tips.some(tip => {
        tip.formated_date = strftime('%A %d %B %Y at %H:%M', new Date(tip.timestamp))
        tip.content = markdownToHTML(tip.content)
        html += Mustache.render(tip_template, Object.assign({baseurl: baseurl}, tip))
    })

    setTimeout(function () {
        tipsElement.innerHTML = html
        tipsElement.classList.remove('fadeOut')
    }, 100)
}

function filterTips(tips, params) {
    const args = params.search(true)
    if (args.withtag !== undefined) {
        args.withtag = args.withtag.split(',')
    }
    return tips.filter(tip => {
        if (args.withtag !== undefined
            && args.withtag.every(tag => tip.tags.indexOf(tag) === -1)) {
            return false
        }
        if (args.contains !== undefined
            && (tip.title + tip.content).indexOf(args.contains) === -1) {
            return false
        }

        return true
    })
}

document.body.addEventListener('click', function (e) {
    if (e.target.classList.contains('tip-title')) {
        e.target.classList.toggle('active')
        const panel = e.target.nextElementSibling
        if (panel.style.maxHeight){
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        } 
    }
})

EM.on('tips-received', function (_tips) {
    tips = _tips
    renderTips(filterTips(_tips, getLocationObject()))
})

EM.on('navigate', function () {
    renderTips(filterTips(tips, getLocationObject()))
})

window.addEventListener('hashchange', function () {
    EM.fire('navigate')
})

var xhr = new XMLHttpRequest();
xhr.open('GET', 'tips.json')
xhr.send(null)
xhr.addEventListener('readystatechange', function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        EM.fire('tips-received', JSON.parse(xhr.responseText))
    }
}, false);

