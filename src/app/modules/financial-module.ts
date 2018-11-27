import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from './shared';

import { AuthGuard } from '../services/AuthGuard';
import { FinancialComponent } from '../views/financial';
import { ProductRegistrationComponent } from '../views/financial-product-registration';
import { FinancialProductComponent } from '../views/financial-product';
import { FinancialProductExtensionsComponent } from '../views/financial-product-extensions';
import { FinancialProductEmployeesComponent } from '../views/financial-product-employees';
import { FinancialProductInvoicesComponent } from '../views/financial-product-invoices';
import { FinancialProductInvoicesInvoiceComponent } from '../views/financial-product-invoices-invoice';
import { FinancialProductBillingComponent } from '../views/financial-product-billing';
import { PricePipe } from '../pipes/PricePipe';
import { ContactTableComponent } from '../components/ContactTableComponent';
import { PaymentDetailsTableComponent } from '../components/PaymentDetailsTableComponent';

// routes
export const FINANCIAL_ROUTES: Routes = [

    { path: '', component: FinancialComponent, canActivate: [AuthGuard] },

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
        PricePipe,
        FinancialComponent,
        ContactTableComponent,
        PaymentDetailsTableComponent,
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

