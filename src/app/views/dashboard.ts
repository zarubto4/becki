/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IApplicableProduct, IArticle, IArticleList, IProduct, IProject, ITariff } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsArticleModel } from '../modals/article';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsProjectPropertiesModel } from '../modals/project-properties';

@Component({
    selector: 'bk-view-dashboard',
    templateUrl: './dashboard.html'
})
export class DashboardComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    tab: string = 'general';
    projects: IProject[] = null;
    products: IApplicableProduct[] = null;
    articles: {
        general?: IArticleList,
        hardware?: IArticleList,
        blocko?: IArticleList,
        code?: IArticleList,
        grid?: IArticleList,
        cloud?: IArticleList,
    } = {};
    create_article_permission: boolean = false;

    projectsUpdateSubscription: Subscription;

    constructor(injector: Injector) {
        super(injector);
    };

    onQrClick() {
        this.router.navigate(['/qr-reader-hardware']);
    }


    ngOnInit(): void {

        // Allow to create new Article
        if (this.tyrionBackendService.personPermissions.indexOf('Article_create') >= 0) {
            this.create_article_permission = true;
        }

        this.tyrionBackendService.objectUpdateTyrionEcho.subscribe(status => {
            if (status.model === 'ProjectsRefreshAfterInvite') {
                this.projectRefresh();
            }
        });

        this.projectRefresh();
        this.onFilterArticle();
    }

    ngOnDestroy(): void {
        if (this.projectsUpdateSubscription) {
            this.projectsUpdateSubscription.unsubscribe();
        }
    }

    onPortletClick(action: string, object?: any ): void {
        if (action === 'add_article') {
            this.onCreateArticle();
        }

        if (action === 'article_edit') {
            this.onEditArticle(object);
        }

        if (action === 'article_remove') {
            this.onRemoveArticle(object);
        }
    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }

    projectRefresh(): void {
        this.tyrionBackendService.projectGetByLoggedPerson()
            .then((projects: IProject[]) => {
                this.projects = projects;

                if (projects.length === 0) {
                    this.tariffRefresh();
                }
            });
    }

    // Only for first project!
    onAddProjectClick(): void {

        if (!this.products) {
            this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_add_project')));
        }

        let model = new ModalsProjectPropertiesModel(this.products);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.projectCreate({
                    name: model.name,
                    description: model.description,
                    product_id: model.product
                }) // TODO: add tarrif nebo produkt či jak se to bude jmenovat
                    .then((project: IProject) => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_project_create', model.name)));
                        this.onProjectClick(project.id);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_create_project', model.name, reason.message)));
                    });
            }
        });
    }

    tariffRefresh(): void {
        this.tyrionBackendService.productsGetUserCanUsed()
            .then((products: IApplicableProduct[]) => {
                this.products = products;
            });
    }

    onFilterArticle(): void {
        this.blockUI();
        Promise.all<any>([
            this.tyrionBackendService.articleGetListByFilter(0, {
                count_on_page: 5,
                tags: ['general']
            }),
            this.tyrionBackendService.articleGetListByFilter(0, {
                count_on_page: 5,
                tags: ['hardware']
            }),
            this.tyrionBackendService.articleGetListByFilter(0, {
                count_on_page: 5,
                tags: ['blocko']
            }),
            this.tyrionBackendService.articleGetListByFilter(0, {
                count_on_page: 5,
                tags: ['code']
            }),
            this.tyrionBackendService.articleGetListByFilter(0, {
                count_on_page: 5,
                tags: ['grid']
            }),
            this.tyrionBackendService.articleGetListByFilter(0, {
                count_on_page: 5,
                tags: ['cloud']
            })
        ])
            .then((values: [IArticleList, IArticleList, IArticleList, IArticleList, IArticleList, IArticleList]) => {
                this.articles.general = values[0];
                this.articles.hardware = values[1];
                this.articles.blocko = values[2];
                this.articles.code = values[3];
                this.articles.grid = values[4];
                this.articles.cloud = values[5];
                this.unblockUI();
            }).catch((err) => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_article_create_error', err)));
                this.unblockUI();
            });
    }

    onEditArticle(article: IArticle): void {
        let model = new ModalsArticleModel(true, article.name, article.description, article.mark_down_text, article.tags[0]);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.articleCreate({
                    name: model.name,
                    description: model.description,
                    mark_down_text: model.mark_down_text,
                    tags: [model.tag]
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_article_create_success')));
                        this.unblockUI();
                        this.onFilterArticle();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_article_create_error', reason)));
                        this.unblockUI();
                    });
            }
        });
    }

    onRemoveArticle(article: IArticle): void {
        this.modalService.showModal(new ModalsRemovalModel(article.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.articleDelete(article.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_article_remove')));
                        this.unblockUI();
                        this.onFilterArticle();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_article'), reason));
                        this.onFilterArticle();
                    });
            }
        });
    }

    onCreateArticle(): void {
        let model = new ModalsArticleModel(false);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.articleCreate({
                    name: model.name,
                    description: model.description,
                    mark_down_text: model.mark_down_text,
                    tags: [model.tag]
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_article_create_success')));
                        this.unblockUI();
                        this.onFilterArticle();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_article_create_error', reason)));
                        this.unblockUI();
                    });
            }
        });
    }



}




