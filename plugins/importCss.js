export default function () {
  const antdStyle = ['', '/grid', '/badge', '/drawer', '/icon', '/empty', '/divider', '/switch', '/input', '/spin', '/message'].map((item) => {
    item = 'ant-design-vue/es' + item + '/style/index.less'
    return item
  })
  this.options.css = [...antdStyle, ...this.options.css]
}
