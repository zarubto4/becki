/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Component, Injector, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import {
    ICompilationServer, IHomerServer, IHomerServerFilter, IHomerServerList, IProject,
    IServerRegistrationFormData
} from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsCreateCompilerServerModel } from '../modals/compiler-server-create';
import { ModalsCreateHomerServerModel } from '../modals/homer-server-create';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsUpdateHomerServerModel } from '../modals/homer-server-update';
import {Subscription} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'bk-view-projects-project-server',
    templateUrl: './projects-project-servers.html'
})
export class ProjectsProjectServersComponent extends _BaseMainComponent implements OnInit {

    project_id: string;
    homer_servers: IHomerServerList = null;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;


    tab: string = 'create_server';

    // Everything for serv er registration
    registration_information: IServerRegistrationFormData = null;
    selected_server_slug: string = null;
    selected_destination_slug: string = null;
    form: FormGroup;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.project_id = params['project'];
            this.projectSubscription = this.storageService.project(this.project_id).subscribe((project) => {
                this.project = project;
            });
            this.onFilterHomerServer();
            this.onHomerServerGerRegistrationComponents();
        });

        this.form = this.formBuilder.group({
            'personal_server_name': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            'selected_server_slug': ['', [Validators.required]],
            'selected_destination_slug': ['', [Validators.required]],
        });
    }

    onPortletClick(action: string): void {
        if (action === 'homer_server_add') {
            this.onCreateHomerServerClick();
        }
    }

    onServerSlugClick(slug: string): void {
        this.selected_server_slug = slug;
        (<FormControl>(this.form.controls['selected_server_slug'])).setValue(slug);
    }

    onDestinationSlugClick(slug: string): void {
        this.selected_destination_slug = slug;
        (<FormControl>(this.form.controls['selected_destination_slug'])).setValue(slug);
    }



    onFilterHomerServer(pageNumber: number = 0): void {
        this.blockUI();
        this.tyrionBackendService.homerServersGetList(pageNumber, {
            server_types : ['PRIVATE'],
            project_id: this.project_id
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
                    hardware_logger_port: model.hardware_logger_port,
                    project_id: this.project_id
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

    onHomerServerGerRegistrationComponents(): void {
        this.tyrionBackendService.homerServerGetRegistrationComponents()
            .then((components) => {
                this.registration_information = components;
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
            });
    }

    onHomerServerDeleteClick(server: IHomerServer): void {
        this.modalService.showModal(new ModalsRemovalModel(server.personal_server_name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.homerServerDelete(server.id)
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

    onCreateAutomaticalyServerClick(): void {

    }

}




