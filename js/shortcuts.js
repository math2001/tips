const Shortcuts = {

    init() {
        this.bindDOM()
        this.keys = {
            j: 74,
            k: 75,
            h: 72,
            l: 76,
            slash: 191
        }
    },

    bindDOM() {
        document.body.addEventListener('keydown', e => {
            if (document.activeElement !== document.body) {
                return
            }
            if (e.which === this.keys.slash) {
                EM.fire('focus-search', e)
            } else if (e.which === this.keys.l) {
                EM.fire('active-next-tip')
            } else if (e.which === this.keys.h){
                EM.fire('active-prev-tip')
            } else if (e.which === this.keys.j) {
                window.scrollBy({ top: 200, left: 0, behavior: 'smooth' })
            } else if (e.which === this.keys.k) {
                window.scrollBy({ top: -200, left: 0, behavior: 'smooth' })
            }

        }, false)
    }

}
