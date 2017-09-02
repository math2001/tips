const TagList = {

    init() {
        this.trigger = document.querySelector('#show-tag-list')
        this.closer = document.querySelector('#close-tag-list')
        this.popup = document.querySelector('#tag-list')
        this.bindDOM()
        this.bindEvent()
    },

    show() { this.popup.classList.add('shown') },
    hide() { this.popup.classList.remove('shown') },

    bindDOM() {
        document.addEventListener('click', e => {
            if (this.popup.classList.contains('shown') && !this.popup.contains(e.target)) {
                e.preventDefault()
                e.stopPropagation()
                e.stopImmediatePropagation()
                this.hide()
            }
        }, true)
        this.trigger.addEventListener('click', this.show.bind(this), false)
        this.closer.addEventListener('click', this.hide.bind(this), false)
    },

    bindEvent() {
        EM.on('navigated', () => this.hide())
    }

}
