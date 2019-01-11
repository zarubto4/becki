/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { ILibrary } from '../backend/TyrionAPI';
import { NotificationService } from '../services/NotificationService';
import { TranslationService } from '../services/TranslationService';
import { IError } from '../services/_backend_class/Responses';


export class ModalsCodeAddLibraryModel extends ModalModel {
    constructor(public projectId: string, public library: ILibrary = null) {
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

    libraries: ILibrary[] = [];

    selectedLibrary: ILibrary = null;

    page = 1;

    total = 0;

    loading = false;

    constructor(private backendService: TyrionBackendService, protected notificationService: NotificationService, private translationService: TranslationService) {
    }

    loadNext() {

        if (this.loading) {
            return;
        }

        this.loading = true;
        this.backendService.libraryGetListByFilter(this.page, {
            project_id: this.modalModel.projectId,
        })
            .then((l) => {
                this.loading = false;
                this.total = l.total;
                this.page++;

                this.libraries = this.libraries.concat(l.content);

            })
            .catch((reason: IError) => {
                this.notificationService.fmError(reason);
                this.loading = false;
            });

    }

    onLibraryClick(library: ILibrary) {
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
