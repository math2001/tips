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
        this.bindEvents()

        if (new URI().domain() !== 'localhost') {
            const addTip = document.querySelector('#add-tip')
            addTip.parentNode.removeChild(addTip)
        }
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
        tip.scrollIntoView({
            behavior: "smooth"
        })
        tip.classList.add('active')
    }

    static render(tips, hashLocation, reRender) {
        const activeTip = this.getActiveTip()
        if (activeTip !== null){
            activeTip.classList.remove('active')
        }
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

    static getActiveTip() {
        return this.element.querySelector('.tip-title.active')
    }

    static bindEvents() {

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

        EM.on('active-next-tip', () => {
            let activeTip = this.getActiveTip()
            if (activeTip === null) {
                activeTip = this.element.querySelector('.tip-title')
            }
            let nextTip = activeTip
                                .nextElementSibling
                                .nextSibling
                                .nextElementSibling
            if (nextTip === null) {
                nextTip = this.element.querySelector('.tip-title')
            }
            EM.fire('navigate', nextTip.getAttribute('data-slug'))
        })
        EM.on('active-prev-tip', () => {
            let activeTip = this.getActiveTip()
            if (activeTip === null) {
                activeTip = this.element.querySelector('.tip-title:last-of-type')
            }
            let previousTip = activeTip.previousElementSibling
            if (previousTip === null) {
                previousTip = this.element.querySelector('.tip-title:last-of-type')
            } else {
                previousTip = previousTip.previousElementSibling
            }
            EM.fire('navigate', previousTip.getAttribute('data-slug'))
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

