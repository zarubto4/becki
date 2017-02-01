/**
 * Created by Tomas Kupcek on 25.01.2017.
 */

import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { Subscription } from 'rxjs';
import { IProducer } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';

@Component({
    selector: 'bk-view-producers',
    templateUrl: './producers.html'
})
export class ProducersComponent extends BaseMainComponent implements OnInit, OnDestroy {

    routeParamsSubscription: Subscription;

    producers: IProducer[] = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh(): void {
        this.blockUI();
        this.backendService.getAllProducers()
            .then((producers) => {
                this.producers = producers;
            })
            .catch((reason) => {
                this.fmError('Project cannot be loaded.', reason);
                this.unblockUI();
            });
        this.unblockUI();
    }

    onEditClick(producer: IProducer): void {

    }

    onDeleteClick(producer: IProducer): void {

    }

    onProducerClick(producer: IProducer): void {
        this.navigate(['/producers', producer.id]);
    }
}
