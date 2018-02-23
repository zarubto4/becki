

import { Component, Injector, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IApplicableProduct, IProductExtensionType, ITariff } from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsTariffModel } from '../modals/tariff';
import { ModalsExtensionModel } from '../modals/extension';

@Component({
    selector: 'bk-view-admin-financial',
    templateUrl: './admin-financial.html'
})
export class AdminFinancialComponent extends _BaseMainComponent implements OnInit {

    tariffs: ITariff[] = null;
    extensions: ITariff[] = null;
    extensionTypes: IProductExtensionType[] = null;

    tab: string = 'tariffs';

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
    }

    onPortletClick(action: string): void {
        if (action === 'add_tariff') {
            this.onTariffAddClick();
        }

        if (action === 'add_extension') {
            this.onExtensionCreate();
        }
    }

    refresh(): void {
        this.blockUI();

        Promise.all<any>([this.tyrionBackendService.tariffsGetAll(), this.tyrionBackendService])
            .then((values: [ITariff[]]) => {
                this.tariffs = values[0];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('Tariffs cannot be loaded.', reason));
                this.unblockUI();
            });

    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }

    onTariffRemoveClick(tariff: ITariff): void {
        this.modalService.showModal(new ModalsRemovalModel(tariff.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.tariffDelete(tariff.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_tariff_delete_success')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_tariff_delete_error'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onTariffAddClick(): void {
        let model = new ModalsTariffModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.tariffCreate({
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
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_tariff_create_success', model.name)));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_tariff_create_error', model.name, reason)));
                        this.refresh();
                    });
            }
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
                this.tyrionBackendService.tariffEdit(tariff.id, {
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

    onTariffShiftUpClick(tariff: ITariff): void {
        this.tyrionBackendService.tariffOrderUp(tariff.id)
            .then(() => {
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                this.refresh();
            });
    }

    onTariffShiftDownClick(tariff: ITariff): void {
        this.tyrionBackendService.tariffOrderDown(tariff.id)
            .then(() => {
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                this.refresh();
            });
    }

    onTariffActivate(tariff: ITariff): void {
        this.tyrionBackendService.tariffActivate(tariff.id)
            .then(() => {
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                this.refresh();
            });
    }

    onTariffDeactivate(tariff: ITariff): void {
        this.tyrionBackendService.tariffDeactivate(tariff.id)
            .then(() => {
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                this.refresh();
            });
    }

    onTariffClick(tariff: ITariff): void {
        this.router.navigate(['/admin/financial', tariff.id]);
    }

    onExtensionCreate(): void {
        let model = new ModalsExtensionModel(this.extensionTypes);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.tariffExtensionCreate('TODO', {
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


}




