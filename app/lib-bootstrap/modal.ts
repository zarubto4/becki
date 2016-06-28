/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

export interface Model {

  readonly:boolean;
}

export abstract class Component {

  abstract showModal(model:Model):Promise<boolean>;

  abstract closeModal(result:boolean):void;
}
