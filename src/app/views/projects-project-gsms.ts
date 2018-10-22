/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsCodePropertiesModel } from '../modals/code-properties';
import { IProject, IHardwareType, ICProgram, ICProgramList, IGSMList, IGSM } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsAddHardwareModel } from '../modals/add-hardware';
import { ModalsAddGSMModel } from '../modals/add-gsm';
import { ModalsGsmPropertiesModel } from '../modals/gsm-properties';

@Component({
    selector: 'bk-view-projects-project-gsms',
    templateUrl: './projects-project-gsms.html',
})
export class ProjectsProjectGSMSComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    project_id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;

    tab: string = 'my_gsm';
    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    gsmList: IGSMList = null;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.project_id = params['project'];
            this.projectSubscription = this.storageService.project(this.project_id).subscribe((project) => {
                this.project = project;
                this.onFilter();
            });
        });
    }

    onPortletClick(action: string): void {
        if (action === 'add_gsm') {
            this.onAddClick();
        }

    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }


    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }


    onRemoveClick(gsm: IGSM): void {
        this.modalService.showModal(new ModalsRemovalModel(gsm.msi_number ?  gsm.msi_number  + '' : 'unknown')).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.simDelete(gsm.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_remove')));
                        this.unblockUI();
                        this.onFilter();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_gsm'), reason));
                        this.onFilter();
                    });
            }
        });
    }

    onUnRegistrationClick(gsm: IGSM): void {
        this.modalService.showModal(new ModalsRemovalModel(gsm.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.simUnregister(gsm.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_remove')));
                        this.unblockUI();
                        this.onFilter();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cellular_print_success'), reason));
                        this.onFilter();
                    });
            }
        });
    }

    onPrintStickerClick(gsm: IGSM): void {
        this.tyrionBackendService.simPrintSticker(gsm.id)
            .then(() => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_cellular_print_success')));
                this.unblockUI();
                this.onFilter();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cellular_print_error'), reason));
                this.onFilter();
            });
    }

    onAddClick(): void {
        let model = new ModalsAddGSMModel(this.project_id);
        this.modalService.showModal(model).then((success) => {
            this.onFilter();
        }).catch((reason) => {
            this.addFlashMessage(new FlashMessageError(this.translate('flash_add_gsm_fail', reason)));
            this.onFilter();
        });
    }

    onEditClick(gsm: IGSM): void {
        let model = new ModalsGsmPropertiesModel(gsm);
        this.modalService.showModal(model)
            .then((success) => {
                this.tyrionBackendService.simUpdate(gsm.id, {
                    daily_traffic_threshold: model.gsm.sim_tm_status.daily_traffic_threshold,
                    block_sim_daily: model.gsm.sim_tm_status.block_sim_daily,
                    daily_traffic_threshold_notify_type: model.gsm.daily_traffic_threshold_notify_type,

                    monthly_traffic_threshold: model.gsm.sim_tm_status.monthly_traffic_threshold,
                    block_sim_monthly: model.gsm.sim_tm_status.block_sim_monthly,
                    monthly_traffic_threshold_notify_type: model.gsm.monthly_traffic_threshold_notify_type,

                    total_traffic_threshold: model.gsm.sim_tm_status.total_traffic_threshold,
                    block_sim_total: model.gsm.sim_tm_status.block_sim_total,
                    total_traffic_threshold_notify_type: model.gsm.total_traffic_threshold_notify_type,

                    name: model.gsm.name,
                    description: model.gsm.description,
                    tags: model.gsm.tags,
                }).then(() => {
                    this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_cellular_update_success')));
                    this.unblockUI();
                    this.onFilter();
                }).catch(reason => {
                    this.addFlashMessage(new FlashMessageError(this.translate('flash_cellular_update_error'), reason));
                    this.onFilter();
                });
            });
    }

    onMathRound(num: number): string {

        if (num === 0) {
            return '0';
        }

        return '' + Math.round((num / 1024 / 1024) * 100) / 100;
    }

    onFilter(page: number = 0): void {

        // Only for first page load - its not neccesery block page - user saw private programs first - soo api have time to load
        if (page != null) {
            this.blockUI();
        } else {
            page = 1;
        }

        this.tyrionBackendService.simGetListByFilter(page, {
            project_id: this.project_id
        })
            .then((gsms: IGSMList) => {
                this.gsmList = gsms;
                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                this.unblockUI();
            });
    }

    onDropDownEmitter(action: string, object: any): void {

        if (action === 'gsm_edit') {
            this.onEditClick(object);
        }

        if (action === 'gsm_delete') {
            this.onRemoveClick(object);
        }

        if (action === 'gsm_un_register') {
            this.onUnRegistrationClick(object);
        }

        if (action === 'gsm_print_sticker') {
            this.onPrintStickerClick(object);
        }
    }

}
