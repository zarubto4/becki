/**
 * Created by dominikKrisztof on 25.10.16.
 */

/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Input, Output, EventEmitter, Component, OnInit} from "@angular/core";
import {ModalModel} from "../services/ModalService";


export class ModalsHighImportanceNotificationModel extends ModalModel {
    constructor(public name: string = "", public notification_body: string = "", public messageId: string = "") {
        super();
    }
}

@Component({
    selector: "modals-high-importance-notification",
    templateUrl: "app/modals/high-importance-notification.html"
})
export class ModalsHighImportanceNotificationComponent implements OnInit {

    @Input()
    modalModel: ModalsHighImportanceNotificationModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit() {
    }

    onSubmitClick(): void {
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
