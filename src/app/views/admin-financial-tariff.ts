/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import {
    IApplicableProduct, IProductExtension, IProductExtensionType, ITariff, ITariffExtension,
    ITariffLabel
} from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsTariffModel } from '../modals/tariff';
import { Subscription } from 'rxjs';
import { IError } from '../services/_backend_class/Responses';
import { ModalsExtensionModel } from '../modals/extension';

@Component({
    selector: 'bk-view-admin-financial',
    templateUrl: './admin-financial-tariff.html'
})
export class AdminFinancialTariffComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    tariff: ITariff = null;
    tariffId: string = null;
    extensions: ITariffExtension[] = null;

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

        Promise.all<any>([this.tyrionBackendService.tariffGet(this.tariffId), this.tyrionBackendService.tariffGetExtensionsAll()])
            .then((values: [ITariff, ITariffExtension[]]) => {
                this.tariff = values[0];
                this.extensions = values[1];
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.fmError(reason);
                this.unblockUI();
            });

    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }

    makePrice(price: number): string {
        if (price === 0) {
            return this.translate('label_free');
        }

        if (Math.floor(price) === price) {
            return price.toFixed(2) + '$';
        } else {
            return price.toFixed(2) + '$';
        }
    }

    onTariffDeactivateClick(tariff: ITariff): void {
        this.blockUI();
        this.tyrionBackendService.tariffDeactivate(tariff.id)
            .then(() => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_tariff_deactive_success')));
                this.refresh();
            })
            .catch((reason: IError) => {
                this.fmError(reason);
                this.refresh();
            });
    }

    onTariffActivateClick(tariff: ITariff): void {
        this.blockUI();
        this.tyrionBackendService.tariffActivate(tariff.id)
            .then(() => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_tariff_active_success')));
                this.refresh();
            })
            .catch((reason: IError) => {
                this.fmError(reason);
                this.refresh();
            });
    }

    onTariffEditClick(tariff: ITariff): void {
        let model = new ModalsTariffModel(
            true,
            tariff.owner_details_required,
            tariff.color,
            tariff.awesome_icon,
            tariff.credit_for_beginning,
            tariff.description,
            tariff.name,
            tariff.identifier,
            tariff.payment_details_required,
            tariff.labels
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.tariffEdit(tariff.id, {
                    color: model.color,
                    awesome_icon: model.awesome_icon,
                    owner_details_required: model.owner_details_required,
                    credit_for_beginning: model.credit_for_beginning,
                    description: model.description,
                    identifier: model.identifier,
                    name: model.name,
                    payment_details_required: model.payment_details_required,
                    labels: JSON.parse(model.labelsInString)
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_tariff_edit_success', model.name)));
                        this.refresh();
                    })
                    .catch((reason: IError) => {
                        this.fmError(reason);
                        this.refresh();
                    });
            }
        });
    }

    isIncluded(extension: ITariffExtension): boolean {
        return this.tariff.extensions_included.find(ex => ex.id === extension.id) !== undefined;
    }

    isRecommended(extension: ITariffExtension): boolean {
        return this.tariff.extensions_recommended.find(ex => ex.id === extension.id) !== undefined;
    }

    setIncluded(extension: ITariffExtension, checked: boolean) {
        if (!checked) {
            this.removeExtension(extension);
            return;
        }

        this.tyrionBackendService.tariffAddExtensionIncluded(this.tariff.id, extension.id)
            .then(() => {
                this.refresh();
            })
            .catch((reason: IError) => {
                this.fmError(reason);
                this.refresh();
            });
    }

    setRecommended(extension: ITariffExtension, checked: boolean) {
        if (!checked) {
            this.removeExtension(extension);
            return;
        }

        this.tyrionBackendService.tariffAddExtensionRecommended(this.tariff.id, extension.id)
            .then(() => {
                this.refresh();
            })
            .catch((reason: IError) => {
                this.fmError(reason);
                this.refresh();
            });
    }

    removeExtension(extension: ITariffExtension) {
        this.tyrionBackendService.tariffRemoveExtension(this.tariff.id, extension.id)
            .then(() => {
                this.refresh();
            })
            .catch((reason: IError) => {
                this.fmError(reason);
                this.refresh();
            });
    }
}




