const Shortcuts = {

    init() {
        this.bindDOM()
    },

    bindDOM() {
        document.body.addEventListener('keydown', e => {
            if (e.which === 191) {
                EM.fire('focus-search', e)
            }
        }, false)
    }

}
