import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';
import { FinancialComponent } from './financial';
import { ProductRegistrationComponent } from './financial-product-registration';
import { FinancialProductComponent } from './financial-product';
import { FinancialProductExtensionsComponent } from './financial-product-extensions';
import { FinancialProductEmployeesComponent } from './financial-product-employees';
import { FinancialProductInvoicesComponent } from './financial-product-invoices';
import { FinancialProductInvoicesInvoiceComponent } from './financial-product-invoices-invoice';
import { FinancialProductBillingComponent } from './financial-product-billing';

// routes
export const FINANCIAL_ROUTES: Routes = [

        { path: '', data: { breadName: 'Financial' }, component: FinancialComponent, canActivate: [AuthGuard] },

        { path: 'product-registration', data: { breadName: 'Product subscription' }, component: ProductRegistrationComponent, canActivate: [AuthGuard] },

        { path: ':product', data: { breadName: ':product' }, component: FinancialProductComponent, canActivate: [AuthGuard] },
        { path: ':product/extensions', data: { breadName: 'extensions' }, component: FinancialProductExtensionsComponent, canActivate: [AuthGuard] },
        { path: ':product/employees', data: { breadName: 'employees' }, component: FinancialProductEmployeesComponent, canActivate: [AuthGuard] },
        { path: ':product/invoices', data: { breadName: 'invoices' }, component: FinancialProductInvoicesComponent, canActivate: [AuthGuard] },
        { path: ':product/invoices/:invoice', data: { breadName: ':invoice' }, component: FinancialProductInvoicesInvoiceComponent, canActivate: [AuthGuard] },
        { path: ':product/billing', data: { breadName: 'billing' }, component: FinancialProductBillingComponent, canActivate: [AuthGuard] }
];



@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(FINANCIAL_ROUTES)
    ],
    declarations: [
        FinancialComponent,
        ProductRegistrationComponent,
        FinancialProductComponent,
        FinancialProductExtensionsComponent,
        FinancialProductEmployeesComponent,
        FinancialProductInvoicesComponent,
        FinancialProductInvoicesInvoiceComponent,
        FinancialProductBillingComponent
    ],
    exports: [ RouterModule ]
})

export class FinancialModule { }
