"use strict";

class Search {

    static init() {
        this.input = document.getElementById('search-input')
        this.help = document.getElementById('search-help')
        this.bindDOM()
    }

    static bindDOM() {
        this.input.addEventListener('input', e => {this.navigate(e.target.value)})
        this.help.addEventListener('click', () => {
            this.input.value = '[help]'
            this.navigate(this.input.value)
        })
    }

    static searchToObject(string) {
        const tags = []
        let isInBracket = false, char, contains = ''
        for (var i = 0; i < string.length; i++) {
            char = string[i]
            if (char === '[') {
                if (string[i-1] !== '\\') {
                    tags.push('')
                    isInBracket = true
                } else {
                    contains += char
                }
            } else if (char === ']') {
                if (string[i-1] !== '\\') {
                    isInBracket = false
                } else {
                    contains += char
                }
            } else if (isInBracket) {
                tags[tags.length - 1] += char
            } else if (string[i+1] !== '[' && string[i+1] !== ']') {
                contains += char
            }
        }
        if (isInBracket) {
            contains += '[' + tags.pop()
        }
        const obj = {}
        if (contains !== '') obj.contains = contains.trim()
        if (tags.length !== 0) obj.withtag = tags.join(',')
        return obj
    }

    static navigate(search) {
        const uri = getLocationObject()
        uri.search(this.searchToObject(search))
        location.hash = '#' + uri.toString()
    } 

}

function testSearchToObject() {

    function isEquivalent(a, b) {
        if (typeof a !== typeof b) {
            return false
        }
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        return true;
    }

    const argAndResult = [
        ['hello', {'contains': 'hello'}],
        ['[hello', {'contains': '[hello'}],
        ['hello world', {'contains': 'hello world'}],
        ['hello [python]', {'contains': 'hello', 'withtag': 'python'}],
        ['hello [python][itsbuiltin]', {'contains': 'hello', 'withtag': 'python,itsbuiltin'}],
        ['hello [python] [itsbuiltin]', {'contains': 'hello', 'withtag': 'python,itsbuiltin'}],
        ['[itsbuiltin] hello [python]', {'contains': 'hello', 'withtag': 'itsbuiltin,python'}],
        ['[itsbuiltin]', {'withtag': 'itsbuiltin'}],
        ['\\[itsbuiltin\\]', {'contains': '[itsbuiltin]'}],
        ['\\[itsbuiltin\\][', {'contains': '[itsbuiltin]['}],
        ['\\[itsbuiltin\\][python]', {'contains': '[itsbuiltin]', 'withtag': 'python'}],
        ['\\[itsbuiltin\\][python] hello world', {'contains': '[itsbuiltin] hello world', 'withtag': 'python'}],
    ]

    let arg, result, expectedResult;
    for (var i = 0; i < argAndResult.length; i++) {
        [arg, expectedResult] = argAndResult[i]
        result = Search.searchToObject(arg)
        if (!isEquivalent(result, expectedResult)) {
            console.error(`"${arg}"`, 'gives', result, "instead of", expectedResult)
            return false
        }
    }
    return true

}

if (typeof window === "undefined") {
    if (testSearchToObject()) {
        console.info('Test passing.')
    }
}