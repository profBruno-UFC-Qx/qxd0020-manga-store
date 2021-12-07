import axios from 'axios';
import { Manga } from '../models/Manga';
import { OnePieceCrawler } from '../crawlers/one_piece';
import { stringify } from "csv-stringify"; 
import * as fs from 'fs';
import path from "path";

const onePieceCrawler = new OnePieceCrawler(axios);

onePieceCrawler.addListener(persistResult);

onePieceCrawler.fetchData();

const filePath = path.join(__dirname, '../../db/mangas.csv');

function persistResult(mangas: Manga[]){
    console.table(mangas, ['title', 'volumeNumber']);
    onePieceCrawler.removeListerner(persistResult);

    stringify(mangas, {
        header: true,
        columns: [ { key: 'title' }, { key: 'volumeNumber' }, { key: 'cover.href' }, { key: 'price' }],
        quoted: false
    }, (err, output) => {
        fs.writeFileSync(filePath, output);
    });
}