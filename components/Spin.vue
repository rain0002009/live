<template>
  <div class="fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center">
    <Spin />
  </div>
</template>

<script>
import { defineComponent } from 'nuxt-composition-api'
import { Spin } from 'ant-design-vue'

export default defineComponent({
  name: 'MySpin',
  components: { Spin }
})
</script>

<style scoped>

</style>
