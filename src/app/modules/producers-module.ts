import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from './shared';
import { AuthGuard } from '../services/AuthGuard';
import { ProducersProducerComponent } from '../views/producers-producer';
import { ProducersComponent } from '../views/producers';

// routes
export const PRODUCERS_ROUTES: Routes = [

    { path: '', component: ProducersComponent, canActivate: [AuthGuard] },
    { path: ':producer', data: { breadName: ':producer' }, component: ProducersProducerComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(PRODUCERS_ROUTES)
    ],
    declarations: [
        ProducersComponent
    ],
    exports: [ RouterModule ]
})

export class ProducersModule { }

