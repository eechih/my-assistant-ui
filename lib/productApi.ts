import BaseAPI, { Patch } from './baseApi'
import { Product } from './models'

export default class ProductAPI<T extends Product> extends BaseAPI {
  constructor(endpoint?: string) {
    super(endpoint)
  }

  async listProducts(props: {
    limit?: number
    order?: 'asc' | 'desc'
  }): Promise<T[]> {
    console.log('ProductAPI.listProducts', props)
    const { limit = 10, order = 'desc' } = props
    try {
      const res = await this.axiosInstance.request({
        url: `/products?limit=${limit}&order=${order}`,
        method: 'get',
      })
      return res.data.items as T[]
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async createProduct(props: { product: T }): Promise<T> {
    console.log('ProductAPI.createProduct', props)
    const { product } = props
    const res = await this.axiosInstance.request<T>({
      url: '/products',
      method: 'post',
      data: product,
    })
    console.log('res.data', res.data)
    return res.data
  }

  async getProduct(props: { productId: string }): Promise<T> {
    console.log('ProductAPI.getProduct', props)
    const { productId } = props
    const res = await this.axiosInstance.request<T>({
      url: `/products/${productId}`,
      method: 'get',
    })
    return res.data
  }

  async patchProduct(props: {
    productId: string
    patches: Patch[]
  }): Promise<T> {
    console.log('patchProduct', props)
    const { productId, patches } = props
    try {
      const res = await this.axiosInstance.request<T>({
        url: `/products/${productId}`,
        method: 'patch',
        data: patches,
      })
      return res.data
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async publishProduct(props: {
    productId: string
    phpsessId?: string
  }): Promise<T> {
    console.log('ProductAPI.publishProduct', props)
    const { productId, phpsessId = 'hj0rbuamo1i5ojfunkfcoej3k5' } = props
    const res = await this.axiosInstance.request<T>({
      url: `/products/${productId}/publish`,
      method: 'put',
      params: { phpsessId },
      timeout: 60000, // 60 seconds
    })
    console.log('Successfully published product.', res.data)
    return res.data
  }
}
