import { VueConstructor } from 'vue'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

export interface PlatformItem {
  Number: string;
  address: string;
  title: string;
  xinimg: string;
}

export type PlatformList = PlatformItem[]

export function getPlatformInfo (axios: NuxtAxiosInstance) {
  return axios.get('/json.txt').then(({ data }: { data: { pingtai: PlatformList } }) => Object.freeze(data.pingtai))
}

export type Anchor = Pick<PlatformItem, 'address' | 'title'> & { img: string, isFavoriteAnchor: boolean, weight: number }
export type AnchorList = Anchor[]

export function getAnchorList (axios: NuxtAxiosInstance, src: string) {
  return axios.get(`/${ src }`).then(({ data }: { data: { zhubo: AnchorList } }) => {
    const hash = new Map()
    return data.zhubo
      .filter((item: any) => {
        if (hash.has(item.address)) {
          return false
        }
        hash.set(item.address, 1)
        return true
      })
      .map((item: any, index) => {
        try {
          item.weight = index
          item.isFavoriteAnchor = false
          item.title = decodeURIComponent(item.title)
        } catch {
        }
        return item
      })
  })
}
