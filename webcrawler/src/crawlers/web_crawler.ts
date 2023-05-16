import { AxiosResponse, AxiosStatic } from 'axios';
import Events from 'events';

export abstract class WebCrawler<T> {
    protected axios: AxiosStatic;
    protected readonly url: URL;
    private emmiter = new Events.EventEmitter();
    protected result: T[] = [];

    constructor(axios: AxiosStatic, url: URL) {
        this.axios = axios;
        this.url = url;
    }

    addListener(listerner: (...args: any[]) => void): void {
        this.emmiter.addListener('load', listerner);
    }

    removeListerner(listerner: (...args: any[]) => void) {
        this.emmiter.removeListener('load', listerner);
    }

    protected abstract parse(response: AxiosResponse): Promise<T[]>;

    private async fecthData(url: URL) {
        const response = await this.axios(url.toString()).catch((err) => console.log(err)) as AxiosResponse;

        if(response.status == 200) {
            return response;
        }
        console.log("Erro ocurred while fecthing data");
        throw new Error();
    }

    async fetchData() {
        const response = await this.fecthData(this.url);
        const result = await this.parse(response);
        this.result = this.result.concat(result);   
        this.emmiter.emit('load', this.result);
    }
}