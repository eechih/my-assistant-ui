import axios, { Axios } from 'axios'

export interface ApiError {
  message?: string
  code?: string
  name?: string
  status?: number
  error?: any
}

export interface Patch {
  op: string
  path: string
  value?: string
  from?: string
}

export default abstract class BaseAPI {
  static BASE_URL = 'http://localhost:3000/api'

  protected axiosInstance: Axios

  constructor(endpoint?: string) {
    this.axiosInstance = axios.create({
      baseURL: endpoint ?? BaseAPI.BASE_URL,
      timeout: 30000,
    })
  }
}
