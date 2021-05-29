<template>
  <img ref="ref" :src="innerData.imgSrc" :alt="alt">
</template>

<script lang="ts">
import img404 from '@/assets/img/404.png'
import { defineComponent, onMounted, reactive, ref, watchEffect } from '@nuxtjs/composition-api'
import { onBeforeUnmount } from '@vue/composition-api'

export default defineComponent({
  name: 'XImg',
  props: {
    src: {
      type: String,
      default: undefined
    },
    alt: {
      type: String || undefined,
      default: undefined
    }
  },
  setup (props, { root }) {
    const current = ref<HTMLImageElement>()
    const innerData = reactive({
      imgSrc: img404,
      visible: false,
      preSuccessSrc: img404
    })

    const checkUrl = function (src: string): Promise<string> {
      return new Promise((resolve) => {
        const dom = new Image()
        dom.src = src
        dom.onload = function () {
          if (dom.width > 1) {
            innerData.preSuccessSrc = src
            resolve(src)
          } else {
            resolve(innerData.preSuccessSrc)
          }
        }
        dom.onerror = function () {
          resolve(innerData.preSuccessSrc)
        }
      })
    }

    const io = ref(!root.$isServer
      ? new IntersectionObserver((entries) => {
        const currentNode = entries[0]
        if (currentNode.intersectionRatio > 0) {
          innerData.visible = true
        }
      })
      : null)

    watchEffect(async () => {
      if (innerData.visible && props.src) {
        innerData.imgSrc = await checkUrl(props.src)
      }
    })

    onMounted(() => {
      io.value?.observe(current.value!)
    })

    onBeforeUnmount(() => {
      io.value?.unobserve(current.value!)
    })

    return {
      innerData,
      ref: current
    }
  }
})

</script>

<style lang="scss">

</style>
