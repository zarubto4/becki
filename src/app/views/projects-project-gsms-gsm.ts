/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs';
import { ModalsRemovalModel } from '../modals/removal';
import { IProject, IGSM, IDataSimOverview } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsGsmPropertiesModel } from '../modals/gsm-properties';
import { DataCharInterface } from '../components/ChartBarComponent';

@Component({
    selector: 'bk-view-projects-project-gsms-gsm',
    templateUrl: './projects-project-gsms-gsm.html'
})
export class ProjectsProjectGSMSGSMComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    project_id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;
    sim_id: string = null;

    tab: string = 'my_gsm';
    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    gsm: IGSM = null;
    chart_data: DataCharInterface = null;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.project_id = params['project'];
            this.sim_id = params['gsm'];
            this.projectSubscription = this.storageService.project(this.project_id).subscribe((project) => {
                this.project = project;
                this.refresh();
            });
        });
    }

    onPortletClick(action: string): void {
        if (action === 'gsm_edit') {
            this.onEditClick(this.gsm);
        }

        if (action === 'gsm_delete') {
            this.onRemoveClick(this.gsm);
        }

        if (action === 'gsm_un_register') {
            this.onUnRegistrationClick( this.gsm);
        }

        if (action === 'gsm_print_sticker') {
            this.onPrintStickerClick( this.gsm);
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
                        this.onGSMListClick();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_gsm'), reason));
                        this.unblockUI();
                        this.onGSMListClick();
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
                        this.onGSMListClick();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cellular_print_success'), reason));
                        this.unblockUI();
                        this.onGSMListClick();
                    });
            }
        });
    }

    onPrintStickerClick(gsm: IGSM): void {
        this.tyrionBackendService.simPrintSticker(gsm.id)
            .then(() => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_cellular_print_success')));
                this.unblockUI();
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cellular_print_error'), reason));
                this.refresh();
            });
    }

    onGetValues(gsm: IGSM, type: ('year' | 'current_moth' | 'last_month' | 'last_30_days' | 'curent_week' | 'last_7_days') = 'year' ): void {
        console.info('ProjectsProjectGSMSGSMComponent::onGetValues');
        this.tyrionBackendService.simGetCreditUsage(gsm.id)
            .then((overview: IDataSimOverview) => {

                let numberData: number[] = [];
                let chartLabels: string[] = [];

                for (let k in overview.datagram) {
                    if (!overview.datagram.hasOwnProperty(k)) {
                        continue;
                    }
                    numberData.push(overview.datagram[k].data_consumption);
                    chartLabels.push(overview.datagram[k].period_name);
                }

                let chartData: DataCharInterface = {
                    chart_data: [{
                        data: numberData,
                        label: 'Month'
                    }],
                    bar_chart_labels: chartLabels,
                    x_chart_label: 'Consumption in KB'
                };

                console.info('ProjectsProjectGSMSGSMComponent::DATA:: ', chartData);
                this.chart_data = chartData;

            }).catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cellular_update_error'), reason));
                return null;
            });
    }

    onEditClick(gsm: IGSM): void {
        let model = new ModalsGsmPropertiesModel(gsm);
        this.modalService.showModal(model)
            .then((success) => {
                this.tyrionBackendService.simUpdate(gsm.id, {
                    daily_traffic_threshold: model.gsm.daily_traffic_threshold,
                    daily_traffic_threshold_exceeded_limit: model.gsm.daily_traffic_threshold_exceeded_limit,
                    daily_traffic_threshold_notify_type: model.gsm.daily_traffic_threshold_notify_type,
                    monthly_traffic_threshold: model.gsm.monthly_traffic_threshold,
                    monthly_traffic_threshold_exceeded_limit: model.gsm.monthly_traffic_threshold_exceeded_limit,
                    monthly_traffic_threshold_notify_type: model.gsm.monthly_traffic_threshold_notify_type,
                    total_traffic_threshold: model.gsm.total_traffic_threshold,
                    total_traffic_threshold_exceeded_limit: model.gsm.total_traffic_threshold_exceeded_limit,
                    total_traffic_threshold_notify_type: model.gsm.total_traffic_threshold_notify_type,
                    name: model.gsm.name,
                    description: model.gsm.description,
                    tags: model.gsm.tags,
                }).then(() => {
                    this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_cellular_update_success')));
                    this.unblockUI();
                    this.refresh();
                }).catch(reason => {
                    this.addFlashMessage(new FlashMessageError(this.translate('flash_cellular_update_error'), reason));
                    this.refresh();
                });
            });
    }

    refresh(): void {
        console.info('ProjectsProjectGSMSGSMComponent::Refresh');
        this.tyrionBackendService.simGet(this.sim_id)
            .then((gsm: IGSM) => {
                this.gsm = gsm;
                this.unblockUI();
                this.onGetValues(gsm);
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_get_gsm'), reason));
                this.unblockUI();
            });
    }

    onDrobDownEmiter(action: string, object: any): void {
    }

}
