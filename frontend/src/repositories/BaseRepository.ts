import { stringify, parse } from 'qs';
import { api } from '../baseConfig'
import { ApplicationError, getAppError } from "../mixin/errorMessageMixing"
import { authenticationHeader } from "../mixin/authenticationMixing"

export type Collection<T> = {
  items: T[],
  pagination: Pagination
}

interface Pagination {
  page: number,
  pageSize: number,
  pageCount: number,
  total: number
}

type PopulateArray<T> =(keyof T)[]

type Populate<T> = PopulateArray<T> |'*'| object

type UnaryOperator = "$eq" | "$eqi"
type BinaryOperator = "$or" | "$and"

type UnaryFilter<T> = {
  [Property in keyof T]?: {
    [Property in UnaryOperator]?: string | number
  }
}

type BinaryFilter<T> = {
    [Property in BinaryOperator]? : [UnaryFilter<T>, UnaryFilter<T>]
}

type Filters<T> = (UnaryFilter<T> | BinaryFilter<T>)[] | object

export interface PaginationOptions {
  page: number,
  pageSize: number
}

type Fields<T> = (keyof T)[]

type SortOption = "asc" | "desc"

type SortFlag<T>  = [keyof T, SortOption][]

type PublicationState = "preview" | "live"

export interface GetAll<T> {
  populate?: Populate<Partial<T>>, 
  filters?: Filters<T>,
  pagination?: Partial<PaginationOptions>,
  fields?: Fields<T>,
  sort?: SortFlag<T>,
  publicationState?: PublicationState
}

export class BaseService<T> {

  constructor(private endpoint: string) {}

  private paginationToParams(pagination: Partial<PaginationOptions>) {
    return Object.fromEntries(Object.entries(pagination).map(([k, v]) => [`pagination[${k}]`, v]));
  }

  private sortToParams<T>(sort: SortFlag<T>) {
    return sort.map(([field, order]) => `${String(field)}:${order}`)
  }

  private buldingQuery({populate, fields, filters, pagination, sort, publicationState}: GetAll<T>) {
    const q = {
      ...(populate ? { populate }: {}),
      ...(filters? { filters }: {}),
      ...(pagination ? this.paginationToParams(pagination) : {}),
      ...(fields? {fields } : {}),
      ...(sort ? { sort: this.sortToParams(sort) } : {}),
      ...(publicationState ? { publicationState } : {})
    }
    return stringify(q, {
      encodeValuesOnly: true, // prettify URL
    })
  }

  async all({populate, fields, filters, pagination, sort, publicationState}: GetAll<T> = {}, token?: string): Promise<Collection<T> | ApplicationError> {
    try {
      const query = this.buldingQuery({populate, fields, filters, pagination, sort, publicationState})
      const { data } = await api.get(`${this.endpoint}?${query}`, {
        headers: {
          ...(token ? authenticationHeader(token): {})
        }
      })
      return { items: data.data,  pagination: data.meta.pagination}
    } catch(error) {
        return getAppError(error)
    }
  }
    
  async get(id: number, {populate, fields, filters, pagination, sort, publicationState}: GetAll<T> = {}, token?: string): Promise<T | ApplicationError> {
    try {
        const query = this.buldingQuery({populate, fields, filters, pagination, sort, publicationState})
        const { data } = await api.get(`${this.endpoint}/${id}?${query}`, {
          headers: {
            ...(token ? authenticationHeader(token): {})
          }
        })
        return data.data
    } catch(error) {
        return getAppError(error)
    }
  }

  private getItemAsFormData(item: Partial<T>, formData?: FormData) {
    if(formData) {
      formData.append('data', JSON.stringify(item))
      return formData
    }
    return { data: item }
  }
  
  async create(item: Partial<T>, token?: string, formData?: FormData): Promise<T | ApplicationError> {
    const body = this.getItemAsFormData(item, formData)
    try {
        const { data } = await api.post(this.endpoint, body, {
            headers: {
              ...(formData ? {'Content-Type': 'multipart/form-data'} : {}),
              ...(token ? authenticationHeader(token): {})
            }
        })
        return data.data
    } catch(error) {
        return getAppError(error)
        
    }
  }
    
  async remove(id: number, token: string): Promise<T | ApplicationError> {
    try {
        const { data } = await api.delete(`${this.endpoint}/${id}`, {
            headers: authenticationHeader(token)
        })
        return data.data
    } catch(error) {
       return getAppError(error)
    }
  }
  
  async update(id: number, item: Partial<T>, token?: string, formData?: FormData): Promise<T | ApplicationError> {
    const body = this.getItemAsFormData(item, formData)
    try {
        const { data } = await api.put(`${this.endpoint}/${id}`, body, {
            headers: {
              ...(formData ? {'Content-Type': 'multipart/form-data'} : {}),
              ...(token ? authenticationHeader(token): {})
            }
        })
        return this.get(id)
    } catch(error) {
        return getAppError(error)
    }
  }
}


