/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { ModalModel } from '../services/ModalService';
import { TranslationService } from '../services/TranslationService';


export class ModalsConfirmModel extends ModalModel {

    public clickedButton: string = null;

    constructor(
        public title: string,
        public text: string,
        public showCloseBtn: boolean = true,
        public btnYes: string = 'Yes',
        public btnNo: string = 'No',
        public btnOthers: string[] = null
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-confirm',
    templateUrl: './confirm.html'
})
export class ModalsConfirmComponent implements OnInit {

    @Input()
    modalModel: ModalsConfirmModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    constructor(private translationService: TranslationService) {

    }

    ngOnInit(): void {
        if (this.modalModel.btnYes) {
            this.modalModel.btnYes = this.translate('btn_yes');
        }
        if (this.modalModel.btnNo) {
            this.modalModel.btnNo = this.translate('btn_no');
        }
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

    translate(key: string, ...args: any[]): string {
        return this.translationService.translate(key, this, null, args);
    }
}
