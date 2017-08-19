const Shortcuts = {

    init() {
        this.bindDOM()
    },

    bindDOM() {
        document.body.addEventListener('keydown', e => {
            if (document.activeElement !== document.body) {
                return
            }
            if (e.which === 191) {
                EM.fire('focus-search', e)
            } else if (e.which === 74) {
                EM.fire('active-next-tip')
            } else if (e.which === 75){
                EM.fire('active-prev-tip')
            }
        }, false)
    }

}
