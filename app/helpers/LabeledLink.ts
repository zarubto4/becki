/**
 * Created by davidhradek on 16.08.16.
 */

export class LabeledLink {

    label:string;

    link:any[];

    icon:string;

    constructor(label:string, link:any[], icon="file") {
        this.label = label;
        this.link = link;
        this.icon = icon;
    }
}