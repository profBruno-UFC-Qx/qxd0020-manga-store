import { Manga } from "../models/Manga";
import { parse } from 'csv-parse/sync';
import * as fs from "fs";
import path from "path";

const dbPath = path.join(__dirname, '../../db/mangas.csv');

export class MangaService {
    private _mangas: Manga[] = [];

    getAll(): Manga[]{
        if(this._mangas.length == 0) {
            const fileContent = fs.readFileSync(dbPath);
            const records = parse(fileContent, {columns: true});
            for (let record of records) {
                const title = record.title;
                const volumeNumber = record.volumeNumber;
                const cover = path.basename(record['cover.href']);
                const price = Number(record.price).toFixed(2);

                const manga = new Manga(title, volumeNumber, "", [], cover, Number(price));
                this._mangas.push(manga);
            }
        }
        return this._mangas;
    }

    delete(id: number) {
        const removed = this._mangas.splice(id, 1);
        return removed.length === 1;
    }
}

