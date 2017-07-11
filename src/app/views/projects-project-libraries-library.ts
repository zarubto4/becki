/**
 * Created by davidhradek on 17.08.16.
 */

import { Component, OnInit, Injector, OnDestroy, ViewChild } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess, FlashMessage } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { CodeFile } from '../components/CodeIDEComponent';
import { ModalsConfirmModel } from '../modals/confirm';
import { ModalsVersionDialogModel } from '../modals/version-dialog';
import {
    IProject, ICProgram, ICProgramVersion, ILibraryRecord, ICProgramVersionShortDetail, ITypeOfBoard,
    IBoardShortDetail, ILibrary, ILibraryVersionShortDetail, ILibraryVersion
} from '../backend/TyrionAPI';
import { ICodeCompileErrorMessage, CodeCompileError, CodeError } from '../backend/BeckiBackend';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { NullSafe } from '../helpers/NullSafe';
import { ModalsSelectHardwareComponent, ModalsSelectHardwareModel } from '../modals/select-hardware';
import { getAllInputOutputs, getInputsOutputs } from '../helpers/CodeInterfaceHelpers';
import { BlockoViewComponent } from '../components/BlockoViewComponent';
import { ModalsRemovalModel } from '../modals/removal';
import moment = require('moment/moment');
import { ModalsLibraryPropertiesModel } from '../modals/library-properties';



@Component({
    selector: 'bk-view-projects-project-libraries-library',
    templateUrl: './projects-project-libraries-library.html'
})
export class ProjectsProjectLibrariesLibraryComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    libraryId: string;

    routeParamsSubscription: Subscription;

    // project: IProject = null;

    library: ILibrary = null;
    libraryVersions: ILibraryVersionShortDetail[] = null;

    selectedLibraryVersion: ILibraryVersion = null;
    selectedCodeFiles: CodeFile[] = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent
    reloadInterval: any = null;
    device: ITypeOfBoard = null;

    allDevices: IBoardShortDetail[];
    projectSubscription: Subscription;

    protected afterLoadSelectedVersionId: string = null;

    constructor(injector: Injector) {
        super(injector);
    };

    /* TODO:
    *   - udělat nemožnost dát tam main.cpp
    * */


    ngOnInit(): void {
        let readme = new CodeFile('README.md', `# Library\n\nSome information about your library!`);
        this.selectedCodeFiles = [readme];

        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.libraryId = params['library'];
            this.refresh();

            if (!this.projectSubscription) {
                this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                    this.allDevices = project.boards;
                });
            }
            if (params['version']) {
                this.router.navigate(['/projects', this.projectId, 'library', this.libraryId], {replaceUrl: true});
                this.selectVersionByVersionId(params['version']);
            }
        });

    }

    onRemoveClick(): void {
        this.modalService.showModal(new ModalsRemovalModel(this.library.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteLibrary(this.library.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_save_success')));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.navigate(['/projects', this.currentParamsService.get('project'), 'libraries']);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_library_removed_fail', reason)));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                    });
            }
        });
    }

    onEditClick(): void {
        let model = new ModalsLibraryPropertiesModel(this.library.name, this.library.description, true, this.library.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editLibrary(this.library.id, {
                    project_id: this.projectId,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_library_edit_success')));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_library_edit_fail', reason)));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.refresh();
                    });
            }
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();

        if (this.reloadInterval) {
            clearInterval(this.reloadInterval);
            this.reloadInterval = null;
        }

        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    selectVersionByVersionId(versionId: string) {
        if (this.libraryVersions && !(this.libraryVersions.length === 0)) {
            let version = null;
            if (versionId) {
                version = this.libraryVersions.find((lv) => lv.version_id === versionId);
            }

            if (version) {
                this.selectLibraryVersion(version);
            }
        } else {
            this.afterLoadSelectedVersionId = versionId;
        }
    }

    onRemoveVersionClick(version: ILibraryVersionShortDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(version.version_name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteLibraryVersion(version.version_id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_removed_success')));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_version_removed_fail', reason)));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.refresh();
                    });
            }
        });
    }

    onEditVersionClick(version: ILibraryVersionShortDetail): void {
        let model = new ModalsVersionDialogModel(version.version_name, version.version_description, true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editLibraryVersion(version.version_id, { // TODO [permission]: version.update_permission
                    version_name: model.name,
                    version_description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_edit_success', model.name)));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError( this.translate('flash_version_edit_fail', model.name , reason)));
                        this.refresh();
                    });
            }
        });
    }

    refresh(): void {

        this.blockUI();
        this.backendService.getLibrary(this.libraryId)
            .then((library) => {

                this.library = library;

                this.libraryVersions = this.library.versions || [];

                /*this.codeProgramVersions.sort((a, b)=> {
                    if (a.version_object.date_of_create == b.version_object.date_of_create) return 0;
                    if (a.version_object.date_of_create > b.version_object.date_of_create) return -1;
                    return 1;
                });*/

                let version = null;
                if (this.afterLoadSelectedVersionId) {
                    version = this.libraryVersions.find((lv) => lv.version_id === this.afterLoadSelectedVersionId);
                }

                if (version) {
                    this.selectLibraryVersion(version);
                } else if (this.libraryVersions.length > 0) {
                    this.selectLibraryVersion(this.libraryVersions[0]);
                }

                this.unblockUI();
            })
            .catch(reason => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError( this.translate('flash_cannot_load_library', reason)));
            });

    }

    reloadVersions(): void {
        if (this.libraryId) {
            this.backendService.getLibrary(this.libraryId)
                .then((library) => {
                    this.library = library;
                    this.libraryVersions = this.library.versions || [];
                });
        }
    }

    selectLibraryVersion(libraryVersion: ILibraryVersionShortDetail) {
        if (!this.libraryVersions) {
            return;
        }
        if (this.libraryVersions.indexOf(libraryVersion) === -1) {
            return;
        }

        this.blockUI();
        this.backendService.getLibraryVersion(libraryVersion.version_id)
            .then((programVersionFull) => {
                this.unblockUI();

                this.selectedLibraryVersion = programVersionFull;

                let codeFiles: CodeFile[] = [];
                if (Array.isArray(programVersionFull.files)) {
                    codeFiles = (programVersionFull.files).map((uf) => {
                        return new CodeFile(uf.file_name, uf.content);
                    });
                }

                this.selectedCodeFiles = codeFiles;
            })
            .catch((err) => {
                this.unblockUI();
                this.fmError(`Cannot load version <b>${libraryVersion.version_name}</b>`, err);
            });

    }

    onLibraryVersionClick(libraryVersion: ILibraryVersionShortDetail) {

        if (this.selectedLibraryVersion) {

            let changedFiles: string[] = this.changesInSelectedVersion();

            if (changedFiles.length) {

                let text = '';
                if (this.selectedLibraryVersion.version_id === libraryVersion.version_id) {
                    text = 'You have <b>unsaved changes</b> in version <b>'
                        + this.selectedLibraryVersion.version_name
                        + '</b>, do you really want reload this version?';
                } else {
                    text = 'You have <b>unsaved changes</b> in version <b>'
                        + this.selectedLibraryVersion.version_name
                        + '</b>, do you really want switch to version <b>'
                        + libraryVersion.version_name
                        + '</b>?';
                }

                let confirm = new ModalsConfirmModel(
                    text,
                    '<h5>Changed files:</h5>' + changedFiles.join('<br>')
                );

                this.modalService.showModal(confirm).then((yes) => {
                    if (yes) {
                        this.selectLibraryVersion(libraryVersion);
                    }
                });

            } else {
                if (this.selectedLibraryVersion.version_id !== libraryVersion.version_id) {
                    this.selectLibraryVersion(libraryVersion);
                }
            }

        } else {
            this.selectLibraryVersion(libraryVersion);
        }
    }

    changesInSelectedVersion(): string[] {
        let changedFiles: string[] = [];
        if (Array.isArray(this.selectedCodeFiles)) {
            this.selectedCodeFiles.forEach((file) => {
                if (file.changes) {
                    changedFiles.push('/' + file.objectFullPath);
                }
            });
        }
        return changedFiles;
    }

    isSelected(version: ILibraryVersionShortDetail): boolean {
        return NullSafe(() => this.selectedLibraryVersion.version_id) === version.version_id;
    }

    onSaveClick() {
        if (this.changesInSelectedVersion().length === 0) {
            return;
        }

        let m = new ModalsVersionDialogModel(moment().format('YYYY-MM-DD HH:mm:ss'));
        this.modalService.showModal(m).then((success) => {
            if (success) {
                let main = '';

                let userFiles: ILibraryRecord[] = [];

                this.selectedCodeFiles.forEach((file) => {
                    userFiles.push({
                        file_name: file.objectFullPath,
                        content: file.content
                    });
                });

                this.blockUI();
                this.backendService.createLibraryVersion(this.libraryId, {
                    version_name: m.name,
                    version_description: m.description,
                    files: userFiles
                })
                    .then(() => {
                        this.fmSuccess('Version <b>' + m.name + '</b> saved successfully.');
                        this.refresh();
                    })
                    .catch((err) => {
                        this.fmError('Failed saving version <b>' + m.name + '</b>', err);
                        this.unblockUI();
                    });
            }
        });
    }

}
