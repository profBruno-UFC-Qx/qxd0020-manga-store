import path from "path";
import * as cheerio from "cheerio";
import { AxiosResponse, AxiosStatic } from "axios";
import { Manga } from "../models/Manga";
import { WebCrawler } from "./web_crawler";

export class OnePieceCrawler extends WebCrawler<Manga> {

    constructor(axios: AxiosStatic) {
        super(axios);
        this._urls.push(new URL('https://onepieceex.net/mangas/'));
    }
    
    async parse(response: AxiosResponse<any, any>): Promise<Manga[]> {
        const html = response.data;
        const $ = cheerio.load(html);

        const result: Manga[] = [];

        const volumes = $('#volumes > .volume.text-uppercase');

        volumes.each( (i, element) => {
            const title = $(element).find('.info > header > .volume-nome > .titulos > h3').first().text();
            let volumeNumberStr = $(element).find('.info > header > .volume-nome > h2').first().text().split(" ");
            const volumeNumber = Number(volumeNumberStr.pop());
            let summary = $(element).find('.info > .capitulos.hide > ul > li.resenha').first().text()
            if(summary.startsWith("RESENHA OFICIAL: -")) {
                summary = summary.substring("RESENHA OFICIAL: -".length)
            } else {
                summary = summary.substring("RESENHA OFICIAL: ".length)
            }

            console.log(summary)
            const chapters: string[] = [];
            $(element).find('.info > .capitulos.hide > ul > li.volume-capitulo > span').each((i, cap) => {
                chapters.push($(cap).text());
            });
                    
            let cover = $(element).find('.info > .capitulos.hide > a.capa > img').first().attr('src');
            if (cover) {
                cover = `/img/one_piece/${path.basename(cover)}`
            }
            const manga = new Manga(i + 1, title, volumeNumber, summary, chapters, cover);
            result.push(manga);
        });

        return result;
    }

}