

interface Comment {
    evalutaion: number;
    content: string
}

export class Manga {
    readonly cover: string;
    readonly title: string;
    readonly volumeNumber: number;
    readonly summary: string;
    readonly chapters: string[];
    readonly price: number;
    private _comments: Comment[] = [];

    constructor(title: string,  volumeNumber: number, summary: string = "", chapters: string[], cover: string = "", price: number = 30 + Math.random() * 70) {
        this.title = title;
        this.volumeNumber = volumeNumber;
        this.summary = summary;
        this.chapters = chapters;
        this.cover = cover;
        this.price = price;
    }
}