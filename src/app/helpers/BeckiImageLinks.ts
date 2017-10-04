import { Injectable } from '@angular/core';
import { NullSafe } from './NullSafe';


@Injectable()
export class BeckiImageLinks {

    public getBeckiImage(imageName: string, folderName: string): string {
        let pic = NullSafe(() => require('../../public/assets/images/' + folderName + '/' + imageName));
        if (pic) {
            return pic;
        } else {
            console.warn('Image ' + imageName + ' not found');
            return require('../../public/assets/images/flags/notFound.svg');
        }
    }


    /* just to be sure
        public flag_china = require('../../public/assets/images/flags/china.svg');
        public flag_czech = require('../../public/assets/images/flags/czech.svg');
        public flag_france = require('../../public/assets/images/flags/france.svg');
        public flag_germany = require('../../public/assets/images/flags/germany.svg');
        public flag_japan = require('../../public/assets/images/flags/japan.svg');
        public flag_poland = require('../../public/assets/images/flags/poland.svg');
        public flag_russia = require('../../public/assets/images/flags/russia.svg');
        public flag_swiss = require('../../public/assets/images/flags/swiss.svg');
        public flag_usa = require('../../public/assets/images/flags/usa.svg');
    */

    constructor() {
        console.info('ImageService init');

    }
}








