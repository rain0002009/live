import { Module } from '@nuxt/types'
import createPersistedState from 'vuex-persistedstate'

const myModule: Module = function ({ store }) {
  createPersistedState({
    key: 'live'
  })(store)
}

export default myModule
