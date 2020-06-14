<template>
  <div id="app" class="mx-auto">
    <config-provider :local="local">
      <nuxt keep-alive :keep-alive-props="{include: ['Index']}" />
    </config-provider>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { ConfigProvider } from 'ant-design-vue'

export default {
  name: 'App',
  components: { ConfigProvider },
  data () {
    return { local: zhCN }
  }
}
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
