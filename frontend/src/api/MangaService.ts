import { ApplicationError } from '../mixin/errorMessageMixing';
import { useUserStore } from '../stores/user';
import { Manga } from '../models/Manga'
import { RequestOptions, Collection } from '../adapters/BaseAdapter';
import { StrapiAdapter } from '../adapters/StrapiAdapter';
import { bearerAuthorization } from '../composables/useBearerHeader';

class MangaService {
  readonly adapter: StrapiAdapter<Manga>
  readonly endpoint = '/mangas'

  constructor() {
    this.adapter = new StrapiAdapter<Manga>()
  }

  all({ fields, pagination, sort }: RequestOptions<Manga> = {}): Promise<Collection<Manga> | ApplicationError> {
    return this.adapter.get(this.endpoint, {
      populate: ['cover', 'comments'],
      pagination: pagination || { page: 1, pageSize: 25 },
      fields,
      sort: sort || [['number', 'asc']]
    })
  }

  get(id: number, { fields, pagination, sort }: RequestOptions<Manga> = {}): Promise<Manga | ApplicationError> {
    return this.adapter.getById(this.endpoint, id, {
      populate: ['cover', 'comments'], 
      fields,
      pagination, 
      sort
    })
  }

  create(item: Pick<Manga, "title" | "number" | "price"> & { cover: File }): Promise<Manga | ApplicationError> {
    const body = new FormData()
    body.append('files.cover', item.cover)
    body.append('data', JSON.stringify(item))
    return this.adapter.post(this.endpoint, { data: body }, bearerAuthorization(useUserStore().token))
  }

  remove(id: number): Promise<Manga | ApplicationError> {
    return this.adapter.delete(this.endpoint, id, bearerAuthorization(useUserStore().token))
  }

  update(id: number, item: Pick<Manga, "title" | "number" | "price"> &  { cover?: File }): Promise<Manga | ApplicationError> {
    let body: FormData | typeof item = item
    if (item.cover) {
      body = new FormData()
      body.append('files.cover', item.cover)
      body.append('data', JSON.stringify(item))
    } 
    return this.adapter.put(this.endpoint, id, { data: body }, bearerAuthorization(useUserStore().token))
  }
}

export const useMangaService = () => new MangaService()  