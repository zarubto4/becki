/**
 * Created by Tomas Kupcek on 25.01.2017.
 */

import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Subscription } from 'rxjs';
import { IProducer, IHardwareType } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import {IError} from "../services/_backend_class/Responses";

@Component({
    selector: 'bk-view-producers',
    templateUrl: './producers-producer.html'
})
export class ProducersProducerComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    routeParamsSubscription: Subscription;

    producerId: string;
    producer: IProducer = null;

    devices: IHardwareType[] = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by _BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.producerId = params['producer'];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh(): void {
        this.blockUI();
        this.tyrionBackendService.producerGet(this.producerId)
            .then((producer) => {
                this.producer = producer;
                return this.tyrionBackendService.hardwareTypesGetAll();
            })
            .then((devices) => {
                for (let i in devices) {
                    if (devices[i].producer.id !== this.producerId) {
                        devices.splice(parseInt(i, 10));
                    }
                }
                this.devices = devices;
            })
            .catch((reason: IError) => {
                this.fmError(reason);
                this.unblockUI();
            });
        this.unblockUI();
    }

}
