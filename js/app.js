"use strict";

const tip_template = document.getElementById('tip-template').textContent
const tipsElement = document.getElementById('tips')
const baseurl = '/tips/#'
let tips

function getLocationObject() {
    return new URI(location.hash.substring(1))
}

function renderTips(tips) {
    let html = ''
    tips.some(tip => {
        tip.formated_date = strftime('%A %d %B %Y at %H:%M', new Date(tip.timestamp))
        html += Mustache.render(tip_template, Object.assign({baseurl: baseurl}, tip))
    })

    tipsElement.innerHTML = html

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