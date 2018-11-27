import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FileDownloaderService {

    fileCache: { [url: string]: string } = {};

    constructor(protected http: HttpClient) {}

    public download(url: string): Promise<string> {

        if (this.fileCache[url]) {
            return Promise.resolve(this.fileCache[url]);
        } else {
            return this.http.get(url, {
                responseType: 'text'
            }).toPromise()
                .then((result) => {
                    let file: string = result;
                    this.fileCache[url] = file;
                    return file;
                });
        }
    }

    public clean(url?: string): void {
        if (url) {
            delete this.fileCache[url];
        } else {
            this.fileCache = {};
        }
    }
}
