/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import {Component} from "@angular/core";
import {ModalService} from "../services/ModalService";

@Component({
    selector: "modal",
    templateUrl: "app/modals/modal.html"
})
export class ModalComponent {
    constructor(protected modalService: ModalService) {
    }
}


