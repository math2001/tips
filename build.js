const fs = require('fs')

function getKeyValue(string) {
    let [key, ...values] = string.split(':')
    return [key, values.join(':').trim()]
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
