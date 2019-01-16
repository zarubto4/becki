/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Component, Injector, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IHomerServer, IHomerServerList, IProject,
    IServerRegistrationFormData, IServerRegistrationFormDataServerRegion, IServerRegistrationFormDataServerSize
} from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsCreateHomerServerModel } from '../modals/homer-server-create';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsUpdateHomerServerModel } from '../modals/homer-server-update';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { TyrionApiBackend } from '../backend/BeckiBackend';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-view-projects-project-server',
    templateUrl: './projects-project-servers.html'
})
export class ProjectsProjectServersComponent extends _BaseMainComponent implements OnInit {

    project_id: string;
    homer_servers: IHomerServerList = null;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    currentParamsService: CurrentParamsService; // exposed for template - filled by _BaseMainComponent

    project: IProject = null;


    tab: string = 'server_list';

    // Everything for serv er registration
    registration_information: IServerRegistrationFormData = null;
    selected_server_slug: IServerRegistrationFormDataServerSize = null;
    selected_destination_slug: IServerRegistrationFormDataServerRegion = null;
    form: FormGroup;
    host = 'tyrion.byzance.cz'; // Its not possible to get directly from HTML URL address form TyrionApiBackend
    protocol = 'https';         // Its not possible to get directly from HTML protocol form TyrionApiBackend

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
        });

        this.host = TyrionApiBackend.host;
        this.protocol = TyrionApiBackend.protocol;

        this.form = this.formBuilder.group({
            'name': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            'description': ['', [Validators.maxLength(65)]],
            'selected_server_slug': ['', [Validators.required]],
            'selected_destination_slug': ['', [Validators.required]],
        });
    }

    onPortletClick(action: string): void {
        if (action === 'homer_server_add') {
            this.tab = 'create_server_selector';
            if (this.registration_information == null) {
                this.onHomerServerGerRegistrationComponents();
            }
        }
    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }

    onServerSizeSlugClick(slug: IServerRegistrationFormDataServerSize): void {
        this.selected_server_slug = slug;
        (<FormControl>(this.form.controls['selected_server_slug'])).setValue(slug.slug);
    }

    onServerRegionSlugClick(slug: IServerRegistrationFormDataServerRegion): void {
        this.selected_destination_slug = slug;
        (<FormControl>(this.form.controls['selected_destination_slug'])).setValue(slug.slug);
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
            .catch((reason: IError) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }


    onCreateHomerServerManuallyClick(): void {
        let model = new ModalsCreateHomerServerModel(this.project_id);
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
                    hardware_logger_port: model.server.hardware_logger_port,
                    project_id: this.project_id
                })
                    .then(() => {
                        this.onFilterHomerServer();
                        this.tab = 'server_list';
                    }).catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                        this.onFilterHomerServer();
                        this.tab = 'server_list';
                    });
            }
        });
    }

    onCreateHomerServerAutomaticalyClick(): void {
        this.blockUI();
        this.tyrionBackendService.homerServerCreateAutomatically({
            name: this.form.controls['name'].value,
            description: this.form.controls['description'].value,
            size_slug: this.form.controls['selected_server_slug'].value,
            region_slug: this.form.controls['selected_destination_slug'].value,
            project_id: this.project_id
        }).then(() => {
            this.tab = 'server_list';
            this.unblockUI();
            this.onFilterHomerServer();
        }).catch((reason: IError) => {
            this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
            this.onFilterHomerServer();
            this.tab = 'server_list';
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
                   this.project_id,
                    server
                );
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

                this.unblockUI();
            })
            .catch((reason: IError) => {
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
            .catch((reason: IError) => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
            });
    }

    onHomerServerDeleteClick(server: IHomerServer): void {
        this.modalService.showModal(new ModalsRemovalModel(server.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.homerServerDelete(server.id)
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

    onHomerServerShutDownClick(server: IHomerServer): void {
        this.tyrionBackendService.homerServerShutdown(server.id)
            .then(() => {})
            .catch((reason: IError) => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
                this.onFilterHomerServer(); // also unblockUI
            });
    }

    onHomerServerStartClick(server: IHomerServer): void {
        this.tyrionBackendService.homerServerStart(server.id)
            .then(() => {})
            .catch((reason: IError) => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
                this.onFilterHomerServer(); // also unblockUI
            });
    }

    onHomerServerRestartClick(server: IHomerServer): void {
        this.tyrionBackendService.homerServerRestart(server.id)
            .then(() => {})
            .catch((reason: IError) => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
                this.onFilterHomerServer(); // also unblockUI
            });
    }

    onDrobDownEmiter(action: string, homer_server: IHomerServer): void {

        if (action === 'update_server') {
            this.onHomerServerUpdateServer(homer_server);
        }

        if (action === 'edit_server') {
            this.onHomerServerEditClick(homer_server);
        }
        if (action === 'shutdown_server') {
            this.onHomerServerShutDownClick(homer_server);
        }

        if (action === 'turn_on_server') {
            this.onHomerServerStartClick(homer_server);
        }

        if (action === 'restart_server') {
            this.onHomerServerRestartClick(homer_server);
        }

        if (action === 'remove_server') {
            this.onHomerServerDeleteClick(homer_server);
        }
    }

}




