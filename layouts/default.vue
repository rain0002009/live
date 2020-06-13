<template>
  <div id="app" class="mx-auto">
    <nuxt keep-alive :keep-alive-props="{include: ['Index']}" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'App'
})
</script>
<style lang="scss">
  body {
    background-color: #f7f8fa;
  }

  #app {
    height: 100vh;
    max-width: 768px;
  }
</style>
