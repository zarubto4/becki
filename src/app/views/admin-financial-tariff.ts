/**
 * Created by davidhradek on 05.12.16.
 */

import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import {
    IApplicableProduct, IProductExtension, IProductExtensionType, ITariff,
    ITariffLabel
} from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsTariffModel } from '../modals/tariff';
import { Subscription } from 'rxjs';
import { ModalsExtensionModel } from '../modals/extension';

@Component({
    selector: 'bk-view-admin-financial',
    templateUrl: './admin-financial-tariff.html'
})
export class AdminFinancialTariffComponent extends BaseMainComponent implements OnInit, OnDestroy {

    tariff: ITariff = null;
    extensionTypes: IProductExtensionType[] = null;
    tariffId: string = null;

    tab: string = 'tariffs';
    routeParamsSubscription: Subscription;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.blockUI();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.tariffId = params['tariff'];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh(): void {
        this.blockUI();

        Promise.all<any>([this.backendService.tariffGet(this.tariffId), this.backendService.tariffGetAllTypes()])
            .then((values: [ITariff, IProductExtensionType[]]) => {
                this.tariff = values[0];
                this.extensionTypes = values[1];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('Tariff cannot be loaded.', reason));
                this.unblockUI();
            });

    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }

    makePrice(price: number): string {
        if (price === 0) {
            return  this.translate('label_free');
        }

        price = price / 1000;

        if (Math.floor(price) === price) {
            return price.toFixed(2) + '$';
        } else {
            return price.toFixed(2) + '$';
        }
    }

    onTariffDeactivateClick(tariff: ITariff): void {
        this.blockUI();
        this.backendService.tariffDeactivate(tariff.id)
            .then(() => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_tariff_delete_success')));
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_tariff_delete_error', reason)));
                this.refresh();
            });
    }

    onTariffActivateClick(tariff: ITariff): void {
        this.blockUI();
        this.backendService.tariffActivate(tariff.id)
            .then(() => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_tariff_delete_success')));
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_tariff_delete_error', reason)));
                this.refresh();
            });
    }

    onTariffEditClick(tariff: ITariff): void {
        let model = new ModalsTariffModel(
            true,
            tariff.company_details_required,
            tariff.color,
            tariff.awesome_icon,
            tariff.credit_for_beginning,
            tariff.description,
            tariff.name,
            tariff.identifier,
            tariff.payment_method_required,
            tariff.payment_details_required,
            tariff.labels
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.tariffEdit(tariff.id, {
                    color: model.color,
                    awesome_icon: model.awesome_icon,
                    company_details_required: model.company_details_required,
                    credit_for_beginning: model.credit_for_beginning,
                    description: model.description,
                    identifier: model.identifier,
                    name: model.name,
                    payment_method_required: model.payment_method_required,
                    payment_details_required: model.payment_details_required,
                    labels: JSON.parse(model.labelsInString)
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_tariff_edit_success', model.name)));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_tariff_edit_error', model.name, reason)));
                        this.refresh();
                    });
            }
        });
    }

    onExtensionShiftUpClick(extension: IProductExtension): void {
        this.backendService.tariffExtensionOrderUP(extension.id)
            .then(() => {
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_label', reason)));
                this.refresh();
            });
    }

    onExtensionShiftDownClick(extension: IProductExtension): void {
        this.backendService.tariffExtensionOrderDown(extension.id)
            .then(() => {
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_label', reason)));
                this.refresh();
            });
    }

    onExtensionCreate(): void {
        let model = new ModalsExtensionModel(this.extensionTypes);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.tariffExtensionCreate(this.tariffId, {
                    name: model.name,
                    description: model.description,
                    color: model.color,
                    extension_type: model.extension_type,
                    included: model.included,
                    config: model.config.toString(),
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_tariff_edit_success', model.name)));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_tariff_edit_error', model.name, reason)));
                        this.refresh();
                    });
            }
        });
    }

    onExtensionEdit(extension: IProductExtension): void {
        let model = new ModalsExtensionModel(
            this.extensionTypes,
            true,
            extension.include,
            extension.color,
            extension.name,
            extension.description,
            extension.type,
            extension.config
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.tariffExtensionEdit(extension.id, {
                    name: model.name,
                    description: model.description,
                    color: model.color,
                    included: model.included,
                    config: model.config,
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_tariff_edit_success', model.name)));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_tariff_edit_error', model.name, reason)));
                        this.refresh();
                    });
            }
        });
    }


    onExtensionActivateClick(extension: IProductExtension): void {
        this.blockUI();
        this.backendService.tariffExtensionActive(extension.id)
            .then(() => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_extension_deactivated_success')));
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_deactived_error', reason)));
                this.refresh();
            });
    }

    onExtensionDeactivateClick(extension: IProductExtension): void {
        this.blockUI();
        this.backendService.tariffExtensionDeactivate(extension.id)
            .then(() => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_extension_deactivated_success')));
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_deactived_error', reason)));
                this.refresh();
            });
    }

}




