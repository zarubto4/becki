/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsLibraryPropertiesModel } from '../modals/library-properties';
import { IProject, ILibrary, ILibraryList } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsCodePropertiesModel } from '../modals/code-properties';

@Component({
    selector: 'bk-view-projects-project-libraries',
    templateUrl: './projects-project-libraries.html',
})
export class ProjectsProjectLibrariesComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    project_id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;
    hardwareTypesSubscription: Subscription;

    project: IProject = null;

    tab: string = 'my_libraries';

    privateLibraries: ILibraryList = null;
    publicLibraries: ILibraryList = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.project_id = params['project'];
            this.projectSubscription = this.storageService.project(this.project_id).subscribe((project) => {
                this.project = project;
                this.onFilterPrivateLibraries();
            });
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onToggleTab(tab: string) {
        this.tab = tab;

        if (this.publicLibraries == null && tab === 'public_libraries') {
            this.onFilterPublicLibraries(null);
        }
    }


    onRemoveClick(library: ILibrary): void {
        this.modalService.showModal(new ModalsRemovalModel(library.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.libraryDelete(library.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_library_removed_success')));
                        if (library.publish_type === 'PRIVATE') {
                            this.onFilterPrivateLibraries();
                        } else {
                            this.onFilterPublicLibraries();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_library_removed_fail'), reason));
                        if (library.publish_type === 'PRIVATE') {
                            this.onFilterPrivateLibraries();
                        } else {
                            this.onFilterPublicLibraries();
                        }
                    });
            }
        });
    }

    onAddClick(): void {
        let model = new ModalsLibraryPropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.libraryCreate({
                    project_id: this.project_id,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_library_add_success')));
                        this.onFilterPrivateLibraries();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_library_add_fail', model.name, reason)));
                        this.onFilterPrivateLibraries();
                    });
            }
        });
    }

    onMakeClone(library: ILibrary): void {
        let model = new ModalsCodePropertiesModel(null, library.name, library.description, '', library.tags, true, library.name, true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.libraryMakeClone({
                    library_id: library.id,
                    project_id: this.project_id,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_update')));
                        this.onFilterPrivateLibraries();
                        this.onFilterPublicLibraries();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                        this.onFilterPrivateLibraries();
                        this.onFilterPublicLibraries();
                    });
            }
        });
    }

    onEditClick(library: ILibrary): void {
        let model = new ModalsLibraryPropertiesModel(library.name, library.description, true, library.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.libraryEdit(library.id, {
                    project_id: this.project_id,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_library_edit_success')));
                        if (library.publish_type === 'PRIVATE') {
                            this.onFilterPrivateLibraries();
                        } else {
                            this.onFilterPublicLibraries();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_library_edit_fail'), reason));
                        if (library.publish_type === 'PRIVATE') {
                            this.onFilterPrivateLibraries();
                        } else {
                            this.onFilterPublicLibraries();
                        }
                    });
            }
        });
    }


    onFilterPrivateLibraries(page: number = 0): void {

        // Only for first page load - its not necessary block page - user saw private programs first - soo api have time to load
        if (page != null) {
            this.blockUI();
        } else {
            page = 1;
        }

        this.tyrionBackendService.libraryGetListByFilter(page, {
            project_id: this.project_id,
        })
            .then((iLibraryList) => {
                this.privateLibraries = iLibraryList;
                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                this.unblockUI();
            });
    }

    onFilterPublicLibraries(page: number = 0): void {

        // Only for first page load - its not necessary block page - user saw private programs first - soo api have time to load
        if (page != null) {
            this.blockUI();
        } else {
            page = 1;
        }

        this.tyrionBackendService.libraryGetListByFilter(page, {
            public_library: true,
        })
            .then((iLibraryList) => {
                this.publicLibraries = iLibraryList;
                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                this.unblockUI();
            });
    }
    onDrobDownEmiter(action: string, library: ILibrary): void {

        if (action === 'edit_library') {
            this.onEditClick(library);
        }

        if (action === 'remove_library') {
            this.onRemoveClick(library);
        }

        if (action === 'make_clone_library') {
            this.onMakeClone(library);
        }
    }


}
