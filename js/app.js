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
    },

    bindEvents() {
        EM.on('navigated', args => {
            const {hashLocation} = args
            this.renderTips(hashLocation.pathname(), this.formatSearchObject(hashLocation.search(true)))
        })
    },

    formatSearchObject(searchObject) {
        const caseSensitive = hasUpperCaseLetter(searchObject.contains)
                              || (searchObject.tags && searchObject.tags.some(tag => hasUpperCaseLetter(tag)))
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
        // return list of { title, wordcontent, tags, DOMElement }
        const tipElements = document.querySelectorAll('.tip-title')
        const tips = []
        for (let tipElement of tipElements) {
            tips.push({
                DOMElement: tipElement,
                title: tipElement.firstElementChild.textContent,
                wordcontent: tipElement.nextElementSibling.firstElementChild.textContent.trim(),
                tags: tipElement.lastElementChild.textContent.trim().split('\n').map(tag => tag.trim())
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
            && !(searchObject.caseSensitive ? tip.wordcontent :
                 tip.wordcontent.toLowerCase()).indexOf(searchObject.contains))
        return false
    },

    renderTips(activeSlug, searchObject) {
        for (let tip of this.tips) {
            tip.DOMElement.classList.toggle('hidden', this.isHidden(tip, searchObject))
            tip.DOMElement.classList.toggle('active', tip.slug === activeSlug)
        }
    }

}

App.init()
Search.init()
Shortcuts.init()

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

