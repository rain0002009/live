<template>
  <div
    ref="current"
    :class="[{
      pending: 'bg-yellow-500',
      done: 'bg-green-500',
      error: 'bg-red-500'
    }[innerData.status] , 'w-10px h-10px rounded-100px absolute ml-2px']"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watchEffect } from '@nuxtjs/composition-api'
import { onBeforeUnmount } from '@vue/composition-api'

export default defineComponent({
  name: 'CheckStatus',
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  setup (props, { root }) {
    const current = ref<HTMLDivElement | null>(null)
    const source = root.$axios.CancelToken.source()
    const io = ref(new IntersectionObserver((entries) => {
      const currentNode = entries[0]
      if (currentNode.intersectionRatio > 0) {
        innerData.visible = true
      }
    }))
    const innerData = reactive({
      status: 'pending',
      visible: false
    })
    const checkUrl = async (url: string) => {
      try {
        const { data } = await root.$axios.post(location.origin + '/server-middleware', {
          url
        }, {
          cancelToken: source.token
        })
        innerData.status = data.status === 200 ? 'done' : 'error'
      } catch {
        innerData.status = 'error'
      }
    }
    onMounted(() => {
      io.value.observe(current.value!)
    })

    onBeforeUnmount(() => {
      io.value.unobserve(current.value!)
    })

    watchEffect((onInvalidate) => {
      if (props.url && innerData.visible) {
        checkUrl(props.url)
        onInvalidate(() => {
          source.cancel('page closed')
        })
      }
    }, {
      flush: 'post'
    })
    return {
      innerData,
      current
    }
  }
})
</script>

<style scoped>

</style>
