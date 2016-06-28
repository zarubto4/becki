/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

export interface ModalEvent {

  readonly:boolean;
}

export abstract class Component {

  modalEvent:ModalEvent;
}
