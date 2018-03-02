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
            .catch((reason) => {
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
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }


    onCreateHomerServerClick(): void {
        let model = new ModalsCreateHomerServerModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.homerServerCreate({
                    personal_server_name: model.personal_server_name,
                    web_view_port: model.web_view_port,
                    server_url: model.server_url,
                    mqtt_port: model.mqtt_port,
                    grid_port: model.grid_port,
                    rest_api_port: model.rest_api_port,
                    hardware_logger_port: model.hardware_logger_port
                })
                    .then(() => {
                        this.onFilterHomerServer();
                    }).catch(reason => {
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
                    personal_server_name: model.personal_server_name,
                    server_url: model.server_url
                })
                    .then(() => {
                        this.onFilterCompilationServer();
                    }).catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                    });
            }
        });
    }

    onHomerServerClick(serverShortDetail: IHomerServer): void {
        // TODO dodělat stránku server??
    }

    onHomerServerEditClick(server: IHomerServer): void {
        let model = new ModalsCreateHomerServerModel(
            server.personal_server_name,
            server.mqtt_port,
            server.grid_port,
            server.web_view_port,
            server.hardware_logger_port,
            server.rest_api_port,
            server.server_url,
            server.hash_certificate,
            server.connection_identificator,
            true
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.homerServerEdit(server.id, {
                    personal_server_name: model.personal_server_name,
                    web_view_port: model.web_view_port,
                    server_url: model.server_url,
                    mqtt_port: model.mqtt_port,
                    grid_port: model.grid_port,
                    rest_api_port: model.rest_api_port,
                    hardware_logger_port: model.hardware_logger_port
                })
                    .then(() => {
                        this.onFilterHomerServer();
                    }).catch(reason => {
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
        this.modalService.showModal(new ModalsRemovalModel(serverShortDetail.personal_server_name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.homerServerDelete(serverShortDetail.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_successfully_remove')));
                        this.onFilterHomerServer(); // also unblockUI
                    })
                    .catch(reason => {
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
        let model = new ModalsCreateCompilerServerModel(
            server.personal_server_name,
            server.server_url,
            server.id,
            server.hash_certificate,
            server.connection_identificator,
            true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.compilationServerEdit(server.id, {
                    personal_server_name: model.personal_server_name,
                    server_url: model.server_url
                })
                    .then(() => {
                        this.onFilterCompilationServer(); // also unblockUI
                    }).catch(reason => {
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
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
                        this.onFilterCompilationServer(); // also unblockUI
                    });
            }
        });
    }

}




