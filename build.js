const startTime = Date.now()
const DEV = true
if (DEV) 
console['log']('-'.repeat(100))

const {readdirSync, readFile, writeFile} = require('fs')
const {Converter: MarkdownConverter} = require('showdown')
const hljs = require('highlight.js')
const DOMParser = new (require('dom-parser'))()
const strftime = require('strftime')
const Mustache = require('mustache')
const CSSCleaner = new (require('clean-css'))({})
const UglifyJS = require('uglify-es')

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
        tasklists: true,
        headerLevelStart: 3
    })

    return function (markdown) {
        let html = converter.makeHtml(markdown)
        const dom = HTMLParser(html)
        let className, language, highlightedPre, toHighlight
        for (let pre of dom.getElementsByTagName('pre')) {
            pre = pre.firstChild
            toHighlight = pre.innerHTML
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
            className = pre.getAttribute('class')
            if (className === null) continue
            language = className.split(' ').filter(str => str.startsWith('language-'))[0]
            if (language === undefined) continue
            language = language.slice(9)
            index = html.indexOf(pre.innerHTML)
            if (index === -1) throw new Error('[Internal error] Cannot find pre block')
            highlightedPre = hljs.highlight(language, toHighlight).value
            html = stringIndexReplace(html, index, index + pre.innerHTML.length, highlightedPre)
        }
        return html
    }
})()

const tips = {}
const regexes = {
    yamlFrontMatter: /^---\n[^]*^---\n/m,
    lineendings: /\r\n|\n\r|\n|\r/g
}
const baseurl = '/tips/'
const tipTemplate = `\
<h3 class="tip-title" data-slug="{{ slug }}"> <a href="{{ baseurl }}#{{ slug }}">{{ title }}</a>
    <ul class="tip-tags">
        {{ #tags }}
            <li class="tip-tag"><a href="{{ baseurl }}#?withtag={{ . }}">{{ . }}</a></li>
        {{ /tags }}
    </ul>
</h3>
<div class="tip-panel">
    <div class="tip-content">
        {{{ content }}}
    </div>
    <p class="tip-date">— Published on {{ formatteddate }}</p>
</div>`

// functions (tools)

function getExecTime() {
    return (Date.now() - startTime) + 'ms'
}
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

function loadFiles(...filenames) {
    return Promise.all(filenames.map(filename => loadFile(filename)))
}

function stringIndexReplace(originalString, indexStart, indexEnd, string) {
    return originalString.slice(0, indexStart) + string + originalString.slice(indexEnd)
}

// functions

function loadTip(file) {
    // async parse tip
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
        return Object.assign({}, frontMatter, {
            content: markdownToHTML(content),
            formatteddate: strftime('%A %d %B %Y at %H:%M', new Date(frontMatter.date))
        })
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
            if (index === -1) throw new Error('[Internal error] Cannot find original link to replace it with')
            tips[filename].content = stringIndexReplace(tips[filename].content, index,
                                                        index + link.outerHTML.length, actualLink)
        }
    }
    return tips
}

function main() {
    const getTemplate = loadFile('./index.template.html')
    const insertTipsHere = 'INSERT_TIPS_HERE'
    const insertTagsHere = 'INSERT_TAGS_HERE'
    const insertCSSHere = 'INSERT_CSS_HERE'
    const insertJsHere = 'INSERT_JS_HERE'
    const files = ['./index.template.html', './css/style.css',
            'js/smooth-scroll.js', 'js/uri.js', 'js/shortcuts.js', 'js/event-manager.js',
            'js/search.js', 'js/tag-list.js', 'js/app.js']
    Promise.all([loadTips(), loadFiles(...files)]).then(args => {
        let [tips, files] = args

        let [template, CSS, ...jscontent] = files
        const jsfiles = {}

        for (let index in files.slice(2)) {
            jsfiles[files[index]] = jscontent[index]
        }

        const minifiedJs = UglifyJS.minify(jsfiles).code

        CSS = CSSCleaner.minify(CSS).styles

        const formattedTips = {},
              tags = []

        for (let tip of tips) {
            formattedTips[tip.filename] = tip
            delete formattedTips[tip.filename].filename
            for (let tag of tip.tags) {
                if (!tags.includes(tag)) tags.push(tag)
            }
        }

        tags.sort((a, b) => {
            [a, b] = [a.toLowerCase(), b.toLowerCase()]
            if (a < b) return -1
            else if (a > b) return 1
            else return 0
        })

        tips = fileLinks(formattedTips)

        let stringtags = ''
        for (let tag of tags) {
            stringtags += `<li class="tip-tag"><a href="${baseurl}#?withtag=${tag}">${tag}</a></li>\n`
        }

        let stringtips = ''
        for (let filename of Object.keys(tips).sort((a, b) => tips[b].date - tips[a].date)) {
            stringtips += Mustache.render(tipTemplate, Object.assign({}, tips[filename], { baseurl })) + '\n'
        }


        let index = template.indexOf(insertTipsHere)
        let fullContent = stringIndexReplace(template, index, index + insertTipsHere.length, stringtips)

        if (index === -1) throw new Error(`Couldn't find '${insertTipsHere}' in template`)

        index = fullContent.indexOf(insertTagsHere)
        fullContent = stringIndexReplace(fullContent, index, index + insertTagsHere.length, stringtags)

        if (index === -1) throw new Error(`Couldn't find '${insertTagsHere}' in template`)

        index = fullContent.indexOf(insertCSSHere)
        fullContent = stringIndexReplace(fullContent, index, index + insertTagsHere.length, CSS)

        if (index === -1) throw new Error(`Couldn't find '${insertTagsHere}' in template`)

        index = fullContent.indexOf(insertJsHere)
        fullContent = stringIndexReplace(fullContent, index, index + insertJsHere.length, minifiedJs)

        if (index === -1) throw new Error(`Couldn't find '${insertJsHere}' in template`)

        writeFile('./index.html', fullContent, 'utf8', err => {
            if (err) throw err
            console.info(`[${getExecTime()}] Successfully parsed ${Object.keys(tips).length} tips and wrote 'index.html'.`)
        })
    }).catch(err => {
        console.error(err.stack)
    })
}

main()
