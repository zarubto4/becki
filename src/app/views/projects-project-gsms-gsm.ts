/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy, ViewChild } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs';
import { ModalsRemovalModel } from '../modals/removal';
import { IProject, IGSM, IDataSimOverview, IModelMongoThingsMobileCRD, IGSMList, IGSMCDRList } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsGsmPropertiesModel } from '../modals/gsm-properties';
import { ChartBarComponent, DataCharInterface } from '../components/ChartBarComponent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { IError } from '../services/_backend_class/Responses';

import * as moment from 'moment';

export class DataChar {
    option: {
        label: string,
        value: string
    }[] = [
        {
            label: 'This Month',
            value: 'MONTH'
        },
        {
            label: 'Last Month',
            value: 'LAST_MONTH'
        },
        {
            label: 'Last 30 Days',
            value: 'LAST_30_DAYS'
        },
        {
            label: 'This Week',
            value: 'WEEK'
        },
        {
            label: 'Last 7 Days',
            value: 'LAST_7_DAYS'
        },
        {
            label: 'Yesterday',
            value: 'YESTERDAY'
        },
        {
            label: 'Today',
            value: 'TODAY'
        },
        {
            label: 'From Beginning',
            value: 'FROM_BEGINNING'
        },
        {
            label: 'Personalized',
            value: 'PERSONALIZED'
        }
    ];
}

export class DivideOption {
    option: {
        label: string,
        value: string
    }[] = [
        {
            label: 'Per Months',
            value: 'MONTH'
        },
        {
            label: 'Per Weeks',
            value: 'WEEK'
        },
        {
            label: 'Per Days',
            value: 'DAY'
        },
        {
            label: 'Per Hours',
            value: 'HOUR'
        }
    ];
}

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

    tab: string = 'overview';
    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent


    @ViewChild(ChartBarComponent)
    graphView: ChartBarComponent;

    gsm: IGSM = null;
    cdrs: IGSMCDRList = null;
    form: FormGroup;



    date: Date = new Date();

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

        if (tab === 'traffic_details') {
            this.onFilterData();
        }

        if (tab === 'cdr_details') {
            this.onFilterCDR();
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
                        this.onGSMListClick();
                    })
                    .catch((reason: IError) => {
                        this.fmError(reason);
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
                    .catch((reason: IError) => {
                        this.fmError(reason);
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
            .catch((reason: IError) => {
                this.fmError(reason);
                this.refresh();
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

                this.from = this.gsm.sim_tm_status.activation_date;
                this.to = moment().endOf('day').valueOf();
                break;
            }
            case 'PERSONALIZED': {

                break;
            }

        }

        this.tyrionBackendService.simGetDataUsage({
            project_id: this.project_id,
            sim_id_list: [this.gsm.id],
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

                    let from = moment.unix(overview.datagram[k].date_from / 1000);
                    let to = moment.unix(overview.datagram[k].date_to / 1000);

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

            }).catch((reason: IError) => {
                this.fmError(reason);
                return null;
            });
    }

    onEditClick(gsm: IGSM): void {
        let model = new ModalsGsmPropertiesModel(this.project_id, gsm);
        this.modalService.showModal(model)
            .then((success) => {
                this.blockUI();
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

                    daily_statistic: model.gsm.daily_statistic,
                    weekly_statistic: model.gsm.weekly_statistic,
                    monthly_statistic: model.gsm.monthly_statistic,

                    name: model.gsm.name,
                    description: model.gsm.description,
                    tags: model.gsm.tags,
                }).then(() => {
                    this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_cellular_update_success')));
                    this.unblockUI();
                    this.refresh();
                }).catch((reason: IError) => {
                    this.fmError(reason);
                    this.refresh();
                });
            });
    }

    onUpdateClick(): void {
        this.blockUI();

        if (!this.form.valid) {
            return;
        }

        this.tyrionBackendService.simUpdate(this.gsm.id, {

            daily_traffic_threshold:                this.form.controls['daily_traffic_threshold'].value,
            block_sim_daily:                        this.gsm.sim_tm_status.block_sim_daily,
            daily_traffic_threshold_notify_type:    this.gsm.daily_traffic_threshold_notify_type,

            monthly_traffic_threshold:              this.form.controls['monthly_traffic_threshold'].value,
            block_sim_monthly:                      this.gsm.sim_tm_status.block_sim_monthly,
            monthly_traffic_threshold_notify_type:  this.gsm.monthly_traffic_threshold_notify_type,

            total_traffic_threshold:                this.form.controls['total_traffic_threshold'].value,
            block_sim_total:                        this.gsm.sim_tm_status.block_sim_total,
            total_traffic_threshold_notify_type:    this.gsm.total_traffic_threshold_notify_type,

            daily_statistic: this.gsm.daily_statistic,
            weekly_statistic: this.gsm.weekly_statistic,
            monthly_statistic: this.gsm.monthly_statistic,

            name: this.gsm.name,
            description: this.gsm.description,
            tags: this.gsm.tags
        }).then(() => {
            this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_cellular_update_success')));
            this.unblockUI();
            this.refresh();
        }).catch((reason: IError) => {
            this.fmError(reason);
            this.refresh();
        });
    }


    onFilterCDR(page: number = 0): void {
        this.tyrionBackendService.simGetCrdRecords(page, {
            gsm_ids: [this.gsm.id],
            project_id: this.project_id,
            count_on_page: 50
        })
            .then((cdrs: IGSMCDRList) => {
                this.cdrs = cdrs;
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.fmError(reason);
                this.unblockUI();
            });
    }


    refresh(): void {
        console.info('ProjectsProjectGSMSGSMComponent::Refresh');
        this.tyrionBackendService.simGet(this.sim_id)
            .then((gsm: IGSM) => {
                this.gsm = gsm;
                this.unblockUI();

                /* tslint:disable:max-line-length */
                let input: { [key: string]: any } = {
                    'total_traffic_threshold': [this.gsm.sim_tm_status.total_traffic_threshold ?     this.gsm.sim_tm_status.total_traffic_threshold : 0, [Validators.required, BeckiValidators.number, Validators.maxLength(12)]],
                    'monthly_traffic_threshold': [this.gsm.sim_tm_status.monthly_traffic_threshold ? this.gsm.sim_tm_status.monthly_traffic_threshold : 0, [Validators.required, BeckiValidators.number, Validators.maxLength(12)]],
                    'daily_traffic_threshold': [this.gsm.sim_tm_status.daily_traffic_threshold ?     this.gsm.sim_tm_status.daily_traffic_threshold : 0, [Validators.required, BeckiValidators.number, Validators.maxLength(12)]],
                };
                /* tslint:enable:max-line-length */

                this.form = this.formBuilder.group(input);

            })
            .catch((reason: IError) => {
                this.fmError(reason);
                this.unblockUI();
            });
    }

    onDrobDownEmiter(action: string, object: any): void {
    }

}
