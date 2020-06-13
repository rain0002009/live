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

export type Anchor =
  Pick<PlatformItem, 'address' | 'title'>
  & { img: string, isFavoriteAnchor: boolean, weight: number }
export type AnchorList = Anchor[]

function decode (text: string) {
  let out = ''
  const table = Object.entries({
    '%B7': '·'
  })
  for (const [key, value] of table) {
    out = text.replace(new RegExp(key, 'g'), value)
  }
  return out
}

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
        item.weight = index
        item.isFavoriteAnchor = false
        try {
          item.title = decodeURIComponent(item.title)
        } catch {
          item.title = decodeURIComponent(decode(item.title))
        }
        return item
      })
  })
}
