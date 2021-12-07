import { AxiosResponse, AxiosStatic } from 'axios';
import Events from 'events';
import { listeners } from 'process';

export abstract class WebCrawler<T> {
    protected _axios: AxiosStatic;
    protected _urls: URL[] = [];
    private _emmiter = new Events.EventEmitter();
    protected _result: T[] = [];

    constructor(axios: AxiosStatic) {
        this._axios = axios;
    }

    addListener(listerner: (...args: any[]) => void): void {
        this._emmiter.addListener('load', listerner);
    }

    removeListerner(listerner: (...args: any[]) => void) {
        this._emmiter.removeListener('load', listeners);
    }

    protected abstract parse(response: AxiosResponse): Promise<T[]>;

    private async fecthData(url: URL) {
        const response = await this._axios(url.toString()).catch((err) => console.log(err)) as AxiosResponse;

        if(response.status == 200) {
            return response;
        }
        console.log("Erro ocurred while fecthing data");
        throw new Error();
    }

    async fetchData() {

        for (const url of this._urls) {
            const response = await this.fecthData(url);
            const result = await this.parse(response);
            this._result = this._result.concat(result);   
        }

        this._emmiter.emit('load', this._result);
        
    }
}