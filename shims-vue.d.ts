declare module 'path-browserify' {
  import path from 'path'
  export default path
}

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '*.png' {
  const src: string
  export default src
}

declare module 'ant-design-vue/es/_util/antDirective'

declare module 'vant/es/nav-bar' {
  import { NavBar } from 'vant'
  export default NavBar
}
declare module 'vant/es/icon' {
  import { Icon } from 'vant'
  export default Icon
}
