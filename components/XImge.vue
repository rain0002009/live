<template>
  <img :src="imgSrc" :alt="alt">
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import img404 from '@/assets/img/404.png'

@Component
export default class XImg extends Vue {
  imgObserver = this.$isServer ? null : new IntersectionObserver(this.handleImgObserve)
  imgSrc: string | null | undefined = img404
  @Prop(String) readonly src: string | undefined
  @Prop(Boolean) readonly lazy: boolean | undefined

  @Watch('src', { immediate: true })
  onSrcChange (val: string) {
    if (val && !this.lazy) {
      this.setImgSrc(val)
    }
  }

  @Prop(String) readonly alt: string | undefined

  handleImgObserve (entries: IntersectionObserverEntry[]) {
    const entry = entries[0]
    if (this.imgObserver && entry.intersectionRatio > 0) {
      this.setImgSrc(this.src)
      this.imgObserver.unobserve(this.$el)
    }
  }

  handleLoadError () {
    this.imgSrc = img404
  }

  setImgSrc (val: string | undefined) {
    if (this.$isServer) {
      this.imgSrc = val
      return false
    }
    let img: HTMLImageElement | undefined | null = new Image()
    img.src = val || ''
    img.onload = () => {
      this.imgSrc = val
      img = null
    }
    img.onerror = () => {
      this.imgSrc = img404
      img = null
    }
  }

  mounted () {
    if (this.lazy && this.imgObserver) {
      this.imgObserver.observe(this.$el)
    }
  }
}
</script>

<style lang="scss">

</style>
