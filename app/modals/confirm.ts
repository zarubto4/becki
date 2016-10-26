/**
 * Created by davidhradek on 05.09.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Input, Output, EventEmitter, Component} from "@angular/core";
import {ModalModel} from "../services/ModalService";


export class ModalsConfirmModel extends ModalModel {

    public clickedButton: string = null;

    constructor(public title: string, public text: string, public showCloseBtn: boolean = true, public btnYes: string = "Yes", public btnNo: string = "No", public btnOthers: string[] = null) {
        super();
    }
}

@Component({
    selector: "modals-confirm",
    templateUrl: "app/modals/confirm.html"
})
export class ModalsConfirmComponent {

    @Input()
    modalModel: ModalsConfirmModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    constructor() {

    }

    onCloseClick(): void {
        this.modalModel.clickedButton = null;
        this.modalClose.emit(false);
    }

    onYesClick(): void {
        this.modalModel.clickedButton = this.modalModel.btnYes;
        this.modalClose.emit(true);
    }

    onNoClick(): void {
        this.modalModel.clickedButton = this.modalModel.btnNo;
        this.modalClose.emit(false);
    }

    onOthersClick(btnName: string): void {
        this.modalModel.clickedButton = btnName;
        this.modalClose.emit(true);
    }
}
