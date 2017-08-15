/**
 * Created by davidhradek on 18.05.17.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import {
    ILibrary, ILibraryShortDetail, IMProgramShortDetailForBlocko,
    IMProjectShortDetailForBlocko
} from '../backend/TyrionAPI';


export class ModalsCodeAddLibraryModel extends ModalModel {
    constructor(public projectId: string, public library: ILibraryShortDetail = null) {
        super();
    }
}

@Component({
    selector: 'bk-modals-code-add-library',
    templateUrl: './code-add-library.html'
})
export class ModalsCodeAddLibraryComponent implements OnInit {

    @Input()
    modalModel: ModalsCodeAddLibraryModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    libraries: ILibraryShortDetail[] = [];

    selectedLibrary: ILibraryShortDetail = null;

    page = 1;

    total = 0;

    loading = false;

    constructor(private backendService: BackendService) {
    }

    loadNext() {

        if (this.loading) {
            return;
        }

        this.loading = true;
        this.backendService.libraryGetShortListByFilter(this.page, {
            project_id: this.modalModel.projectId,
            inlclude_public: true
        })
            .then((l) => {
                this.loading = false;
                this.total = l.total;
                this.page++;

                this.libraries = this.libraries.concat(l.content);

            })
            .catch((e) => {
                this.loading = false;
            });

    }

    onLibraryClick(library: ILibraryShortDetail) {
        this.selectedLibrary = library;
    }

    canLoadMore(): boolean {
        return this.libraries.length !== this.total;
    }

    ngOnInit() {
        setTimeout(() => {
            this.loadNext();
        }, 1);
    }

    onSubmitClick(): void {
        if (this.selectedLibrary) {
            this.modalModel.library = this.selectedLibrary;
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
