import Vue from 'vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import './assets/icons' // icon

import App from './App'
import router from './router'
import store from './store'
import i18n from "./lang"

import './plugins/element.js'

import * as filters from './filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});

import './permission'

Vue.config.debug = process.env.NODE_ENV === 'development'
Vue.config.silent = process.env.NODE_ENV === 'production'
Vue.config.devtools = false
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
