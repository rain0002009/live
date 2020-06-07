<template>
  <div class="page-platform-info">
    <van-nav-bar
      v-if="!isComponent"
      :fixed="true"
      :placeholder="true"
      :title="query.title"
      left-arrow
      @click-left="back"
    >
      <template #right>
        <nuxt-link :to="{name: 'favorite-anchor'}">
          <a-icon class="text-blue-400" type="star" />
        </nuxt-link>
      </template>
    </van-nav-bar>
    <a-row>
      <a-col v-for="item in anchorList" :key="item.address" :span="12" @click="start(item)">
        <figure class="p-3 relative">
          <div class="absolute left-0 right-0 control-wrap text-white text-2xl">
            <a-icon
              v-if="!isComponent"
              class="float-left"
              :class="{'text-red-500': item.weight >= anchorList.length}"
              type="delete"
              @click.stop="addToGarbage(item)"
            />
            <a-icon
              class="float-right"
              :class="{'text-red-500': item.isFavoriteAnchor}"
              type="star"
              @click.stop="addToFavorite(item)"
            />
          </div>
          <x-img class="m-auto anchor-avatar w-full" :src="item.img" :lazy="true" />
          <figcaption class="text-center text-gray-600 text-sm" v-text="item.title" />
        </figure>
      </a-col>
    </a-row>

    <a-drawer
      class="player-drawer"
      :title="data.selectedItem.title"
      :closable="true"
      :visible="data.playerDrawerVisible"
      width="100%"
      @close="onDrawerClose"
    >
      <client-only>
        <FlvPlayer
          v-if="data.playerDrawerVisible"
          :src="getVideoSrc(data.selectedItem.address)"
          @error="data.playerDrawerVisible = false"
        />
      </client-only>
    </a-drawer>
  </div>
</template>

<script lang="ts">
import path from 'path-browserify'
import { findIndex } from 'lodash'
import { defineComponent, reactive, ref, watchEffect } from '@vue/composition-api'
import { getAnchorList, AnchorList, Anchor } from '@/api'

export default defineComponent({
  props: {
    list: Array,
    platformName: String
  },
  setup (props: { list: AnchorList, platformName: string }, { root }) {
    const data = reactive({
      playerDrawerVisible: false,
      selectedItem: {}
    })

    const anchorList = ref<AnchorList>()
    watchEffect(async () => {
      if (props.list) {
        anchorList.value = props.list
        return false
      }
      const tem = await getAnchorList(root.$axios, root.$route.query.address as string)
      anchorList.value = tem
        .map((item) => {
          const currentAnchorList = root.$store.state.favoriteAnchor[props.platformName || root.$route.query.title as string]
          if (currentAnchorList) {
            const isFindItem = !!~findIndex(currentAnchorList, ['address', item.address])
            Reflect.set(item, 'isFavoriteAnchor', isFindItem)
            if (isFindItem) {
              item.weight += tem.length
            }
          } else {
            Reflect.set(item, 'isFavoriteAnchor', false)
          }
          return item
        })
        .sort((a, b) => a.weight - b.weight)
    })

    function sortAnchorList () {
      anchorList.value?.sort((a, b) => {
        return a.weight - b.weight
      })
    }

    function start (item: {}) {
      data.playerDrawerVisible = true
      data.selectedItem = item
    }

    function onDrawerClose () {
      data.playerDrawerVisible = false
    }

    function getVideoSrc (src: string) {
      const encodeSrc = encodeURIComponent(src)
      const fileName = path.basename(new URL(src).pathname.replace('.flv', ''))
      const mediaPath = process.env.mediaPath || 'http://192.168.2.1:3000/live/'
      return `${ mediaPath }${ fileName }.flv?name=${ fileName }&url=${ encodeSrc }`
    }

    function back () {
      root.$router.back()
    }

    function addToFavorite (item: Anchor) {
      item.isFavoriteAnchor = !item.isFavoriteAnchor
      root.$store.commit('pushFavoriteAnchor', {
        platform: root.$route.query.title as string || props.platformName,
        anchor: item
      })
    }

    function addToGarbage (item: Anchor) {
      const platform = root.$route.query.title as string || props.platformName
      const listLength = (anchorList.value?.length || 0)
      if (!props.list) {
        if (item.weight >= listLength) {
          item.weight -= listLength
        } else {
          item.weight += listLength
        }
      }
      root.$store.commit('pushGarbageAnchor', {
        platform,
        anchor: item
      })
      sortAnchorList()
    }

    return {
      anchorList,
      data,
      start,
      onDrawerClose,
      getVideoSrc,
      back,
      addToFavorite,
      addToGarbage,
      query: root.$route.query,
      isComponent: !!props.list
    }
  }
})
</script>

<style lang="scss">
.page-platform-info {
  .anchor-avatar {
    height: 160px;
    object-fit: cover;
    overflow: hidden;
  }

  .control-wrap {
    padding: 0 15px;

    .anticon {
      padding: 10px;
    }
  }
}

.player-drawer {
  height: 100vh;

  .ant-drawer-wrapper-body {
    display: flex;
    flex-direction: column;
  }

  .ant-drawer-body {
    padding: 0;
    flex: 1;
  }
}
</style>
