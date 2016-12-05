/**
 * Created by davidhradek on 05.12.16.
 */

import {Component, Injector, OnInit, OnDestroy} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {ITypeOfBoard} from "../backend/TyrionAPI";
import {Subscription} from "rxjs";

@Component({
    selector: "view-hardware-hardware_type",
    templateUrl: "app/views/hardware-hardware_type.html"
})
export class HardwareHardwareTypeComponent extends BaseMainComponent implements OnInit, OnDestroy {

    device:ITypeOfBoard = null;

    hardwareTypeId: string;
    routeParamsSubscription: Subscription;

    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.hardwareTypeId = params["hardware_type"];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh(): void {
        this.blockUI();
        this.backendService.getTypeOfBoard(this.hardwareTypeId)
            .then((typeOfBoard) => {
                this.device = typeOfBoard;
                console.log(typeOfBoard);
                this.unblockUI();
            })
            .catch((reason) => {
                this.fmError("Projects cannot be loaded.", reason);
                this.unblockUI();
            });
    }

}




