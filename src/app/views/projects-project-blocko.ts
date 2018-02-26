/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsBlockoPropertiesModel } from '../modals/blocko-properties';
import { IBProgram, IBProgramList, IProject} from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';

@Component({
    selector: 'bk-view-projects-project-blocko',
    templateUrl: './projects-project-blocko.html',
})
export class ProjectsProjectBlockoComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    project_id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;

    privatePrograms: IBProgramList = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    tab: string = 'my_programs';

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.project_id = params['project'];
            this.projectSubscription = this.storageService.project(this.project_id).subscribe((project) => {
                this.project = project;
                this.onFilterPrivatePrograms();
            });
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onPortletClick(action: string): void {
        if (action === 'add_blocko') {
            this.onAddClick();
        }
    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }

    onRemoveClick(blocko: IBProgram): void {
        this.modalService.showModal(new ModalsRemovalModel(blocko.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.bProgramDelete(blocko.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_blocko_removed')));
                        this.storageService.projectRefresh(this.project_id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_blocko_cant_remove'), reason));
                        this.storageService.projectRefresh(this.project_id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onAddClick(): void {
        let model = new ModalsBlockoPropertiesModel(this.project_id);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.bProgramCreate(this.project_id, { name: model.name, description: model.description }) // TODO [permission]: "Project.update_permission"
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_blocko_add_to_project', model.name)));
                        this.storageService.projectRefresh(this.project_id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_blocko_cant_add_to_project', model.name, reason)));
                        this.storageService.projectRefresh(this.project_id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onEditClick(blocko: IBProgram): void {
        let model = new ModalsBlockoPropertiesModel(this.project_id, blocko.name, blocko.description, true, blocko.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.bProgramEdit(blocko.id, { name: model.name, description: model.description })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_blocko_update')));
                        this.storageService.projectRefresh(this.project_id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_blocko_cant_update'), reason));
                        this.storageService.projectRefresh(this.project_id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onFilterPrivatePrograms(page: number = 0): void {
        // Only for first page load - its not neccesery block page - user saw private programs first - soo api have time to load
        if (page != null) {
            this.blockUI();
        } else {
            page = 1;
        }

        this.tyrionBackendService.bProgramGetByFilter(page, {
            project_id: this.project_id
        })
            .then((bProgramList) => {
                this.privatePrograms = bProgramList;
                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                this.unblockUI();
            });
    }
}
