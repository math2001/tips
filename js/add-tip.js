"use strict";

class AddTip {

    static init() {
        this.elements = {
            title: document.querySelector('#form-tip-title'),
            slug: document.querySelector('#form-tip-slug'),
            tagsList: document.querySelector('#form-tip-tags-list'),
            tag: document.querySelector('#form-tip-tag'),
            content: document.querySelector('#form-tip-content'),
            getJson: document.querySelector('#form-get-json'),
            preview: document.querySelector('#form-preview'),
            previewBlock: document.querySelector('#form-preview-block'),
        }

        this.templates = {
            tag: document.querySelector('#tag-template').innerHTML,
        }

        this.bindDOM()
        this.bindEvent()
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
    }

    static getTipObject() {
        return {
            title: this.elements.title.value,
            slug: this.elements.slug.value,
            tags: Array.from(this.elements.tagsList.querySelectorAll('.tip-tag')).map(li => li.textContent),
            content: this.elements.content.value
        }
    }

    static preview(markdown) {
        this.elements.previewBlock.innerHTML = markdownToHTML(markdown)
    }

    static bindEvent() {
        
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