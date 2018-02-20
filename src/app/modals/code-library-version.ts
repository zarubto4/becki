/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { ILibrary, ILibraryVersion } from '../backend/TyrionAPI';


export class ModalsCodeLibraryVersionModel extends ModalModel {
    constructor(public libraryId: string, public selectedLibraryVersionId: string = null,  public libraryVersion: ILibraryVersion = null) {
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

    selectedLibraryVersion: ILibraryVersion = null;

    loading = false;

    constructor(private backendService: TyrionBackendService) {
    }

    onLibraryVersionClick(libraryVersion: ILibraryVersion) {
        this.selectedLibraryVersion = libraryVersion;
    }

    ngOnInit() {
        setTimeout(() => {
            this.loading = true;
            this.backendService.libraryGet(this.modalModel.libraryId)
                .then((l) => {
                    this.loading = false;
                    this.library = l;
                    if (this.modalModel.selectedLibraryVersionId) {
                        l.versions.forEach((v) => {
                            if (v.id === this.modalModel.selectedLibraryVersionId) {
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
