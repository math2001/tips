const fs = require('fs')
const showdown = require('showdown')
const hljs = require('highlight.js')
const {JSDOM} = require('jsdom')

const HTMLParser = function (html) {
    return new JSDOM(html).window.document
}

const markdownToHTML = (function () {
    const converter = new showdown.Converter()
    converter.setOption('simplifiedAutoLink', true)
    converter.setOption('excludeTrailingPunctuationFromURLs', true)
    converter.setOption('tables', true)
    converter.setOption('strikethrough', true)
    converter.setOption('ghMentions', true)
    converter.setOption('ghMentionsLink', true)
    converter.setOption('ghCodeBlocks', true)
    converter.setOption('openLinksInNewWindow', true)
    converter.setOption('tasklists', true)

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

function getKeyValue(string) {
    let [key, ...values] = string.split(':')
    return [key, values.join(':').trim()]
}

function monthToInt(month) {
    return new Date(Date.parse(month + "1, 2000")).getMonth()
}

function templatr(string, obj) {
    Object.keys(obj).some(key => {
        while (string.indexOf(`\${${key}}`) !== -1) {
            string = string.replace(`\${${key}}`, obj[key])
        }    
    })
    return string
}

const tipsToObject = (function () {

    function parseTip(tip) {
        tip = tip.trim()
        let frontMatter = {},
            isInFrontMatter = tip.startsWith('---'),
            markdown = ''
        tip.split('\n').slice(1).some(line => {
            if (line === '---' && isInFrontMatter) {
                return isInFrontMatter = false
            }
            if (isInFrontMatter) {
                let [key, value] = getKeyValue(line)
                if (key === 'tags') {
                    value = value.split(',').map(tag => tag.trim())
                }
                if (key === 'date') {
                    const matches = value.match(/(\w+) (\d+) (\w+) (\d+) @ (\d+):(\d+)/)
                    value = new Date(parseInt(matches[4]),
                                         monthToInt(matches[3]),
                                         parseInt(matches[2]),
                                         parseInt(matches[5]),
                                         parseInt(matches[6])
                                        ).getTime()
                }
                frontMatter[key] = value
            } else {
                markdown += line + '\n'
            }
        })
        return Object.assign({}, frontMatter, {content: markdownToHTML(markdown.trim())})
    }

    return function tipsToObject() {
        const tips = fs.readdirSync('./tips')
            .filter(file => file.endsWith('.md'))

        let callbackCount = tips.length
        return new Promise(resolve => {
            tips.some((file, index) => fs.readFile(`./tips/${file}`, 'utf8', (err, content) => {
                if (err) throw err
                tips[index] = parseTip(content)
                callbackCount -= 1
                if (callbackCount === 0) resolve(tips)
            }))
        })

    }
})()

function getTemplate() {
    return new Promise((resolve, reject) => {
        fs.readFile('./index.template.html', 'utf8', (err, content) => {
            if (err) {
                reject(err)
                throw err
            }
            resolve(content)
        })
    })
}

Promise.all([tipsToObject(), getTemplate()]).then(args => {
    const [tips, template] = args
    return templatr(template, {
        tips: JSON.stringify(tips).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    })
}).then(html => {
    return new Promise((resolve, reject) => {
        fs.writeFile('./index.html', html, err => {
            if (err) reject(err)
            console.info("Successfully written 'index.html'!")
        })
    })
}).catch(err => {
    console.error("Error while writing the file 'index.html'")
    throw err
})
