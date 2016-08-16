/**
 * Created by davidhradek on 15.08.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Input, Output, EventEmitter,  Component} from "@angular/core";
import {CORE_DIRECTIVES} from "@angular/common";
import {BeckiAsyncValidators} from "../helpers/BeckiAsyncValidators";
import {BackEndService} from "../services/BackEndService";
import {BeckiFormInput} from "../components/BeckiFormInput";
import {
    FlashMessagesService, FlashMessageSuccess,
    FlashMessageError
} from "../services/FlashMessagesService";
import {ModalModel} from "../services/ModalService";




export class ModalsRemovalModel implements ModalModel {
    constructor(public name:string) {}
}

@Component({
    selector: "modals-removal",
    templateUrl: "app/modals/removal.html",
    directives: [CORE_DIRECTIVES]
})
export class ModalsRemovalComponent {

    @Input()
    modalModel:ModalsRemovalModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    constructor() {

    }

    onCloseClick():void {
        this.modalClose.emit(false);
    }

    onYesClick():void {
        this.modalClose.emit(true);
    }

    onNoClick():void {
        this.modalClose.emit(false);
    }
}
