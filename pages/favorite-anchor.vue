<template>
  <div class="page-favorite-anchor">
    <van-nav-bar
      :fixed="true"
      :placeholder="true"
      title="我的最爱"
      left-arrow
      @click-left="back"
    >
      <template #right>
        <nuxt-link :to="{name: 'favorite-anchor'}">
          <a-icon
            class="text-red-400"
            type="delete"
            @click="clear"
          />
        </nuxt-link>
      </template>
    </van-nav-bar>
    <client-only>
      <template v-if="favoriteAnchor.length">
        <div v-for="[name, value] in favoriteAnchor" :key="name">
          <p class="platform-name pl-3 pt-3 text-lg" v-text="name" />
          <PlatformPage :list="value" :platform-name="name" />
          <a-divider />
        </div>
      </template>
      <template v-else>
        <a-empty class="mt-5" />
      </template>
    </client-only>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'nuxt-composition-api'
import PlatformPage from '~/components/PlatformPage.vue'

export default defineComponent({
  components: { PlatformPage },
  setup (_props, { root }) {
    function back () {
      root.$router.back()
    }

    function clear () {
      root.$store.commit('clearAnchor')
    }
    const favoriteAnchor = computed(() => Object.entries(root.$store.state.favoriteAnchor || {}))
    return { favoriteAnchor, back, clear }
  }
})
</script>
