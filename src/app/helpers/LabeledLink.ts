/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

export class LabeledLink {

    label: string;
    link: any[];
    icon: string;
    options: {[key: string]: any};
    permissionStaticKey: string;

    constructor(label: string, link: any[], icon: string = '', options: {[key: string]: any} = {}) {
        this.label = label;
        this.link = link;
        this.icon = icon;
        this.options = options;
    }

    public set staticKey(key: string) {
        this.permissionStaticKey = key;
    }
}
