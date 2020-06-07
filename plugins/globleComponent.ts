import Vue from 'vue'
import { Icon, NavBar } from 'vant'
import antDirective from 'ant-design-vue/es/_util/antDirective'
import XImg from '~/components/XImge.vue'
import 'vant/es/icon/index.less'
import 'vant/es/nav-bar/index.less'

Vue.component('x-img', XImg)
Vue.component(Icon.name, Icon)
Vue.component(NavBar.name, NavBar)
Vue.use(antDirective)
