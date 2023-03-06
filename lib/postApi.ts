import BaseAPI, { Patch } from './baseApi'
import { Post } from './models'

export default class PostsAPI<T extends Post> extends BaseAPI {
  constructor(endpoint?: string) {
    super(endpoint)
  }

  async listPosts(props: {
    groupId: string
    limit?: number
    order?: 'asc' | 'desc'
  }): Promise<T[]> {
    console.log('createPost', props)
    const { groupId, limit = 10, order = 'desc' } = props
    try {
      const res = await this.axiosInstance.request({
        url: `/posts?groupId=${groupId}&limit=${limit}&order=${order}`,
        method: 'get',
      })
      return res.data.items as T[]
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async createPost(props: { post: Post }): Promise<T> {
    console.log('createPost', props)
    const { post } = props
    try {
      const res = await this.axiosInstance.request<T>({
        url: '/posts',
        method: 'post',
        data: post,
      })
      return res.data
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async getPost(props: { postId: string }): Promise<T> {
    console.log('getPost', props)
    const { postId } = props
    try {
      const res = await this.axiosInstance.request<T>({
        url: `/posts/${postId}`,
        method: 'get',
      })
      return res.data
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async updatePost(props: { post: Post }): Promise<T> {
    console.log('updatePost', props)
    const { post } = props
    try {
      const { postId } = post
      const res = await this.axiosInstance.request<T>({
        url: `/posts/${postId}`,
        method: 'put',
        data: post,
      })
      return res.data
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async patchPost(props: { postId: string; patches: Patch[] }): Promise<T> {
    console.log('patchPost', props)
    const { postId, patches } = props
    try {
      const res = await this.axiosInstance.request<T>({
        url: `/posts/${postId}`,
        method: 'patch',
        data: patches,
      })
      return res.data
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}
