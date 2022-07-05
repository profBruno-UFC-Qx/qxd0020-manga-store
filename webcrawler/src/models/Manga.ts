export class Manga {
    readonly id: number;
    readonly cover: string;
    readonly title: string;
    readonly number: number;
    readonly summary: string;
    readonly chapters: string[];
    readonly price: number;

    constructor(id: number, title: string,  number: number, summary: string = "", chapters: string[], cover: string = "", price: number = 30 + Math.random() * 70) {
        this.id = id;
        this.title = title;
        this.number = number;
        this.summary = summary;
        this.chapters = chapters;
        this.cover = cover;
        this.price =  Number(price.toFixed(2));
    }
}