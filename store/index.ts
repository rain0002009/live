import { findIndex, partial } from 'lodash'
import { message } from 'ant-design-vue'
import { AnchorList, Anchor, PlatformList } from '~/api'

interface State {
  indexData: PlatformList
  setting: { isUseVlcPlayer: boolean, serverPath: string }
  favoriteAnchor: { [key: string]: AnchorList }
  garbageAnchor: { [key: string]: AnchorList }
}

export const state: () => State = () => {
  return {
    indexData: [],
    favoriteAnchor: {},
    garbageAnchor: {},
    setting: { isUseVlcPlayer: true, serverPath: 'http://192.168.2.1:3000/live/' }
  }
}

function push (which: keyof Pick<State, 'favoriteAnchor' | 'garbageAnchor'>, state: State, { platform, anchor }: { platform: string, anchor: Anchor }) {
  const store = state[which]
  const anchorList = Reflect.get(store, platform)
  if (Reflect.has(store, platform)) {
    const anchorIndex = findIndex(anchorList, ['address', anchor.address])
    if (~anchorIndex) {
      anchorList?.splice(anchorIndex, 1)
      if (anchorList?.length === 0) {
        Reflect.deleteProperty(store, platform)
        state[which] = Object.assign({}, store)
      }
      message.success('删除成功')
    } else {
      anchorList?.push(anchor)
      message.success('添加成功')
    }
  } else {
    Reflect.set(store, platform, [anchor])
    message.success('添加成功')
  }
}

export const mutations = {
  pushFavoriteAnchor: partial(push, 'favoriteAnchor'),
  pushGarbageAnchor: partial(push, 'garbageAnchor'),
  editSetting (state: State, data: State['setting']) {
    Object.assign(state.setting, data)
  },
  editIndexData (state: State, data: PlatformList) {
    Object.assign(state.indexData, data)
  }
}
