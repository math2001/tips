"use strict";

Vue.use(VueRouter)

const filters = {
    markdown: (function () {
        const markdownConverter = new showdown.Converter()
        return function (text) {
            return markdownConverter.makeHtml(text)
        }
    })(),
    readabledate: function (value) {
        return strftime('%A %d %B %Y at %H:%M', new Date(value))
    }
}

Vue.filter('markdown', filters.markdown)
Vue.filter('readabledate', filters.readabledate)

Vue.component('loader', {

    props: {
        message: {type: String, default: 'Loading, please wait...'}
    },

    template: `<div>
        <div class="loader"></div>
        <h4 class="loader-message">{{ message }}</h4>
    </div>`

})

Vue.component('indexer', {

    template: `<ul>
        <li v-for="tip in availableTips"><router-link :to="{ name: 'viewer', 'params': { slug: tip.slug } }">{{ tip.title }}</router-link></li>
    </ul>`,

    data: function () {
        return {
            availableTips: [],
            tips: []
        }
    },

    methods: {
        getAvailableTips: function (tips, $route) {
            const args = $route.query
            if (args.withtag !== undefined) {
                args.withtag = args.withtag.split(',')
            }
            return tips.filter(tip => {
                if (args.withtag !== undefined
                    && !tip.tags.every(tag => args.withtag.indexOf(tag) !== -1)) {
                    return false
                }
                return true
            })
        }
    },

    created: function () {
        this.tips = this.$parent.$data.tips
        this.availableTips = this.getAvailableTips(this.tips, this.$route)
    }

})

const TipWindow = {

    template: `<div>
        <h2><a :href="slug">{{ title }}</a></h2>
        <ul>
            <li v-for="tag in tags">
                <router-link :to="{ name: 'search', query: { 'withtag': tag } }">{{ tag }}</router-link>
            </li>
        </ul>
        <div class="content" v-html="content">
        </div>
        — By {{ author }} on {{ timestamp | readabledate }}
    </div>`,

    data: function () {
        return {
            tip: {}
        }
    },

    computed: {
        title () { return this.tip.title },
        slug () { return this.tip.slug },
        tags () { return this.tip.tags },
        content () { return filters.markdown(this.tip.content) },
        author () { return this.tip.author },
        timestamp () { return this.tip.timestamp },
    },
    methods: {
        update () {
            this.tip = this.$parent.$data.tips.find(tip => tip.slug === this.$route.params.slug)
        },
    },

    created: function () {
        this.update()
    },

    watch: {
        '$route': function (to, from) {
            this.update()
        }
    }

}

const router = new VueRouter({
    mode: 'history',
    base: '/tips/',
})

let vue = new Vue({
    el: '#app',
    data: {
        tips: null
    },
    router,
    mounted: function () {
        this.$http.get('tips.json').then(response => {
            this.tips = response.body
            
            this.$router.addRoutes([
                { name: 'viewer', path: '/:slug', component: TipWindow },
            ])
        })
    }
})
