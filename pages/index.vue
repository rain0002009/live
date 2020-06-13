<template>
  <div class="page-home">
    <div class="setting-wrap mt-5 px-5">
      <a-switch v-model="isUseVlcPlayer" />
      <span v-if="isUseVlcPlayer">使用vlc播放器（自行安装）</span>
      <template v-else>
        <span>内置播放器需要服务器支持</span>
        <div class="mt-3">
          <a-input v-model="serverPath" />
        </div>
      </template>
    </div>
    <a-divider />
    <a-row>
      <a-col class="platform-item mt-5" :span="8">
        <nuxt-link class="block" :to="{name: 'favorite-anchor'}">
          <a-badge class="m-auto block platform-avatar relative" :count="0">
            <div class="absolute top-0 right-0 bottom-0 left-0">
              <x-img :src="favorite" class="object-contain w-full h-full" />
            </div>
          </a-badge>
          <figcaption class="text-center text-gray-600 text-sm" v-text="'我的最爱'" />
        </nuxt-link>
      </a-col>
      <a-col v-for="item in data" :key="item.title" class="platform-item mt-5" :span="8">
        <nuxt-link class="block" :to="{name: 'platform', query: {address: item.address, title: item.title}}">
          <a-badge class="m-auto block platform-avatar relative" :count="item.Number">
            <div class="absolute top-0 right-0 bottom-0 left-0">
              <x-img class="object-contain w-full h-full" :src="item.xinimg" :lazy="true" />
            </div>
          </a-badge>
          <figcaption class="text-center text-gray-600 text-sm" v-text="item.title" />
        </nuxt-link>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { defineComponent, computed } from '@vue/composition-api'
import { getPlatformInfo } from '@/api'
import favorite from '@/assets/img/f-favorites.png'

export default defineComponent({
  name: 'Index',
  async asyncData ({ $axios, store }: Context) {
    if (store.state.indexData.length) {
      return { data: store.state.indexData }
    } else {
      const data = await getPlatformInfo($axios)
      store.commit('editIndexData', data)
      return { data }
    }
  },
  setup (_props, { root }) {
    const isUseVlcPlayer = computed({
      get () {
        return root.$store.state.setting.isUseVlcPlayer
      },
      set (data: boolean) {
        root.$store.commit('editSetting', { isUseVlcPlayer: data })
      }
    })

    const serverPath = computed({
      get () {
        return root.$store.state.setting.serverPath
      },
      set (data: string) {
        root.$store.commit('editSetting', { serverPath: data })
      }
    })

    return { favorite, isUseVlcPlayer, serverPath }
  }
})
</script>

<style lang="scss">
  .page-home {
    .platform-item {

    }

    .platform-avatar {
      height: 0;
      padding-bottom: 56%;
      width: 56%;
    }
  }
</style>
