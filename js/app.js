"use strict";

const baseurl = '/tips/#'

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

class Tips {

    static init() {
        this.template = document.getElementById('tip-template').textContent
        this.element = document.getElementById('tips')
        this.bindDOM()
        this.bindEvent()
    }

    static bindDOM() {

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
    }

    static format(tips) {
        tips.some(tip => {
            tip.formated_date = strftime('%A %d %B %Y at %H:%M', new Date(tip.timestamp))
            tip.content = markdownToHTML(tip.content)
        })
        return tips
    }

    static render(tips) {
        this.element.classList.add('fadeOut')
        let html = ''
        tips.some(tip => {
            html += Mustache.render(this.template, Object.assign({baseurl: baseurl}, tip))
        })

        setTimeout(() => {
            this.element.innerHTML = html
            this.element.classList.remove('fadeOut')
        }, 100)
    }

    static getAvailableTips() {
        const args = getLocationObject().search(true)
        if (args.withtag !== undefined) {
            args.withtag = args.withtag.split(',')
        }
        return this.tips.filter(tip => {
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

    static bindEvent() {

        EM.on('tips-received', tips => {
            this.tips = this.format(tips)
            EM.fire('navigate')
        })

        EM.on('navigate', () => {
            this.render(this.getAvailableTips())
        })
    }

}


Tips.init()
Search.init()

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

