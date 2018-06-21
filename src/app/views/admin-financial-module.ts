import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';
import { AdminFinancialComponent } from './admin-financial';
import { AdminFinancialTariffComponent } from './admin-financial-tariff';


// routes
export const ADMIN_FINANCIAL_ROUTES: Routes = [

    { path: '', component: AdminFinancialComponent, canActivate: [AuthGuard] },
    { path: ':tariff', data: { breadName: ':tariff' }, component: AdminFinancialTariffComponent, canActivate: [AuthGuard] },

];



@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(ADMIN_FINANCIAL_ROUTES)
    ],
    declarations: [

    ],
    exports: [ RouterModule ]
})

export class AdminFinancialModule { }
