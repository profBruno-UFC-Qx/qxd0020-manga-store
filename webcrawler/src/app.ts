import * as fs from 'fs'
import path from "path"
import axios from 'axios'
import download from 'download'
import { stringify } from "csv-stringify"
import { Manga } from './models/Manga'
import { OnePieceCrawler } from './crawlers/one_piece'

const onePieceCrawler = new OnePieceCrawler(axios);

onePieceCrawler.addListener(persistResult);
onePieceCrawler.fetchData();
const filePath = path.join(__dirname, '../../output/mangas.csv');

async function persistResult(mangas: Manga[]) {
  console.table(mangas, ['title', 'number', 'price']);
  onePieceCrawler.removeListerner(persistResult);

  console.log('Baixando todas as imagens')
  await Promise.all(
    mangas.map(m => m.cover).map(url => download(url, path.join(__dirname, '../../output/img')))
  )

  const mangasTranformed = mangas.map(m => ({ ...m, cover: `img/${path.basename(m.cover)}` }))

  stringify(mangasTranformed, {
    header: true,
    columns: [{ key: 'title' }, { key: 'number' }, { key: 'cover' }, { key: 'price' }, { key: 'summary' }],
    quoted: false
  }, (err, output) => {
    fs.writeFileSync(filePath, output);
  });
}

