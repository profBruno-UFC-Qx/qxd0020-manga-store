import { Manga } from "../models/Manga";
import { parse } from 'csv-parse/sync';
import * as fs from "fs";
import path from "path";

const dbPath = path.join(__dirname, '../../db/mangas.csv');

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
    private _mangas: Manga[] = [];

    loadMangas() {
        const fileContent = fs.readFileSync(dbPath);
        const records = parse(fileContent, {columns: true});
        for (let record of records) {
            const title = record.title;
            const volumeNumber = Number(record.volumeNumber);
            const cover = `/img/one_piece/${path.basename(record['cover.href'])}`;
            const price = Number(record.price).toFixed(2);

            const manga = new Manga(title, volumeNumber, "", [], cover, Number(price));
            this._mangas.push(manga);
        }
    }

    getAll(): MangaSummary[]{
        const result: MangaSummary[] = []

        if(this._mangas.length == 0) {
            this.loadMangas();
        }

        for (let manga of this._mangas) {

            const {id, title, cover, number, price} = manga

            result.push({
                id: id,
                title: title,
                summary: "",
                cover: cover,
                number: number,
                price: price
            })
        }
        return result;
    }

    getById(id: number): Manga | undefined {
        if(this._mangas.length == 0) {
            this.loadMangas();
        }
        return this._mangas.find(manga => manga.id === id)
    }

    delete(id: number) {
        const removed = this._mangas.splice(id, 1);
        return removed.length === 1;
    }
}

