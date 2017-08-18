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
            .then((values: [IHomerServer[], ICompilationServer[]]) => {
                this.homer_servers = values[0];
                this.compilations_servers = values[1];
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
                    mqtt_username: model.mqtt_username,
                    mqtt_port: model.mqtt_port,
                    mqtt_password: model.mqtt_password,
                    grid_port: model.grid_port
                })
                    .then(() => {
                        this.refresh();
                    }).catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail', reason)));
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
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail', reason)));
                        this.refresh();
                    });
            }
        });
    }

    onHomerServerClick(server: IHomerServer): void {

    }

    onHomerServerEditClick(server: IHomerServer): void {

    }

    onCompilationServerClick(server: ICompilationServer): void {

    }

    onCompilationServerEditClick(server: ICompilationServer): void {

    }

}




