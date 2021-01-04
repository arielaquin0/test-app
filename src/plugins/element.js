import Vue from 'vue'
import Cookies from 'js-cookie'
import Element from 'element-ui'
import '../assets/styles/element-variables.scss'
import '@/assets/styles/index.scss' // global css
import i18n from '../lang'

Vue.use(Element, {
    size: Cookies.get('size') || 'medium', // set element-ui default size
    i18n: (key, value) => i18n.t(key, value)
})
