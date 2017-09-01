const startTime = Date.now()
const DEV = true
if (DEV) 
console['log']('-'.repeat(100))

const {readdirSync, readFile} = require('fs')
const {Converter: MarkdownConverter} = require('showdown')
const hljs = require('highlight.js')
const DOMParser = new (require('dom-parser'))()

const HTMLParser = function (html) {
    return DOMParser.parseFromString(html)
}

const markdownToHTML = (function () {
    const converter = new MarkdownConverter({
        simplifiedAutoLink: true,
        excludeTrailingPunctuationFromURLs: true,
        tables: true,
        strikethrough: true,
        ghMentions: true,
        ghMentionsLink: true,
        ghCodeBlocks: true,
        openLinksInNewWindow: true,
        tasklists: true
    })

    return function (markdown) {
        let html = converter.makeHtml(markdown)
        return html
        const dom = HTMLParser(html)
        let className, language, highlightedPre
        for (let pre of dom.getElementsByTagName('pre')) {
            className = pre.firstChild.getAttribute('class')
            if (className === null) continue
            language = className.split(' ').filter(str => str.startsWith('language-'))[0]
            if (language !== undefined) language = language.slice(9)
            index = html.indexOf(pre.outerHTML)
            if (index === -1) {
                throw new Error('Cannot find pre block')
            }
            highlightedPre = hljs.highlight(language, pre.firstChild.innerHTML).value
            html = stringIndexReplace(html, index, index + pre.outerHTML.length, highlightedPre)
        }
        return html

        const nodes = HTMLParser(converter.makeHtml(markdown), 'text/html')
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

const tips = {}
const regexes = {
    yamlFrontMatter: /^---\n[^]*^---\n/m,
    lineendings: /(\r|\n|\r\n|\n\r)+/g
}

// functions (tools)

function getKeyValue(string) {
    let [key, ...values] = string.split(':')
    return [key, values.join(':').trim()]
}

function monthToInt(month) {
    return new Date(Date.parse(month + "1, 2000")).getMonth()
}

function loadFile(file) {
    return new Promise((resolve, reject) => {
        readFile(`${file}`, 'utf8', (err, content) => {
            if (err) throw err
            resolve(content)
        })
    })
}

function stringIndexReplace(originalString, indexStart, indexEnd, string) {
    return originalString.slice(0, indexStart) + string + originalString.slice(indexEnd)
}

// functions

function loadTip(file) {
    // asyncally parse tip
    return loadFile(`./tips/${file}`).then(content => {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve(parseTip(content, file))
            }, 0)
        })
    })
}

function loadTips() {
    const files = readdirSync('./tips').filter(file => file.endsWith('.md'))
    console.info('Got dirs...')
    const promises = []
    for (let file of files) {
        promises.push(loadTip(file))
    }
    return Promise.all(promises)
}

function parseTip(content, filename) {
    const parseFrontMatter = frontMatter => {
        const obj = {}
        frontMatter = frontMatter.trim().split('\n')
        for (let line of frontMatter) {
            let [key, value] = getKeyValue(line)
            if (key === 'tags') {
                value = value.split(',').map(tag => tag.trim())
            }
            if (key === 'date') {
                const matches = value.match(/(\w+) (\d+) (\w+) (\d+) @ (\d+):(\d+)/)
                value = new Date(parseInt(matches[4]), monthToInt(matches[3]), parseInt(matches[2]),
                                 parseInt(matches[5]), parseInt(matches[6])).getTime()
            }
            obj[key] = value
        }
        return obj
    }

    const parse = content => {
        content = content.replace(regexes.lineendings, '\n')
        const matches = regexes.yamlFrontMatter.exec(content)
        let frontMatter = {}
        if (matches !== null) {
            content = content.slice(matches[0].length).trim()
            frontMatter = parseFrontMatter(matches[0].slice(4, -4))
        } else {
            console.warn(`The file ${filename} doesn't have any yaml front matter`)
        }
        content = markdownToHTML(content)
        return Object.assign({}, frontMatter, { content: content })
    }

    return Object.assign({
        filename: filename,
    }, parse(content))
}

function fileLinks(tips) {
    let dom, to, innerHTML, actualLink, tip
    for (let filename in tips) {
        dom = HTMLParser(tips[filename].content)
        for (let link of dom.getElementsByTagName('tiplink')) {
            actualLink = '<a href="'
            to = link.getAttribute('to')
            if (to === null) {
                console.error(`<tiplink> hasn't got a 'to' attribute in ${filename}`)
                continue
            }
            tip = tips[to]
            if (tip === undefined) {
                console.error(`<tiplink>'s 'to' attribute points to a ` +
                                `non-existing file ('${to}') in '${filename}'`)
                continue
            }
            actualLink += '#' + tip.slug + '">'
            if (link.innerHTML !== '') actualLink += link.innerHTML
            else actualLink += tip.title
            actualLink += '</a>'
            index = tips[filename].content.indexOf(link.outerHTML)
            if (index === -1) throw new Error('Cannot find original link to replace it with')
            tips[filename].content = stringIndexReplace(tips[filename].content, index,
                                                        index + link.outerHTML.length, actualLink)
        }
    }
    return tips
}

function main() {
    loadTips().then(tips => {
        const formattedTips = {}
        for (let tip of tips) {
            formattedTips[tip.filename] = tip
            delete formattedTips[tip.filename].filename
        }
        return fileLinks(formattedTips)
    }).then(tips => {
        console.info(`Done parsing ${Object.keys(tips).length} tips in ${Date.now() - startTime }ms.`)
    }).catch(err => {
        console.error(err.stack)
    })
}

main()
