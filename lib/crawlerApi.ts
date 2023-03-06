import BaseAPI from './baseApi'
import { Crawler } from './models'

export default class CrawlerApi<T extends Crawler> extends BaseAPI {
  constructor(endpoint?: string) {
    super(endpoint)
  }

  async listCrawlers(props?: {
    limit?: number
    order?: 'asc' | 'desc'
  }): Promise<T[]> {
    const { limit = 10, order = 'desc' } = props ?? {}
    try {
      const res = await this.axiosInstance.request({
        url: '/crawlers',
        method: 'get',
        params: { limit, order },
      })
      return res.data.items as T[]
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async getCrawler(props: { crawlerId: string }): Promise<T> {
    console.log('getCrawler', props)
    const { crawlerId } = props
    try {
      const res = await this.axiosInstance.request<T>({
        url: `/crawlers/${crawlerId}`,
        method: 'get',
      })
      return res.data
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async createCrawler(props: { groupId: string; limit: number }): Promise<T> {
    console.log('createCrawler', props)
    const { groupId, limit } = props
    try {
      const res = await this.axiosInstance.request<T>({
        url: `/crawlers`,
        method: 'post',
        data: {
          groupId: groupId,
          limit: limit,
        },
      })
      return res.data
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}
