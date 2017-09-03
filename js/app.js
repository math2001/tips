// Events
// - navigate -> changes the hash
// - navigated -> the hash has been change

// The advantage is that navigated can be fired by the user
// (if he edits the hash manually) or by JavaScript, and it has
// the exact same effect

function hasUpperCaseLetter(string, default_=false) {
    if (typeof string !== 'string') return default_
    for (let char of string)
        if (char !== char.toLowerCase()) return true
    return false
} 

function getHashLocation() {
    return new URI(location.hash.substring(1))
}

const App = {

    init() {
        this.tips = this.parseTipsFromHTML()
        this.bindEvents()
        this.error404 = document.querySelector('#e404')
        this.error404input = this.error404.querySelector('#e404-search-input')
        this.searchNbResult = document.querySelector('#search-nb-result')
    },

    bindEvents() {
        EM.on('navigated', args => {
            const {hashLocation} = args
            this.renderTips(hashLocation.pathname(), this.formatSearchObject(hashLocation.search(true)))
        })

        EM.on('active-tip', direction => {
            EM.fire('navigate', getHashLocation().pathname(this.getTip(direction) || ''))
        })

        EM.on('active-first-tip', () => {
            let slug
            try {
                slug = this.tips.find(tip => !tip.hidden).slug
            } catch (e) {
                slug = ''
            }
            EM.fire('navigate', getHashLocation().pathname(slug))
        })

    },

    getActiveTipIndex() {
        return this.tips.findIndex(tip => tip.active)
    },

    getTip(direction) {
        // return slug of next/previous tip

        const tips = this.tips.filter(tip => !tip.hidden)
        const nbShownTips = tips.length

        const currentTipIndex = tips.findIndex(tip => tip.active)
        if (currentTipIndex === -1) return tips[0].slug

        if (nbShownTips === 0) return ''

        if (currentTipIndex === nbShownTips - 1 && direction === 'next')
            return tips[currentTipIndex].slug

        try {
            let activeTip
            for (let i=1;i<tips.length;i++) {
                if (direction == 'next') {
                    activeTip = tips[currentTipIndex+i]
                } else if (direction == 'prev') {
                    activeTip = tips[currentTipIndex-i]
                }
                if (activeTip.hidden === false) {
                    activeTip.active = true
                    return activeTip.slug
                }
            }
            // here, no tip has been found
        } catch (e) {
            return false
        }
        return false
    },

    formatSearchObject(searchObject) {
        const caseSensitive = !!(hasUpperCaseLetter(searchObject.contains)
                              || (searchObject.tags && searchObject.tags.some(tag => hasUpperCaseLetter(tag))))
        searchObject.caseSensitive = caseSensitive
        if (searchObject.withtag !== undefined) 
            searchObject.withtag = (caseSensitive ?
                                    searchObject.withtag :
                                    searchObject.withtag.toLowerCase()).split(',')

        if (searchObject.contains !== undefined && !caseSensitive)
            searchObject.contains = searchObject.contains.toLowerCase()

        return searchObject
    },

    parseTipsFromHTML() {
        const tipElements = document.querySelectorAll('.tip-title')
        const tips = []
        for (let tipElement of tipElements) {
            tips.push({
                DOMElement: tipElement,
                title: tipElement.firstElementChild.textContent,
                wordcontent: tipElement.nextElementSibling.firstElementChild.textContent.trim(),
                tags: tipElement.lastElementChild.textContent.trim().split('\n').map(tag => tag.trim()),
                slug: tipElement.getAttribute('data-slug'),
                active: tipElement.classList.contains('active'),
                hidden: tipElement.classList.contains('hidden')
            })
        }
        return tips
    },

    isHidden(tip, searchObject) {
        if (searchObject.withtag !== undefined
            && !searchObject.withtag.every(tag =>
                tip.tags.includes(searchObject.caseSensitive ? tag : tag.toLowerCase()))) {
            return true
        }
        if (searchObject.contains !== undefined
            && (searchObject.caseSensitive ? tip.wordcontent :
                tip.wordcontent.toLowerCase()).indexOf(searchObject.contains) === -1)
            return true
        return false
    },

    isSearching(searchObject) {
        return Object.keys(searchObject).length > 1
    },

    renderTips(activeSlug, searchObject) {
        // render tips and update this.tips
        if (this.errorShown) {
            this.errorShown = false
            this.error404.classList.add('hidden')
        }

        let activeTip, tipCount = 0
        for (let tip of this.tips) {
            tip.active = false
            tip.hidden = this.isHidden(tip, searchObject)
            tip.DOMElement.classList.toggle('hidden', tip.hidden)

            if (tip.slug === activeSlug) activeTip = tip

            tip.DOMElement.classList.toggle('active', tip.slug === activeSlug)

            if (!tip.hidden) tipCount += 1
        }

        if (activeTip) {
            activeTip.DOMElement.scrollIntoView({behavior: 'smooth'})
            activeTip.active = true
        } else window.scrollTo({top: 0, behavior: 'smooth'})

        if (this.isSearching(searchObject)) {
            if (tipCount === 0) this.show404()
            else this.searchNbResult.textContent = tipCount + " result" + (tipCount > 1 ? 's' : '')
        } else {
            this.searchNbResult.textContent = ''
        }
    },

    show404() {
        this.searchNbResult.textContent = ''
        this.errorShown = true
        this.error404input.textContent = Search.inputValue()
        this.error404.classList.remove('hidden')
    }

}

document.addEventListener('DOMContentLoaded', function () {

    TagList.init()
    Shortcuts.init()
    Search.init()
    App.init()

    EM.on('navigate', uri => {
        // uri is an URI object, not just a string
        if (typeof uri === 'string')
            throw new Error('[Internal error] navigate event takes an URI object, not a string')
        location.hash = '#' + uri.toString()
    })

    window.addEventListener('hashchange', (e) => {
        EM.fire('navigated', {
            hashLocation: getHashLocation(),
            previousHashLocation: new URI(new URI(e.oldURL).hash().slice(1))
        })
    })

    EM.fire('navigated', { hashLocation: getHashLocation() })
})
