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
    <van-list v-model="loading" :finished="finished" @load="load">
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
        <a-col v-for="item in list" :key="item.title" class="platform-item mt-5" :span="8">
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
    </van-list>
  </div>
</template>

<script lang="ts">
import LazyHydrate from 'vue-lazy-hydration'
import { chunk } from 'lodash'
import { defineComponent, computed, useAsync, useContext, ref } from 'nuxt-composition-api'
import { getPlatformInfo, PlatformList } from '@/api'
import favorite from '@/assets/img/f-favorites.png'

export default defineComponent({
  name: 'Index',
  components: { LazyHydrate },
  setup () {
    let getPlatformInfoPromise: Promise<PlatformList>
    const { store, $axios } = useContext()
    const data = useAsync(async () => {
      getPlatformInfoPromise = getPlatformInfo($axios).then((res) => {
        if (process.client) {
          data.value = res
        }
        return res
      })
      return await getPlatformInfoPromise
    })
    let currentIndex = 0
    const loading = ref(false)
    const finished = ref(false)
    const list = ref<PlatformList>([])

    async function load () {
      if (!data.value) {
        await getPlatformInfoPromise
      }
      const dataChunk = chunk<PlatformList | any>(data.value, 21)
      loading.value = true
      setTimeout(() => {
        list.value = list.value.concat(...dataChunk[currentIndex])
        loading.value = false
        currentIndex += 1
        if (currentIndex >= dataChunk.length) {
          finished.value = true
        }
      }, currentIndex === 0 ? 0 : 2000)
    }

    const isUseVlcPlayer = computed({
      get () {
        return store.state.setting.isUseVlcPlayer
      },
      set (data: boolean) {
        store.commit('editSetting', { isUseVlcPlayer: data })
      }
    })

    const serverPath = computed({
      get () {
        return store.state.setting.serverPath
      },
      set (data: string) {
        store.commit('editSetting', { serverPath: data })
      }
    })

    return { favorite, isUseVlcPlayer, serverPath, list, load, finished, loading }
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
