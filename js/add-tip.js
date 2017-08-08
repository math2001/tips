"use strict";

class AddTip {

    static init() {
        this.bindDOM()
        this.bindEvent()
    }

    static bindDOM() {
        this.elements = {
            title: document.querySelector('#form-tip-title'),
            slug: document.querySelector('#form-tip-slug'),
            tagsList: document.querySelector('#form-tip-tags-ist'),
            tag: document.querySelector('#form-tip-tag'),
            content: document.querySelector('#form-tip-content'),
            getJson: document.querySelector('#form-get-json'),
            preview: document.querySelector('#form-preview'),
        }
    }

    static bindEvent() {
        this.elements.title.addEventListener('input', e => {
            this.elements.slug.value = this.slugify(e.target.value)
        })
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