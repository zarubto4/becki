import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class FileDownloaderService {

    fileCache: { [url: string]: string } = {};

    constructor(protected http: Http) {}

    public download(url: string): Promise<string> {

        if (this.fileCache[url]) {
            return Promise.resolve(this.fileCache[url]);
        } else {
            return this.http.get(url, {}).toPromise()
                .then((result) => {
                    let file: string = result.text();
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
