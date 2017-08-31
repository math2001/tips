const DEV = true
if (DEV) 
console['log']('-'.repeat(100))

const fs = require('fs')
const showdown = require('showdown')
const hljs = require('highlight.js')
const {JSDOM} = require('jsdom')

const HTMLParser = function (html) {
    return new JSDOM(html).window.document
}

const markdownToHTML = (function () {
    const converter = new showdown.Converter()
    converter.setOption({
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
    lineendings: /\r|\n|\r\n|\n\r/g
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
        fs.readFile(`${file}`, 'utf8', (err, content) => {
            if (err) throw err
            resolve(content)
        })
    })
}

function loadTip(file) {
    return loadFile(`./tips/${file}`).then(content => {
        return parseTip(content, file)
    })
}

function loadTips() {
    const files = fs.readdirSync('./tips').filter(file => file.endsWith('.md'))
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
        for (let link of dom.querySelectorAll('tip-link')) {
            actualLink = HTMLParser().createElement('a')
            to = link.getAttribute('to')
            if (to === null) {
                console.error(`<tip-link> hasn't got a 'to' attribute in ${filename}`)
                continue
            }
            tip = tips[to]
            if (tip === undefined) {
                console.error(`<tip-link>'s 'to' attribute points to a ` +
                                `non-existing file ('${to}') in '${filename}'`)
                continue
            }
            if (link.innerHTML !== '') innerHTML = link.innerHTML
            else innerHTML = tip.title
            actualLink.href = '#' + tip.slug
            link.outerHTML = actualLink.outerHTML
        }
        tips[filename].content = dom.body.innerHTML
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
        return formattedTips
    }).then(tips => {
        tips = fileLinks(tips)
    })
}

main()
