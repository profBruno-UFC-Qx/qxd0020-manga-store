import { ApplicationError } from "../mixin/errorMessageMixing";
import { api } from "../baseConfig";

export type Collection<T> = {
  items: T[],
  pagination: Pagination
}

interface Pagination extends PaginationOptions {
  page: number,
  pageSize: number,
  pageCount: number,
  total: number
}

export type PaginationOptions = Partial<Pick<Pagination, "page" | "pageSize">>


export interface Headers {
    [x: string]: string | number | boolean;
}

type Fields<T> = (keyof T)[]

type SortOrder = "asc" | "desc"

export type SortOption<T>  = [keyof T, SortOrder][]

export interface RequestOptions<T> {
  fields?: Fields<T>,
  sort?: SortOption<T>,
  pagination?: PaginationOptions,
}


export abstract class BaseAdapter<T> {

  abstract get(url: string, options: RequestOptions<T>, headers?: Headers): Promise<Collection<T> | ApplicationError> 

  abstract getById(url: string, id: number, options: RequestOptions<T>, headers?: Headers): Promise<T | ApplicationError>

  abstract post(url: string, data?: object | ArrayBuffer | ArrayBufferView | URLSearchParams | FormData | Blob | File, headers?: Headers):  Promise<T | ApplicationError>

  abstract put(url: string, id: number, data?: object | ArrayBuffer | ArrayBufferView | URLSearchParams | FormData | Blob | File, headers?: Headers):  Promise<T | ApplicationError>

  abstract delete(url: string, id: number, headers?: Headers):  Promise<T | ApplicationError>
}