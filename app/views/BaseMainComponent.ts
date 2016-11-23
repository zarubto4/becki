/**
 * Created by davidhradek on 08.08.16.
 */


import {Router, ActivatedRoute} from "@angular/router";
import {BackendService} from "../services/BackendService";
import {ModalService} from "../services/ModalService";
import {Injector} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {CurrentParamsService} from "../services/CurrentParamsService";
import {BlockUIService} from "../services/BlockUIService";
import {NotificationService, FlashMessage} from "../services/NotificationService";

export abstract class BaseMainComponent {

    protected backendService: BackendService = null;
    protected router: Router = null;
    protected activatedRoute: ActivatedRoute = null;
    protected modalService: ModalService = null;
    protected notificationService: NotificationService = null;
    protected formBuilder: FormBuilder = null;
    protected currentParamsService: CurrentParamsService = null;
    protected blockUIService: BlockUIService = null;

    constructor(injector: Injector) {
        console.log("BaseMainComponent init");
        if (injector) {
            this.backendService = injector.get(BackendService);
            this.router = injector.get(Router);
            this.activatedRoute = injector.get(ActivatedRoute);
            this.modalService = injector.get(ModalService);
            this.notificationService = injector.get(NotificationService);
            this.formBuilder = injector.get(FormBuilder);
            this.currentParamsService = injector.get(CurrentParamsService);
            this.blockUIService = injector.get(BlockUIService);
        } else {
            throw "Injector is not defined! ... Don't you forget to add \"constructor(injector:Injector) {super(injector)};\" in inherited class?"
        }
    }

    protected addFlashMessage(fm: FlashMessage): void {
        this.notificationService.addFlashMessage(fm);
    }

    protected navigate(link: any[]): void {
        this.router.navigate(link);
    }

    protected blockUI(): void {
        this.blockUIService.blockUI();
    }

    protected unblockUI(): void {
        this.blockUIService.unblockUI();
    }

}
