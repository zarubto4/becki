/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

export interface Model {
}

export class RemovalModel implements Model {

  name:string;

  constructor(name:string) {
    "use strict";

    this.name = name;
  }
}

export class FilenameModel implements Model {

  name:string;

  separator:string;

  constructor(name:string, separator:string) {
    "use strict";

    this.name = name;
    this.separator = separator;
  }
}

export abstract class Component {

  abstract showModal(model:Model):Promise<boolean>;

  abstract closeModal(result:boolean):void;
}
