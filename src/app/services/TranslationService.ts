/*
* Created by DominikKrisztof 13.3.2017
*/

import { Injectable } from '@angular/core';
import { Router, CanDeactivate } from '@angular/router';
import { StaticTranslation } from './../helpers/StaticTranslation';
import { NullSafe } from '../helpers/NullSafe';


@Injectable()
export class TranslationService {

    translation: { [lang: string]: { [keyOrEnv: string]: ( string | { [key: string]: string } ) } } = StaticTranslation.translate;

    translationTables: { [lang: string]: { [tableOrEnv: string]: { [keyOrTable: string]: ( string |  { [key: string]: string } ) } } } = StaticTranslation.translateTables;

    lang: string = 'en'; // TODO TOM - Vrátit před commitem

    constructor() {
        console.info('TranslationService init');
    }

    translate(key: string, environment: any, lang: string = null, args: any[] = null): string {
        if (!lang) {
            lang = this.lang;
        }
        let env = this.environmentToString(environment);
        let translation = null;
        if (env) {
            translation = NullSafe(() => (<{ [key: string]: string }>this.translation[lang][env])[key]);
        }
        if (translation == null) {
            translation = NullSafe(() => <string>this.translation[lang][key]);
        }
        if (translation == null) {
            return '!!!' + key;
        }
        if (args && args.length) {
            translation = this.stringFormat(translation, args);
        }
        return translation;
    }

    translateTable(key: string, environment: any, table: string, lang: string = null, args: any[] = null): string {
        if (!lang) {
            lang = this.lang;
        }
        let env = this.environmentToString(environment);
        let translation = null;
        if (env) {
            translation = NullSafe(() => (<{ [key: string]: string }>this.translationTables[lang][env][table])[key]);
        }
        if (translation == null) {
            translation = NullSafe(() => <string>this.translationTables[lang][table][key]);
        }
        if (translation == null && env) {
            translation = NullSafe(() => (<{ [key: string]: string }>this.translationTables[lang][env][table])['default']);
        }
        if (translation == null) {
            translation = NullSafe(() => <string>this.translationTables[lang][table]['default']);
        }
        if (translation == null) {
            return '!!!' + key;
        }
        if (args && args.length) {
            translation = this.stringFormat(translation, args);
        }
        return translation;

    }

    protected stringFormat(str: string, args: any[]) {
        return str.replace(/{(\d+)}/g, (match: string, number: any) => {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    }

    protected environmentToString(environment: any): string {
        if (typeof environment === 'string') {
            return environment;
        } else if (typeof environment === 'function') {
            return environment();
        } else if (typeof environment === 'object') {
            if (environment.hasOwnProperty('__translateEnvironment__')) {
                return environment['__translateEnvironment__'];
            } else {
                return NullSafe(() => environment.constructor.name);
            }
        }
    }

}
