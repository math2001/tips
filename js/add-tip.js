"use strict";

class AddTip {

    static init() {
        this.elements = {
            title: document.querySelector('#form-tip-title'),
            slug: document.querySelector('#form-tip-slug'),
            tagsList: document.querySelector('#form-tip-tags-list'),
            tag: document.querySelector('#form-tip-tag'),
            content: document.querySelector('#form-tip-content'),
            copyJson: document.querySelector('#form-copy-json'),
            preview: document.querySelector('#form-preview'),
            previewBlock: document.querySelector('#form-preview-block'),
        }

        this.templates = {
            tag: document.querySelector('#tag-template').innerHTML,
        }

        this.bindDOM()

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'tips.json')
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                this.tips = JSON.parse(xhr.responseText)
            }
        }, false);
        xhr.send(null)
    }

    static bindDOM() {
        this.elements.title.addEventListener('input', e => {
            this.elements.slug.value = this.slugify(e.target.value)
        })

        this.elements.tag.addEventListener('keydown', e => {
            if (e.which === 13 && e.target.value != '') { // Enter
                this.addTag(e.target.value)
                e.target.value = ''
            }
        })

        this.elements.tagsList.addEventListener('click', e => {
            if (e.target.classList.contains('close')) {
                e.target.parentNode.parentNode.removeChild(e.target.parentNode)
            }
        })

        this.elements.preview.addEventListener('click', () => {
            this.preview(this.elements.content.value)
        })

        this.elements.copyJson.addEventListener('click', () => {
            const tips = this.tips
            tips.push(this.getTipObject())
            copyToClipboard(JSON.stringify(tips))
        })
    }

    static getTipObject() {
        return {
            title: this.elements.title.value,
            slug: this.elements.slug.value,
            tags: Array.from(this.elements.tagsList.querySelectorAll('.tip-tag')).map(li => li.firstChild.textContent.trim()),
            content: this.elements.content.value,
            timestamp: new Date().getTime()
        }
    }

    static preview(markdown) {
        this.elements.previewBlock.innerHTML = markdownToHTML(markdown)
    }

    static addTag(tag) {
        this.elements.tagsList.innerHTML += Mustache.render(this.templates.tag, {tag})
    }

    static slugify(text) {
        // thanks https://gist.github.com/mathewbyrne/1280286
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }

}

AddTip.init()
