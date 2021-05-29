import Vue from 'vue'
import { Icon, NavBar, List } from 'vant'
import antDirective from 'ant-design-vue/es/_util/antDirective'
import XImg from '~/components/XImge.vue'
import 'vant/es/icon/index.less'
import 'vant/es/nav-bar/index.less'
import 'vant/es/list/index.less'

Vue.component('XImg', XImg)
Vue.component(Icon.name, Icon)
Vue.component(NavBar.name, NavBar)
Vue.component(List.name, List)
Vue.use(antDirective)
