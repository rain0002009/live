<template>
  <div class="page-home">
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
import { defineComponent } from '@vue/composition-api'
import { getPlatformInfo } from '@/api'
import favorite from '@/assets/img/f-favorites.png'

export default defineComponent({
  data () {
    return { favorite }
  },
  async asyncData ({ $axios }) {
    const data = await getPlatformInfo($axios)
    return { data }
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
