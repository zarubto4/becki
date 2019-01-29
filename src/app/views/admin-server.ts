/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Component, Injector, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { ICompilationServer, IHomerServer, IHomerServerFilter, IHomerServerList } from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsCreateCompilerServerModel } from '../modals/compiler-server-create';
import { ModalsCreateHomerServerModel } from '../modals/homer-server-create';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsUpdateHomerServerModel } from '../modals/homer-server-update';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-view-admin-server',
    templateUrl: './admin-server.html'
})
export class ServerComponent extends _BaseMainComponent implements OnInit {

    homer_servers: IHomerServerList = null;
    compilations_servers: ICompilationServer[] = null;

    tab: string = 'homer_server';

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.onFilterHomerServer();
        this.onFilterCompilationServer();
    }

    onPortletClick(action: string): void {
        if (action === 'homer_server_add') {
            this.onCreateHomerServerClick();
        }
        if (action === 'compilation_server_add') {
            this.onCreateCompilationServerClick();
        }
    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }

    onFilterHomerServer(pageNumber: number = 0): void {
        this.blockUI();
        this.tyrionBackendService.homerServersGetList(pageNumber, {
            server_types : ['PUBLIC', 'BACKUP', 'MAIN', 'TEST']
        })
            .then((value) => {
                this.homer_servers = value;
                this.homer_servers.content.forEach((server, index, obj) => {
                    this.tyrionBackendService.onlineStatus.subscribe((status) => {
                        if (status.model === 'HomerServer' && server.id === status.model_id) {
                            server.online_state = status.online_state;
                        }
                    });
                });
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }

    onFilterCompilationServer(pageNumber: number = 0): void {
        this.blockUI();
        this.tyrionBackendService.compilationServersGetList()
            .then((value) => {
                this.compilations_servers = value;
                this.compilations_servers.forEach((server, index, obj) => {
                    this.tyrionBackendService.onlineStatus.subscribe((status) => {
                        if (status.model === 'CompilationServer' && server.id === status.model_id) {
                            server.online_state = status.online_state;
                        }
                    });
                });
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }


    onCreateHomerServerClick(): void {
        let model = new ModalsCreateHomerServerModel(null);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.homerServerCreateManually({
                    name: model.server.name,
                    description: model.server.description,
                    web_view_port: model.server.web_view_port,
                    server_url: model.server.server_url,
                    mqtt_port: model.server.mqtt_port,
                    grid_port: model.server.grid_port,
                    rest_api_port: model.server.rest_api_port,
                    hardware_logger_port: model.server.hardware_logger_port
                })
                    .then(() => {
                        this.onFilterHomerServer();
                    }).catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                        this.onFilterHomerServer();
                    });
            }
        });
    }

    onCreateCompilationServerClick(): void {
        let model = new ModalsCreateCompilerServerModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.unblockUI();
                this.tyrionBackendService.compilationServerCreate({
                    personal_server_name: model.server.personal_server_name,
                    server_url: model.server.server_url
                })
                    .then(() => {
                        this.onFilterCompilationServer();
                    }).catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                    });
            }
        });
    }

    onHomerServerClick(serverShortDetail: IHomerServer): void {
        // TODO dodělat stránku server??
    }

    onHomerServerEditClick(server: IHomerServer): void {
        let model = new ModalsCreateHomerServerModel(null, server);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.homerServerEdit(server.id, {
                    name: model.server.name,
                    description: model.server.description,
                    web_view_port: model.server.web_view_port,
                    server_url: model.server.server_url,
                    mqtt_port: model.server.mqtt_port,
                    grid_port: model.server.grid_port,
                    rest_api_port: model.server.rest_api_port,
                    hardware_logger_port: model.server.hardware_logger_port
                })
                    .then(() => {
                        this.onFilterHomerServer();
                    }).catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                        this.onFilterHomerServer();
                    });
            }
        });
    }

    onHomerServerUpdateServer(server: IHomerServer): void {
        let model = new ModalsUpdateHomerServerModel(server);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
            }
        });
    }

    onHomerServerDeleteClick(serverShortDetail: IHomerServer): void {
        this.modalService.showModal(new ModalsRemovalModel(serverShortDetail.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.homerServerDelete(serverShortDetail.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_successfully_remove')));
                        this.onFilterHomerServer(); // also unblockUI
                    })
                    .catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
                        this.onFilterHomerServer(); // also unblockUI
                    });
            }
        });
    }

    onCompilationServerClick(server: ICompilationServer): void {
        // TODO dodělat stránku server??
    }

    onCompilationServerEditClick(server: ICompilationServer): void {
        let model = new ModalsCreateCompilerServerModel(server);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.compilationServerEdit(server.id, {
                    personal_server_name: model.server.personal_server_name,
                    server_url: model.server.server_url
                })
                    .then(() => {
                        this.onFilterCompilationServer(); // also unblockUI
                    }).catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                        this.onFilterCompilationServer(); // also unblockUI
                    });
            }
        });
    }

    onCompilationServerDeleteClick(server: ICompilationServer): void {
        this.modalService.showModal(new ModalsRemovalModel(server.personal_server_name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.compilationServersDelete(server.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_successfully_remove')));
                        this.onFilterCompilationServer(); // also unblockUI
                    })
                    .catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
                        this.onFilterCompilationServer(); // also unblockUI
                    });
            }
        });
    }

    onDrobDownEmiter (action: string, object: any): void {

        if (action === 'update_homer_server') {
            this.onHomerServerUpdateServer(object);
        }

        if (action === 'edit_homer_server') {
            this.onHomerServerEditClick(object);
        }
        if (action === 'remove_homer_server') {
            this.onHomerServerDeleteClick(object);
        }
        if (action === 'edit_compilations_server') {
            this.onCompilationServerEditClick(object);
        }
        if (action === 'remove_compilations_server') {
            this.onCompilationServerDeleteClick(object);
        }
    }

}




