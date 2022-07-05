import { Manga, Cover } from "../entities/Manga";
import { AppDataSource } from '../db/dataSource'
import { Repository } from "typeorm";

export class MangaService {
    private repository: Repository<Manga>

    constructor(){
        this.repository = AppDataSource.getRepository(Manga)
    }

    async getAll(): Promise<Manga[]> {
        return await this.repository.find({ 
            relations: {
                cover: true,
            }
        })
    }

    async get(id: number): Promise<Manga | null> {
       return await this.repository.findOne({
        relations: {
            cover: true,
            comments: true
        },
        where: {
            id: id
        }
       })
    }

    async create(title: string, number: number, price: number, coverPath?: string): Promise<Manga> {
        const manga = this.repository.create({
            title: title,
            number: number,
            price: price,
            cover: {
                url: coverPath,
                alternativeText: `${number} - ${title}`
            }
        })
        return await this.repository.save(manga)
    }

    async delete(id: number): Promise<Manga | null> {
        const manga = await this.repository.findOneBy({ id : id })
        return manga ? await this.repository.remove(manga): null
    }

    async update(id: number, title: string, number: number, price: number, coverPath?: string): Promise<Manga | null> {
        let manga = await this.get(id)
        if(manga) {
            manga.title = title
            manga.number = number
            manga.price = price
            if(coverPath) {
                manga.cover.url = coverPath
                manga.cover.alternativeText = `${number} - ${title}`
            }
            manga = await this.repository.save(manga)
        }
        return manga
    }
}

