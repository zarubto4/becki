/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import {Component} from "@angular/core";
import {REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {CORE_DIRECTIVES} from "@angular/common";
import {ModalService} from "../services/ModalService";
import {ModalsRemovalComponent} from "./removal";
import {ModalsProjectPropertiesComponent} from "./project-properties";
import {ModalsAddHardwareComponent} from "./add-hardware";
import {ModalsBlockoPropertiesComponent} from "./blocko-properties";
import {ModalsCodePropertiesComponent} from "./code-properties";
import {ModalsCodeFileDialogComponent} from "./code-file-dialog";
import {ModalsConfirmComponent} from "./confirm";
import {ModalsVersionDialogComponent} from "./version-dialog";
import {ModalsBlockoJsEditorComponent} from "./blocko-js-editor";
import {ModalsBlockoConfigPropertiesComponent} from "./blocko-config-properties";
import {ModalsBlockoAddHardwareComponent} from "./blocko-add-hardware";

@Component({
    selector: "modal",
    templateUrl: "app/modals/modal.html",
    directives: [CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES,
        ModalsProjectPropertiesComponent,
        ModalsRemovalComponent,
        ModalsAddHardwareComponent,
        ModalsBlockoPropertiesComponent,
        ModalsCodePropertiesComponent,
        ModalsCodeFileDialogComponent,
        ModalsConfirmComponent,
        ModalsVersionDialogComponent,
        ModalsBlockoJsEditorComponent,
        ModalsBlockoConfigPropertiesComponent,
        ModalsBlockoAddHardwareComponent,
    ]
})
export class ModalComponent {
    constructor(protected modalService:ModalService) {}
}


