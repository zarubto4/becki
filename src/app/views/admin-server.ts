/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import {
    ICompilationServer, ICompilerServerPublicDetail, IHomerServer,
    IHardwareType
} from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsCreateCompilerServerModel } from '../modals/compiler-server-create';
import { ModalsCreateHomerServerModel } from '../modals/homer-server-create';
import { ModalsRemovalModel } from '../modals/removal';
import { IVersionOverview } from '../backend/HomerAPI';
import { ModalsUpdateHomerServerModel } from '../modals/homer-server-update';

@Component({
    selector: 'bk-view-admin-server',
    templateUrl: './admin-server.html'
})
export class ServerComponent extends BaseMainComponent implements OnInit {

    homer_servers: IHomerServer[] = null;
    compilations_servers: ICompilerServerPublicDetail[] = null;

    tab: string = 'homer_server';

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.blockUI();

        Promise.all<any>([this.tyrionBackendService.homerServersGetList(), this.tyrionBackendService.compilationServersGetList()])
            .then((values: [IHomerServer[], ICompilerServerPublicDetail[]]) => {

                this.homer_servers = values[0];
                this.homer_servers.forEach((server, index, obj) => {
                    this.tyrionBackendService.onlineStatus.subscribe((status) => {
                        if (status.model === 'HomerServer' && server.id === status.model_id) {
                            server.online_state = status.online_state;
                        }
                    });
                });


                this.compilations_servers = values[1];
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
                this.addFlashMessage(new FlashMessageError('Projects cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onToggleTab(tab: string) {
        this.tab = tab;
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
                    hardware_logger_port: model.hardware_logger_port
                })
                    .then(() => {
                        this.refresh();
                    }).catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onCreateCompilationServerClick(): void {
        let model = new ModalsCreateCompilerServerModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.compilationServerCreate({
                    personal_server_name: model.personal_server_name,
                    server_url: model.server_url
                })
                    .then(() => {
                        this.refresh();
                    }).catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onHomerServerClick(serverShortDetail: IHomerServer): void {
        // TODO dodělat stránku server??
    }

    onHomerServerEditClick(serverShortDetail: IHomerServer): void {
        // Get full detail object first
        Promise.all<any>([this.tyrionBackendService.homerServerGet(serverShortDetail.id)])
            .then((values: [IHomerServer]) => {

                let server: IHomerServer = values[0];

                let model = new ModalsCreateHomerServerModel(
                    server.personal_server_name,
                    server.mqtt_port,
                    server.grid_port,
                    server.web_view_port,
                    server.hardware_logger_port,
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
                            hardware_logger_port: model.hardware_logger_port
                        })
                            .then(() => {
                                this.refresh();
                            }).catch(reason => {
                                this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                                this.refresh();
                            });
                    }
                });

                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('Projects cannot be loaded.', reason));
                this.unblockUI();
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
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onCompilationServerClick(serverShortDetail: ICompilerServerPublicDetail): void {
        // TODO dodělat stránku server??
    }

    onCompilationServerEditClick(serverShortDetail: ICompilerServerPublicDetail): void {
        // Get full detail object first
        Promise.all<any>([this.tyrionBackendService.compilationServerGet(serverShortDetail.id)])
            .then((values: [ICompilationServer]) => {

                let server: ICompilationServer = values[0];

                let model = new ModalsCreateCompilerServerModel(server.personal_server_name, server.server_url, true);
                this.modalService.showModal(model).then((success) => {
                    if (success) {
                        this.blockUI();
                        this.tyrionBackendService.compilationServerEdit(server.id, {
                            personal_server_name: model.personal_server_name,
                            server_url: model.server_url
                        })
                            .then(() => {
                                this.refresh();
                            }).catch(reason => {
                                this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                                this.refresh();
                            });
                    }
                });

                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('Projects cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onCompilationServerDeleteClick(server: ICompilerServerPublicDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(server.personal_server_name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.compilationServersDelete(server.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_successfully_remove')));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

}




