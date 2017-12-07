/**
 * Created by davidhradek on 05.12.16.
 */

import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import {
    ICompilationServer, ICompilerServerPublicDetail, IHomerServer, IHomerServerPublicDetail,
    ITypeOfBoard
} from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsCreateCompilerServerModel } from '../modals/compiler-server-create';
import { ModalsCreateHomerServerModel } from '../modals/homer-server-create';
import { ModalsRemovalModel } from '../modals/removal';

@Component({
    selector: 'bk-view-admin-server',
    templateUrl: './admin-server.html'
})
export class ServerComponent extends BaseMainComponent implements OnInit {

    homer_servers: IHomerServerPublicDetail[] = null;
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

        Promise.all<any>([this.backendService.homerServersGetList(), this.backendService.compilationServersGetList()])
            .then((values: [IHomerServerPublicDetail[], ICompilerServerPublicDetail[]]) => {

                this.homer_servers = values[0];
                this.homer_servers.forEach((server, index, obj) => {
                    this.backendService.onlineStatus.subscribe((status) => {
                        if (status.model === 'HomerServer' && server.id === status.model_id) {
                            server.online_state = status.online_status;
                        }
                    });
                });


                this.compilations_servers = values[1];
                this.compilations_servers.forEach((server, index, obj) => {
                    this.backendService.onlineStatus.subscribe((status) => {
                        if (status.model === 'CompilationServer' && server.id === status.model_id) {
                            server.online_state = status.online_status;
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
                this.backendService.homerServerCreate({
                    personal_server_name: model.personal_server_name,
                    web_view_port: model.web_view_port,
                    server_url: model.server_url,
                    mqtt_port: model.mqtt_port,
                    grid_port: model.grid_port,
                    server_remote_port: model.server_remote_port
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
                this.backendService.compilationServerCreate({
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

    onHomerServerClick(serverShortDetail: IHomerServerPublicDetail): void {
        // TODO dodělat stránku server??
    }

    onHomerServerEditClick(serverShortDetail: IHomerServerPublicDetail): void {
        // Get full detail object first
        Promise.all<any>([this.backendService.homerServerGet(serverShortDetail.id)])
            .then((values: [IHomerServer]) => {

                let server: IHomerServer = values[0];

                let model = new ModalsCreateHomerServerModel(
                    server.personal_server_name,
                    server.mqtt_port,
                    server.grid_port,
                    server.web_view_port,
                    server.server_remote_port,
                    server.server_url,
                    true
                );
                this.modalService.showModal(model).then((success) => {
                    if (success) {
                        this.blockUI();
                        this.backendService.homerServerEdit(server.id, {
                            personal_server_name: model.personal_server_name,
                            web_view_port: model.web_view_port,
                            server_url: model.server_url,
                            mqtt_port: model.mqtt_port,
                            grid_port: model.grid_port,
                            server_remote_port: model.server_remote_port
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

    onHomerServerDeleteClick(serverShortDetail: IHomerServerPublicDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(serverShortDetail.personal_server_name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.homerServerDelete(serverShortDetail.id)
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
        Promise.all<any>([this.backendService.compilationServerGet(serverShortDetail.id)])
            .then((values: [ICompilationServer]) => {

                let server: ICompilationServer = values[0];

                let model = new ModalsCreateCompilerServerModel(server.personal_server_name, server.server_url, true);
                this.modalService.showModal(model).then((success) => {
                    if (success) {
                        this.blockUI();
                        this.backendService.compilationServerEdit(server.id, {
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
                this.backendService.compilationServersDelete(server.id)
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




