import Vue, { PluginObject } from 'vue'
import Spin from '~/components/Spin.vue'

const SpinConstructor = Vue.extend(Spin as any)

class Service {
  private instance: any
  private target: null | HTMLElement

  constructor () {
    this.instance = null
    this.target = null
  }

  open (target?: HTMLElement | undefined) {
    if (Vue.prototype.$isServer || this.instance) {
      return false
    }
    this.target = target || document.body
    this.instance = new SpinConstructor({
      el: document.createElement('div')
    })
    this.target.append(this.instance.$el)
  }

  close () {
    if (this.instance && this.instance.$el && this.instance.$el.parentNode) {
      this.instance.$el.parentNode.removeChild(this.instance.$el)
      this.instance = null
    }
  }
}

const Plugin: PluginObject<any> = {
  install (Vue) {
    Vue.prototype.$spin = new Service()
  }
}

Vue.use(Plugin)

export default Plugin

declare module 'vue/types/vue' {
  interface Vue {
    $spin: Service
  }
}
