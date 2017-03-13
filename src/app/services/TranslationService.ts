/*
* Created by DominikKrisztof 13.3.2017
*/

import { Injectable } from '@angular/core';
import { Router, CanDeactivate } from '@angular/router';
import { StaticTranslation } from './../helpers/StaticTranslation';
import { NullSafe } from '../helpers/NullSafe';


@Injectable()
export class TranslationService {

    translation: { [lang: string]: { [key: string]: string } } = StaticTranslation.translate;

    translationTables: { [lang: string]: { [key: string]: { [key: string]: string}}} = StaticTranslation.translateTables;

    constructor() {
        console.info('TranslationService init');
    }

    translate( key: string, lang: string): string {
        let translation: string = NullSafe(() => this.translation[lang][key]);
        if (translation == null) {
            return '!!!' + key;
        }
        return translation;
    }

    translateTable(key: string, table: string, lang: string): string {

        let translation: string = NullSafe(() => this.translationTables[lang][table][key]);
        if (translation == null) {
            return '!!!' + key;
        }
        return translation;

    }
}
