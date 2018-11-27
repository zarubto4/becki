

import { Component, Injector, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { ICProgram, ICProgramFilter, ICProgramList, ILibraryFilter, ILibraryList, ILibrary, IRole, IHardwareType } from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsCodePropertiesModel } from '../modals/code-properties';
import { ModalsLibraryPropertiesModel } from '../modals/library-properties';

@Component({
    selector: 'bk-view-admin-cprograms',
    templateUrl: './admin-cprograms.html'
})
export class CommunityCProgramComponent extends _BaseMainComponent implements OnInit {

    cPrograms: ICProgramList = null;
    cProgramsNotApproved: ICProgramList = null;

    libraries: ILibraryList = null;
    librariesNotApproved: ILibraryList = null;

    hardwareTypes: IHardwareType[] = null;


    tab: string = 'public_c_programs';

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.blockUI();

        Promise.all<any>([this.tyrionBackendService.hardwareTypesGetAll()])
            .then((values: [IHardwareType[]]) => {
                this.hardwareTypes = values[0];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('Roles cannot be loaded.', reason));
                this.unblockUI();
            });

        // Find first 25 objects
        // There is place for make it faster - load only if user click on tab
        this.onShowPublicProgramByFilter();
        this.onShowForDecisionsProgramByFilter();
        this.onShowPublicLibraryByFilter();
        this.onShowForDecisionsLibraryByFilter();
    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }

    onShowPublicProgramByFilter(page: number = 0): void {
        Promise.all<any>([this.tyrionBackendService.cProgramGetListByFilter(page, {
            public_programs: true,       // For public its required
        })
        ])
            .then((values: [ICProgramList]) => {
                this.cPrograms = values[0];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('C Programs cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onShowForDecisionsProgramByFilter(page: number = 0): void {
        Promise.all<any>([this.tyrionBackendService.cProgramGetListByFilter(page, {
            pending_programs: true,       // For public its required
        })
        ])
            .then((values: [ICProgramList]) => {
                this.cProgramsNotApproved = values[0];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('C Programs cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onShowPublicLibraryByFilter(page: number = 0): void {
        Promise.all<any>([this.tyrionBackendService.libraryGetListByFilter(page, {
            public_library: true,       // For public its required
        })
        ])
            .then((values: [ILibraryList]) => {
                this.libraries = values[0];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('C Programs cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onShowForDecisionsLibraryByFilter(page: number = 0): void {
        Promise.all<any>([this.tyrionBackendService.libraryGetListByFilter(page, {
            pending_library: true,       // For public its required
        })
        ])
            .then((values: [ILibraryList]) => {
                this.librariesNotApproved = values[0];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('C Programs cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onCProgramRemoveClick(code: ICProgram): void {
        this.modalService.showModal(new ModalsRemovalModel(code.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramDelete(code.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_remove')));
                        this.onShowPublicProgramByFilter();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_code'), reason));
                    });
            }
        });
    }

    onCProgramEditClick(code: ICProgram): void {
        if (!this.hardwareTypes) {
            this.fmError(this.translate('flash_cant_add_code_to_project'));
        }

        let model = new ModalsCodePropertiesModel(this.hardwareTypes, code.name, code.description, '', code.tags, true, code.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramEdit(code.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_update')));
                        this.onShowPublicProgramByFilter();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                    });
            }
        });
    }

    onLibraryEditClick(library: ILibrary): void {
        let model = new ModalsLibraryPropertiesModel(library.name, library.description, true, library.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.libraryEdit(library.id, {
                    project_id: null,
                    name: model.name,
                    description: model.description
                })
                    .then((lbr: ILibrary) => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_library_edit_success')));
                        this.onShowPublicLibraryByFilter();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_library_edit_fail'), reason));
                    });
            }
        });
    }

    onLibraryRemoveClick(library: ILibrary): void {
        this.modalService.showModal(new ModalsRemovalModel(library.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.libraryDelete(library.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_library_removed_success')));
                        this.onShowPublicLibraryByFilter();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_library_removed_fail'), reason));
                    });
            }
        });
    }

    onDrobDownEmiterCode(action: string, code: ICProgram): void {
        if (action === 'edit_code') {
            this.onCProgramEditClick(code);
        }

        if (action === 'remove_code') {
            this.onCProgramRemoveClick(code);
        }
    }

    onDrobDownEmiterLibrary(action: string, library: ILibrary): void {
        if (action === 'edit_library') {
            this.onLibraryEditClick(library);
        }

        if (action === 'remove_library') {
            this.onLibraryRemoveClick(library);
        }
    }
}




