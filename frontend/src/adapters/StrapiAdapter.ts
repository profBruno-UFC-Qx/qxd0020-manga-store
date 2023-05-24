import { stringify } from 'qs';
import { api } from '../baseConfig';
import { ApplicationError, getAppError } from '../mixin/errorMessageMixing'
import { BaseAdapter, Collection, RequestOptions, Headers, PaginationOptions, SortOption } from './BaseAdapter'

type PopulateArray<T> = (keyof T)[]

type Populate<T> = PopulateArray<T> | '*' | object

type UnaryOperator = "$eq" | "$eqi"
type BinaryOperator = "$or" | "$and"

type UnaryFilter<T> = {
  [Property in keyof T]?: {
    [Property in UnaryOperator]?: string | number
  }
}

type BinaryFilter<T> = {
  [Property in BinaryOperator]?: [UnaryFilter<T>, UnaryFilter<T>]
}

type Filters<T> = (UnaryFilter<T> | BinaryFilter<T>)[] | object


type PublicationState = "preview" | "live"

export interface StrapiRequest<T> extends RequestOptions<T> {
  populate?: Populate<Partial<T>>,
  filters?: Filters<T>,
  publicationState?: PublicationState
}

export class StrapiAdapter<T> extends BaseAdapter<T> {

  private paginationToParams(pagination: Partial<PaginationOptions>) {
    return Object.fromEntries(Object.entries(pagination).map(([k, v]) => [`pagination[${k}]`, v]));
  }

  private sortToParams<T>(sort: SortOption<T>) {
    return sort.map(([field, order]) => `${String(field)}:${order}`)
  }

  private buldingQuery({ populate, fields, filters, pagination, sort, publicationState }: StrapiRequest<T>) {
    const q = {
      ...(populate ? { populate } : {}),
      ...(filters ? { filters } : {}),
      ...(pagination ? this.paginationToParams(pagination) : {}),
      ...(fields ? { fields } : {}),
      ...(sort ? { sort: this.sortToParams(sort) } : {}),
      ...(publicationState ? { publicationState } : {})
    }
    return stringify(q, {
      encodeValuesOnly: true, // prettify URL
    })
  }

  async get(url: string, { populate, fields, filters, pagination, sort, publicationState }: StrapiRequest<T> = {}, headers?: Headers | undefined): Promise<Collection<T> | ApplicationError> {
    try {
      const query = this.buldingQuery({ populate, fields, filters, pagination, sort, publicationState })
      const { data } = await api.get(`${url}?${query}`, {
        headers: {
          ...headers
        }
      })
      return { items: data.data, pagination: data.meta.pagination }
    } catch (error) {
      return getAppError(error)
    }
  }

  async getById(url: string, id: number, { populate, fields, filters, pagination, sort, publicationState }: StrapiRequest<T> = {}, headers?: Headers | undefined): Promise<T | ApplicationError> {
    try {
      const query = this.buldingQuery({ populate, fields, filters, pagination, sort, publicationState })
      const { data } = await api.get(`${url}/${id}?${query}`, {
        headers: {
          ...headers
        }
      })
      return data.data
    } catch (error) {
      return getAppError(error)
    }
  }

  async post(url: string, body?: object | FormData | Blob | ArrayBuffer | ArrayBufferView | URLSearchParams | File | undefined, headers?: Headers | undefined): Promise<T | ApplicationError> {
    try {
      const { data } = await api.post(url, body, {
        headers: {
          ...headers
        }
      })
      return data.data
    } catch (error) {
      return getAppError(error)
    }
  }

  async put(url: string, id: number, body?: object | FormData | Blob | ArrayBuffer | ArrayBufferView | URLSearchParams | File | undefined, headers?: Headers | undefined): Promise<T | ApplicationError> {
    try {
        await api.put(`${url}/${id}`, body, {
            headers: {
              ...headers
            }
        })
        return this.getById(url, id)
    } catch(error) {
        return getAppError(error)
    }
  }

  async delete(url: string, id: number, headers?: Headers | undefined): Promise<T | ApplicationError> {
    try {
      const { data } = await api.delete(`${url}/${id}`, {
        headers: {
          ...headers
        }
      })
      return data.data
    } catch (error) {
      return getAppError(error)
    }
  }
}