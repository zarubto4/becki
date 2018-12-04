/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy, ViewChild } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs';
import { ModalsRemovalModel } from '../modals/removal';
import {
    IProject,
    IGSMList,
    IGSM,
    IDataSimOverview
} from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsAddGSMModel } from '../modals/add-gsm';
import { ModalsGsmPropertiesModel } from '../modals/gsm-properties';
import { DataChar, DivideOption } from './projects-project-gsms-gsm';
import { ChartBarComponent, DataCharInterface } from '../components/ChartBarComponent';
import * as moment from 'moment';

@Component({
    selector: 'bk-view-projects-project-gsms',
    templateUrl: './projects-project-gsms.html',
})
export class ProjectsProjectGSMSComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    project_id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;

    tab: string = 'overview';
    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    gsmList: IGSMList = null;

    @ViewChild(ChartBarComponent)
    graphView: ChartBarComponent;

    // For Filter parameters
    periodOption: DataChar = new DataChar();
    divideOption: DivideOption = new DivideOption();

    from: number = 0;
    to: number = 0;
    PERIOD: string = 'LAST_30_DAYS';
    DIVIDE_OPTION: string = 'DAY';

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

        if (tab === 'traffic_details') {
            this.onFilterData();
        }
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
        let model = new ModalsGsmPropertiesModel(this.project_id, gsm);
        this.modalService.showModal(model)
            .then((success) => {
                this.tyrionBackendService.simUpdate(gsm.id, {
                    daily_traffic_threshold: model.gsm.sim_tm_status.daily_traffic_threshold  * 1024 * 1024,
                    block_sim_daily: model.gsm.sim_tm_status.block_sim_daily,
                    daily_traffic_threshold_notify_type: model.gsm.daily_traffic_threshold_notify_type,

                    monthly_traffic_threshold: model.gsm.sim_tm_status.monthly_traffic_threshold  * 1024 * 1024,
                    block_sim_monthly: model.gsm.sim_tm_status.block_sim_monthly,
                    monthly_traffic_threshold_notify_type: model.gsm.monthly_traffic_threshold_notify_type,

                    total_traffic_threshold: model.gsm.sim_tm_status.total_traffic_threshold  * 1024 * 1024,
                    block_sim_total: model.gsm.sim_tm_status.block_sim_total,
                    total_traffic_threshold_notify_type: model.gsm.total_traffic_threshold_notify_type,

                    daily_statistic: model.gsm.daily_statistic,
                    weekly_statistic: model.gsm.weekly_statistic,
                    monthly_statistic: model.gsm.monthly_statistic,

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

    onFilterChange(filter: {key: string, value: any}) {
        console.info('onFilterChange: Key', filter.key, 'value', filter.value);

        if (filter.key === 'PERIOD') {
            this.PERIOD = filter.value;
        }

        if (filter.key === 'DIVIDE_OPTION') {
            this.DIVIDE_OPTION = filter.value;
        }

        this.onFilterData();
    }

    onFilterData(): void {

        console.info('onFilterData::onGetValues');
        console.info('onFilterData::this.PERIOD: ', this.PERIOD);
        console.info('onFilterData::this.DIVIDE_OPTION: ', this.DIVIDE_OPTION);

        switch (this.PERIOD) {

            case 'MONTH': {

                this.from = moment().startOf('month').valueOf();
                this.to   = moment().endOf('month').valueOf();
                break;
            }
            case 'LAST_MONTH': {

                this.from = moment().subtract(1, 'month').startOf('month').valueOf();
                this.to   = moment().subtract(1, 'month').endOf('month').valueOf();

                break;
            }
            case 'WEEK': {

                this.from = moment().startOf('week').valueOf();
                this.to   = moment().endOf('week').valueOf();
                break;
            }
            case 'LAST_7_DAYS': {
                this.from = moment().subtract(7, 'days').startOf('day').valueOf();
                this.to   = moment().endOf('day').valueOf();
                break;
            }
            case 'LAST_30_DAYS': {

                this.from = moment().subtract(30, 'days').startOf('day').valueOf();
                this.to   = moment().endOf(  'day').valueOf();
                break;
            }
            case 'YESTERDAY': {

                this.from = moment().subtract(1, 'days').startOf('day').valueOf();
                this.to   = moment().subtract(1, 'days').endOf('day').valueOf();
                break;
            }
            case 'TODAY': {
                this.from = moment().startOf('day').valueOf();
                this.to   = moment().endOf('day').valueOf();
                break;
            }
            case 'FROM_BEGINNING': {

                this.from = moment().subtract(1, 'year').startOf('year').valueOf();
                this.to = moment().endOf('day').valueOf();
                break;
            }
            case 'PERSONALIZED': {

                break;
            }

        }

        this.tyrionBackendService.simGetDataUsage({
            project_id: this.project_id,
            from: this.from,
            to:   this.to,
            country_code: null,
            blocked: false,
            time_period: <any> this.DIVIDE_OPTION
        })
            .then((overview: IDataSimOverview) => {

                let numberData: number[] = [];
                let chartLabels: string[] = [];

                for (let k in overview.datagram) {
                    if (!overview.datagram.hasOwnProperty(k)) {
                        continue;
                    }
                    numberData.push(overview.datagram[k].data_consumption);

                    let from = moment.unix(overview.datagram[k].long_from / 1000);
                    let to = moment.unix(overview.datagram[k].long_to / 1000);

                    if (this.DIVIDE_OPTION !== 'HOUR') {
                        chartLabels.push(from.format('DD.MM') + '-' + to.format('DD.MM') );
                    } else {
                        chartLabels.push(from.format('HH') + ' - ' +  to.format('HH'));
                    }
                }

                let chartData: DataCharInterface = {
                    chart_data: [{
                        data: numberData,
                        label: 'Consumption in KB'
                    }],
                    bar_chart_labels: chartLabels,
                    x_chart_label: 'Consumption in KB'
                };

                console.info('ProjectsProjectGSMSGSMComponent::DATA:: ', chartData);
                this.graphView.setData(chartData);

            }).catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cellular_update_error'), reason));
                return null;
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
