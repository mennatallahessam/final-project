export interface DataEnvelope<T> {
  data: T
  message?: string
  isSuccess: boolean
}

export interface DataListEnvelope<T> extends DataEnvelope<T[]> {
  total: number
}

export interface PagingRequest {
  page?: number
  pageSize?: number
  search?: string
}
