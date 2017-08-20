const fs = require('fs')

function getKeyValue(string) {
    let [key, ...values] = string.split(':')
    return [key, values.join(':').trim()]
}

function monthToInt(month) {
    return new Date(Date.parse(month + "1, 2000")).getMonth()
}

const tipsToObject = (function () {

    function parseTip(tip) {
        tip = tip.trim()
        let frontMatter = [],
            isInFrontMatter = tip.startsWith('---'),
            markdownContent = ''
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
                frontMatter.push([key, value])
                
            } else {
                markdownContent += line + '\n'
            }
        })
    }

    return function tipsToObject() {
        return fs.readdirSync('./tips')
            .filter(file => file.endsWith('.md'))
            .map(file => fs.readFile(`./tips/${file}`, 'utf8', (err, content) => {
                if (err) throw err
                parseTip(content)
            }))
    }


})()


const tips = tipsToObject()
