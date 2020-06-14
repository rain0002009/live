<template>
  <video ref="el" class="w-full" controls />
</template>

<script lang="ts">
import { message } from 'ant-design-vue'
import { defineComponent, computed, onMounted, ref, onUnmounted } from 'nuxt-composition-api'
import flvjs from 'flv.js'

flvjs.LoggingControl.enableError = true

export default defineComponent({
  name: 'FlvPlayer',
  props: {
    src: String
  },
  setup (props, ctx) {
    const el = ref<HTMLMediaElement>()
    const flvPlayer = computed(() => {
      return flvjs.createPlayer({
        type: 'flv',
        url: props.src,
        cors: true
      })
    })
    flvPlayer.value.on(flvjs.Events.ERROR, (error) => {
      message.error(error)
      ctx.emit('error')
    })

    onMounted(async () => {
      flvPlayer.value.attachMediaElement(el.value as HTMLMediaElement)
      flvPlayer.value.load()
      try {
        await flvPlayer.value.play()
      } catch {
      }
    })
    onUnmounted(() => {
      flvPlayer.value.destroy()
    })
    return { el }
  }
})
</script>

<style lang="scss">

</style>
