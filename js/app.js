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

const TipWindow = {

    template: `<div>
        <h2><a :href="slug">{{ title }}</a></h2>
        <ul>
            <li v-for="tag in tags">
                <router-link :to="{ name: 'search', query: { 'with-tag': tag } }">{{ tag }}</router-link>
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
    routes: [
        { name: 'index', path: '/' },
        { name: 'search', path: '/search' }
    ]
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
                { path: '/:slug', component: TipWindow, name: 'viewer' }
            ])
        })
    }
})


// let xhr = new XMLHttpRequest()
// xhr.open('GET', 'tips.json')
// xhr.send(null)
// xhr.addEventListener('readystatechange', function() {
//     if (xhr.readyState === 4 && xhr.status === 200) {
//         vue.$data.tips = JSON.parse(xhr.responseText)
//         vue.$router.addRoutes([
//             { path: '/:slug', component: TipWindow }
//         ])
//     }
// }, false);