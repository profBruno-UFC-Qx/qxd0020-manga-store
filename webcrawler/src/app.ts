import axios from 'axios';
import { Manga } from './models/Manga';
import { OnePieceCrawler } from './crawlers/one_piece';
import { stringify } from "csv-stringify"; 
import * as fs from 'fs';
import path from "path";

const onePieceCrawler = new OnePieceCrawler(axios);

onePieceCrawler.addListener(persistResult);

onePieceCrawler.fetchData();

const filePath = path.join(__dirname, '../output/mangas.csv');

function persistResult(mangas: Manga[]){
    console.table(mangas, ['title', 'number', 'price']);
    onePieceCrawler.removeListerner(persistResult);

    stringify(mangas, {
        header: true,
        columns: [ { key: 'title' }, { key: 'number' }, { key: 'cover' }, { key: 'price' }, {key: 'summary'}],
        quoted: false
    }, (err, output) => {
        fs.writeFileSync(filePath, output);
    });
}