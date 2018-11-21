/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Subscription } from 'rxjs';
import { IDatabase, IHomerServer } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsDatabaseModel } from '../modals/database-new';
import { ModalsDatabaseRemoveModel } from '../modals/database-remove';
import { ModalsRemovalModel } from '../modals/removal';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsDatabaseNameDescriptionModel } from '../modals/database-edit';


@Component({
    selector: `bk-view-projects-project-databases`,
    templateUrl: './projects-project-databases.html'
})
export class ProjectsProjectDatabasesComponent extends _BaseMainComponent implements OnInit, OnDestroy {
    projectId: string;
    productId: string;
    databases: IDatabase[];
    connectionString: String;

    currentParamsService: CurrentParamsService;
    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;


    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    refresh(): void {
        this.blockUI();
        this.tyrionBackendService.projectGet(this.projectId).then((project) => {
            this.productId = project.product.id;
            this.tyrionBackendService.databasesGet(this.productId).then((databaseList) => {
                this.databases = databaseList.databases;
                this.connectionString = databaseList.connection_string;
                this.unblockUI();
            }).catch((reason) => {
                this.unblockUI();
                this.fmError('db_loar_error', reason);
            });
        }).catch((reason) => {
            this.unblockUI();
            this.fmError('db_loar_error', reason);
        });
    }

    onPortletClick(action: string): void {
        if (action === 'database_add') {
            this.onCreateDatabaseClick();
        }
    }

    onCreateDatabaseClick(): void {
        let model = new ModalsDatabaseModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.databaseCreate({
                    name: model.name,
                    description: model.description,
                    collection_name: model.firstCollection,
                    product_id: this.productId
                }).then (() => {
                    this.unblockUI();
                    this.refresh();
                }).catch((reason) => {
                    this.unblockUI();
                    this.fmError('', reason);
                    this.refresh();
                });
            }
        });
    }

    onEditDatabaseClick(database: IDatabase): void {
        console.log('DATABASE ' + database);
        let model = new ModalsDatabaseNameDescriptionModel(database.name, database.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();

                // TODO upravit na nový api point
                this.tyrionBackendService.databaseEdit(database.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.unblockUI();
                        this.refresh();
                    })
                    .catch(reason => {
                        this.unblockUI();
                        this.refresh();
                    });
            }
        }).catch((reason) => {
            this.unblockUI();
            this.refresh();
        });
    }

    onRemoveDatabaseClick(database: IDatabase): void {
        // TODO SMAZAT let model = new ModalsDatabaseRemoveModel();

        this.modalService.showModal(new ModalsRemovalModel('[' + database.id + '] ' + (database.name ? database.name : ''))).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.databaseDelete(database.id)
                    .then(() => {
                        this.unblockUI();
                        this.refresh();
                    })
                    .catch(reason => {
                        this.unblockUI();
                        this.refresh();
                    });
            }
        });

    }



    onDrobDownEmiter(action: string, database: IDatabase): void {
        console.log('fasdasd');
        if (action === 'remove_database') {
            this.onRemoveDatabaseClick(database);
        }

        if (action === 'update_database') {
            this.onEditDatabaseClick(database);
        }
    }
}
