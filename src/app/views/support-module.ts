import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';
import { AuthGuard } from '../services/AuthGuard';
import { SupportComponent } from './support';
import { ProducersProducerComponent } from './producers-producer';

// routes
export const SUPPORT_ROUTES: Routes = [

    { path: '', data: { breadName: 'Producers' }, component: SupportComponent, canActivate: [AuthGuard] }, // TODO - Rozpracováno koncept [TZ]
    { path: ':ticket', data: { breadName: ':ticket' }, component: ProducersProducerComponent, canActivate: [AuthGuard] }, // TODO - Rozpracováno koncept [TZ]
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(SUPPORT_ROUTES)
    ],
    declarations: [
        SupportComponent
    ],
    exports: [ RouterModule ]
})

export class SupportModule { }
