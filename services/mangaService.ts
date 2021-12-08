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
                const cover = record['cover.href'];
                const price = record.price;

                const manga = new Manga(title, volumeNumber, "", [], cover, price);
                this._mangas.push(manga);
            }
        }
        return this._mangas;
    }
}

