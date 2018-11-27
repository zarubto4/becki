

import { Component, Injector, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IProductExtensionType, ITariff, ITariffExtension } from '../backend/TyrionAPI';
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
    extensions: ITariffExtension[] = null;
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

        Promise.all<any>([this.tyrionBackendService.tariffsGetAll(),
            this.tyrionBackendService.tariffGetExtensionsAll(),
            this.tyrionBackendService.tariffGetAllTypes(),
            this.tyrionBackendService])
            .then((values: [ITariff[], ITariffExtension[], IProductExtensionType[]]) => {
                this.tariffs = values[0];
                this.extensions = values[1];
                this.extensionTypes = values[2];
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
                    owner_details_required: model.owner_details_required,
                    credit_for_beginning: model.credit_for_beginning,
                    description: model.description,
                    identifier: model.identifier,
                    name: model.name,
                    payment_details_required: model.payment_details_required,
                    labels: JSON.parse(model.labelsInString)
                })
                    .then(tarif => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_tariff_create_success', model.name)));
                        this.onTariffClick(tarif);
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
                this.tyrionBackendService.tariffExtensionCreate({
                    name: model.name,
                    description: model.description,
                    color: model.color,
                    extension_type: model.extension_type,
                    config: model.config.toString(),
                    consumption: model.consumption.toString()
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_extension_create_success', model.name)));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_create_error', model.name, reason)));
                        this.refresh();
                    });
            }
        });
    }

    onExtensionEditClick(extension: ITariffExtension) {
        let model = new ModalsExtensionModel(
            this.extensionTypes,
            true,
            extension.color,
            extension.name,
            extension.description,
            extension.type,
            extension.config,
            extension.consumption
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.tariffExtensionEdit(extension.id, {
                    name: model.name,
                    description: model.description,
                    color: model.color,
                    config: model.config.toString(),
                    consumption: model.consumption.toString()
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_extension_edit_success', model.name)));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_edit_error', model.name, reason)));
                        this.refresh();
                    });
            }
        });
    }

    onExtensionRemoveClick(extension: ITariffExtension) {
        this.modalService.showModal(new ModalsRemovalModel(extension.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.tariffExtensionDelete(extension.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_extension_delete_success')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_delete_error'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onExtensionShiftUpClick(extension: ITariffExtension): void {
        this.tyrionBackendService.tariffExtensionOrderUp(extension.id)
            .then(() => {
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                this.refresh();
            });
    }

    onExtensionShiftDownClick(extension: ITariffExtension): void {
        this.tyrionBackendService.tariffExtensionOrderDown(extension.id)
            .then(() => {
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                this.refresh();
            });
    }

    onExtensionActivateClick(extension: ITariffExtension): void {
        this.tyrionBackendService.tariffExtensionActivate(extension.id)
            .then(() => {
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                this.refresh();
            });
    }

    onExtensionDeactivateClick(extension: ITariffExtension): void {
        this.tyrionBackendService.tariffExtensionDeactivate(extension.id)
            .then(() => {
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                this.refresh();
            });
    }

    // TODO to pipe?
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

    onDrobDownTariffEmiter (action: string, tariff: ITariff): void {

        if (action === 'edit_tariff') {
            this.onTariffEditClick(tariff);
        }

        if (action === 'shift_up_tariff') {
            this.onTariffShiftUpClick(tariff);
        }

        if (action === 'shift_down_tariff') {
            this.onTariffShiftDownClick(tariff);
        }

        if (action === 'active_tariff') {
            this.onTariffActivate(tariff);
        }

        if (action === 'deactive_tariff') {
            this.onTariffDeactivate(tariff);
        }
        if (action === 'remove_tariff') {
            this.onTariffRemoveClick(tariff);
        }
    }

    onDrobDownExtensionEmiter (action: string, extension: ITariffExtension): void {

        if (action === 'edit_extension') {
            this.onExtensionEditClick(extension);
        }

        if (action === 'shift_up_extension') {
            this.onExtensionShiftUpClick(extension);
        }

        if (action === 'shift_down_extension') {
            this.onExtensionShiftDownClick(extension);
        }

        if (action === 'active_extension') {
            this.onExtensionActivateClick(extension);
        }

        if (action === 'deactive_extension') {
            this.onExtensionDeactivateClick(extension);
        }
        if (action === 'remove_extension') {
            this.onExtensionRemoveClick(extension);
        }
    }
}




