import { Manga, MangaRepository } from "../models/Manga";

interface MangaSummary {
    id: number,
    title: string,
    summary: string,
    cover: {
        url: string
    },
    number: number,
    price: number
}

export class MangaService {

    async getAll() : Promise<Manga[]>{
        return await MangaRepository.find()
    }

    async get(id: string): Promise<Manga | null> {
        return await MangaRepository.findById(id)
    }

    async create(title: string, number: number, price: number, coverPath?: string): Promise<Manga> {
        return await MangaRepository.create({
            title: title,
            number: number,
            price: price,
            cover: {
                url: coverPath,
                alternativeText: ""
            }
        })
    }

    async delete(id: string): Promise<Manga | null> {
        return await MangaRepository.findOneAndDelete({id: id})
    }

    async update(id: string, title: string, number: number, price: number, coverPath?: string): Promise<Manga | null> {
        const query: any = {
            title: title,
            number: number,
            price: price,
        }
        if(coverPath) {
            query['cover'] = {
                url: coverPath,
                alternativeText: ""
            }
        }
        return await MangaRepository.findByIdAndUpdate(id, query)
    }
}

