/**
 * Created by davidhradek on 18.05.17.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import {
    ILibrary, ILibraryShortDetail, ILibraryVersionShortDetail, IMProgramShortDetailForBlocko,
    IMProjectShortDetailForBlocko
} from '../backend/TyrionAPI';


export class ModalsCodeLibraryVersionModel extends ModalModel {
    constructor(public libraryId: string, public selectedLibraryVersionId: string = null,  public libraryVersion: ILibraryVersionShortDetail = null) {
        super();
    }
}

@Component({
    selector: 'bk-modals-code-library-version',
    templateUrl: './code-library-version.html'
})
export class ModalsCodeLibraryVersionComponent implements OnInit {

    @Input()
    modalModel: ModalsCodeLibraryVersionModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    library: ILibrary = null;

    selectedLibraryVersion: ILibraryVersionShortDetail = null;

    loading = false;

    constructor(private backendService: BackendService) {
    }

    onLibraryVersionClick(libraryVersion: ILibraryVersionShortDetail) {
        this.selectedLibraryVersion = libraryVersion;
    }

    ngOnInit() {
        setTimeout(() => {
            this.loading = true;
            this.backendService.getLibrary(this.modalModel.libraryId)
                .then((l) => {
                    this.loading = false;
                    this.library = l;
                    if (this.modalModel.selectedLibraryVersionId) {
                        l.versions.forEach((v) => {
                            if (v.version_id === this.modalModel.selectedLibraryVersionId) {
                                this.selectedLibraryVersion = v;
                            }
                        });
                    }
                })
                .catch((e) => {
                    this.loading = false;
                });
        }, 1);
    }

    onSubmitClick(): void {
        if (this.selectedLibraryVersion) {
            this.modalModel.libraryVersion = this.selectedLibraryVersion;
        }
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
