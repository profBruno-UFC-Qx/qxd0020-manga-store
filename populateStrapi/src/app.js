import * as fs from 'fs';
import path from "path";
import { parse } from 'csv-parse/sync';
import { FormData } from 'formdata-node';
import fetch, { blobFrom } from 'node-fetch';

const __dirname = path.resolve()
const dbPath = path.join(__dirname, '../output/mangas.csv')

async function populate() {
    const fileContent = fs.readFileSync(dbPath);
    const records = parse(fileContent, {columns: true});
    for (let record of records) {
        const title = record.title;
        const volumeNumber = Number(record.number);
        const cover = record.cover;
        const price = record.price
        const summary = record.summary || ""

        const coverPath = path.join(__dirname, `../output/${cover}`)
        const form = new FormData();

        form.append('data', JSON.stringify({
            title: title,
            number: volumeNumber,
            price: price,
            summary: summary
        }))
        
        const file = await blobFrom(coverPath, 'image/jpeg');
        form.append('files.cover', file, path.basename(coverPath));

        
        const response = await fetch('http://127.0.0.1:1337/api/mangas', {
            method: 'post',
            body: form
        });
        const data  =  await response.json()
        console.log(data)
            
            
        
    }
}

await populate()