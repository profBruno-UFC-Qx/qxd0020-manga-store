import { ApplicationError } from '../mixin/errorMessageMixing';
import { BaseService, Collection, GetAll } from './BaseRepository'
import { Manga } from '../models/Manga'

class MangaRepository extends BaseService<Manga> {

  constructor() {
    super("/mangas")
  }
  all({ populate, fields, filters, pagination, sort, publicationState }: GetAll<Manga> = {}): Promise<ApplicationError | Collection<Manga>> {
    return super.all({
      populate: populate || ['cover', 'comments'],
      filters, 
      pagination: pagination || { page: 1, pageSize: 25 },
      fields,
      sort: sort || [['number', 'asc']]
    })
  }

  get(id: number, { populate, fields, filters, pagination, sort, publicationState }: GetAll<Manga> = {}): Promise<Manga | ApplicationError> {
      return super.get(id, { populate: populate || ['cover', 'comments'], fields, filters, pagination, sort, publicationState}) 
  }

  create(item: Pick<Manga, "title" | "number" | "price">, token: string, formData?: FormData): Promise<Manga | ApplicationError> {
    return super.create(item, token, formData)
  }

  remove(id: number, token: string): Promise<Manga | ApplicationError> {
      return super.remove(id, token)
  }

  update(id: number, item: Pick<Manga, "title" | "number" | "price">, token: string, formData?: FormData): Promise<Manga | ApplicationError> {
    return super.update(id, item, token, formData)   
  }
}

export const useMangaService = () => new MangaRepository()  