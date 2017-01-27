/**
 * Created by davidhradek on 16.08.16.
 */

export class LabeledLink {

    label: string;
    link: any[];
    icon: string;
    options: {[key: string]: any};

    constructor(label: string, link: any[], icon: string = '', options: {[key: string]: any} = {}) {
        this.label = label;
        this.link = link;
        this.icon = icon;
        this.options = options;
    }
}
