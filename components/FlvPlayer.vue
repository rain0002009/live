<template>
  <video ref="el" class="w-full" controls />
</template>

<script lang="ts">
import { message } from 'ant-design-vue'
import { defineComponent, onMounted, ref, onUnmounted } from 'nuxt-composition-api'

const flvPromise = import(/* webpackChunkName: "flvjs" */ 'flv.js')

export default defineComponent({
  name: 'FlvPlayer',
  props: {
    src: String
  },
  setup (props, ctx) {
    const el = ref<HTMLMediaElement>()
    const flvPlayer = ref<any>(null)
    flvPromise.then((flvModule) => {
      const flvjs = flvModule.default
      flvjs.LoggingControl.enableError = true
      flvPlayer.value = flvjs.createPlayer({
        type: 'flv',
        url: props.src,
        cors: true
      })
      flvPlayer.value.on(flvjs.Events.ERROR, (error: any) => {
        message.error(error)
        ctx.emit('error')
      })
    })

    onMounted(async () => {
      await flvPromise
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
