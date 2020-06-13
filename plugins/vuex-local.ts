import { Module } from '@nuxt/types'
import createPersistedState from 'vuex-persistedstate'

const myModule: Module = function ({ store }) {
  createPersistedState({
    key: 'live',
    paths: ['favoriteAnchor', 'setting', 'garbageAnchor']
  })(store)
}

export default myModule
