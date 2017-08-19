"use strict";

const baseurl = '/tips/#'

function getHashLocation() {
    return new URI(location.hash.substring(1))
}

class Tips {

    static init() {
        this.template = document.getElementById('tip-template').textContent
        this.element = document.getElementById('tips')
        this.bindDOM()
        this.bindEvent()
    }

    static bindDOM() {

        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('tip-title')) {
                const uri = getHashLocation()
                uri.pathname(e.target.getAttribute('data-slug'))
                EM.fire('navigate', uri)
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

    static scrollToActiveTip() {
        const slug = getHashLocation().pathname().replace('""', '\\"')
        if (slug === "") {
            return 
        }
        const tip = document.querySelector('.tip-title[data-slug="%s"]'.replace('%s', slug))
        if (tip === null) {
            return 
        }
        tip.scrollIntoView(true)
        
    }

    static render(tips, hashLocation, reRender) {
        if (!reRender) {
            const slug = hashLocation.pathname().replace('"', '\\"')
            const tip = this.element.querySelector(`[data-slug="${slug}"]`)
            if (tip === null) return
            tip.classList.add('active')
            this.scrollToActiveTip()
            return
        }
        this.element.classList.add('fadeOut')
        let html = ''
        const pathname = hashLocation.pathname()
        let activeTip
        tips.some(tip => {
            html += Mustache.render(this.template, Object.assign({baseurl,
                active: tip.slug === pathname ? ' active' : ''}, tip))
        })

        setTimeout(() => {
            this.element.classList.remove('fadeOut')
            this.element.innerHTML = html
            this.scrollToActiveTip()
        }, 100)
    }

    static getAvailableTips(hashLocation) {
        const args = hashLocation.search(true)
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

        EM.on('navigated', args => {
            let reRender = false
            if (typeof args.previousHashLocation === 'undefined') {
                reRender = true
            } else if (args.hashLocation.search() !== args.previousHashLocation.search()) {
                reRender = true
            }
            this.render(this.getAvailableTips(args.hashLocation), args.hashLocation, reRender)
        })

        EM.on('tips-received', tips => {
            this.tips = this.format(tips)
            EM.fire('navigated', {hashLocation: getHashLocation()})
        })
    }

}


EM.on('navigate', newHashLocation => {
    location.hash = '#' + newHashLocation.toString()
})

Tips.init()
Search.init()
Shortcuts.init()

window.addEventListener('hashchange', function (e) {
    EM.fire('navigated', {hashLocation: getHashLocation(), previousHashLocation: new URI(new URI(e.oldURL).hash().slice(1))})
})


var xhr = new XMLHttpRequest();
xhr.open('GET', 'tips.json')
xhr.send(null)
xhr.addEventListener('readystatechange', function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        EM.fire('tips-received', JSON.parse(xhr.responseText))
    }
}, false);

