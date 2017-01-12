/**
 * Created by davidhradek on 19.12.16.
 */

///<reference path="../../node_modules/monaco-editor/monaco.d.ts"/>

import {Injectable} from "@angular/core";
import {ReplaySubject, Observable} from "rxjs";
import {ES5Lib, BlockoLib} from "../helpers/MonacoEditorTypings";

interface LibraryTypings {
    libName: string;
    libTypings: string;
}

@Injectable()
export class MonacoEditorLoaderService {

    protected monacoLoadedSubject: ReplaySubject<any> = null;
    public monacoLoaded: Observable<any> = null;

    protected typingsLibraries: { [name:string]:string } = {};

    protected wantedTypings: string[] = [];
    protected loadedTypings: { [name:string]:monaco.IDisposable } = {};

    constructor() {
        console.log("MonacoEditorLoaderService init");

        this.monacoLoaded = this.monacoLoadedSubject = new ReplaySubject<any>(1);

        // Inspired by https://github.com/0plus1/ng2-monaco-editor/blob/master/src/component/monaco-editor.component.ts
        let loaderScript = document.createElement('script');
        loaderScript.type = 'text/javascript';
        loaderScript.src = 'node_modules/monaco-editor/min/vs/loader.js';
        loaderScript.addEventListener('load', () => {
            (<any>window).require.config({ paths: { 'vs': 'node_modules/monaco-editor/min/vs' } });
            (<any>window).require(['vs/editor/editor.main'], () => {

                monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                    target: monaco.languages.typescript.ScriptTarget.ES6,
                    noLib: true,
                    allowNonTsExtensions:true
                });

                console.log("MonacoEditorLoaderService - monaco editor loaded");
                this.monacoLoadedSubject.next(monaco);
            });
        });
        document.body.appendChild(loaderScript);

        // register default libs
        this.registerTypings([ES5Lib, BlockoLib]); // TODO: remove BlockoLib later
    }

    registerTypings(library:LibraryTypings|LibraryTypings[]) {
        if (!Array.isArray(library)) {
            library = [library]
        }
        library.forEach((l) => {
            if (!this.typingsLibraries.hasOwnProperty(l.libName)) {
                this.typingsLibraries[l.libName] = l.libTypings;
            }
        });
        this.reloadTypings();
    }

    protected reloadTypings() {
        let toDelete = Object.keys(this.loadedTypings);

        this.wantedTypings.forEach((t) => {
            if (this.loadedTypings[t]) {
                let i = toDelete.indexOf(t);
                if (i > -1) {
                    toDelete.splice(i, 1);
                }
            } else {
                if (this.typingsLibraries.hasOwnProperty(t)) {
                    this.loadedTypings[t] = monaco.languages.typescript.typescriptDefaults.addExtraLib(this.typingsLibraries[t], t);
                } else {
                    console.error("MonacoEditor :: Unknown typings named \""+t+"\".");
                }
            }

        });

        toDelete.forEach((k) => {
            this.loadedTypings[k].dispose();
            delete this.loadedTypings[k];
        });
    }

    setTypescriptTypings(typings:string[]) {
        this.wantedTypings = typings;
        this.reloadTypings();
    }
}