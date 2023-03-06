export interface Crawler {
  userId: string
  crawlerId: string
  state: string
  messageId?: string
  messageBody?: string
  creationTime?: string // ISO 8601
  processingTime?: string // ISO 8601
  completedTime?: string // ISO 8601
  failedTime?: string // ISO 8601
  tracing?: string
}
export interface Post {
  postId: string
  postURL: string
  postMessage: string
  postImages: string[]
  postCreationTime: string // ISO 8601
  postCrawledTime: string // ISO 8601
  groupId: string
  groupName: string
  productId?: string
  productName?: string
  productPrice?: number
  productCost?: number
  productOption?: string[][]
  productDescription?: string
  productImages?: string[]
  productStatusDate?: string // ISO 8601
  productStatus?: number
  productPublishUrl?: string
  tags?: string[]
}

export interface Product {
  productId?: string
  name?: string
  price?: number
  cost?: number
  option?: string[][]
  description?: string
  location?: string
  images?: string[]
  statusDate?: string // ISO 8601
  status?: number
  creationTime?: string // ISO 8601
  publishUrl?: string
}
