import BaseAPI from './baseApi'
import { Product } from './models'

const phpsessId = 'hj0rbuamo1i5ojfunkfcoej3k5'

export default class ProductsAPI<T extends Product> extends BaseAPI {
  constructor(endpoint?: string) {
    super(endpoint)
  }

  async listProducts(props: {
    limit?: number
    order?: 'asc' | 'desc'
  }): Promise<T[]> {
    console.log('listProducts', props)
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
    console.log('ProductsApi.createProduct', props)
    const { product } = props
    const res = await this.axiosInstance.request<T>({
      url: '/products',
      method: 'post',
      data: product,
      params: { phpsessId: phpsessId },
    })
    console.log('res.data', res.data)
    return res.data
  }

  async getProduct(props: { productId: string }): Promise<T> {
    const { productId } = props
    const res = await this.axiosInstance.request<T>({
      url: `/products/${productId}`,
      method: 'get',
    })
    return res.data
  }

  async updateProduct(props: { product: Product }): Promise<T> {
    console.log('ProductsApi.updateProduct', props)
    const { product } = props
    const { productId } = product
    const res = await this.axiosInstance.request<T>({
      url: `/products/${productId}`,
      method: 'put',
      data: product,
      params: { phpsessId: phpsessId },
    })
    return res.data
  }

  async publishToFB(props: { productId: string }): Promise<T> {
    console.log('ProductsApi.publishToFB', props)
    const { productId } = props
    const res = await this.axiosInstance.request<T>({
      url: `/products/${productId}/publish`,
      method: 'put',
      params: { phpsessId: phpsessId },
    })
    return res.data
  }
}
