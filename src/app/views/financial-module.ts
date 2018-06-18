import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared';
import { FinancialComponent } from './financial';
import { ProductRegistrationComponent } from './financial-product-registration';
import { FinancialProductComponent } from './financial-product';
import { FinancialProductExtensionsComponent } from './financial-product-extensions';
import { FinancialProductEmployeesComponent } from './financial-product-employees';
import { FinancialProductInvoicesComponent } from './financial-product-invoices';
import { FinancialProductInvoicesInvoiceComponent } from './financial-product-invoices-invoice';
import { FinancialProductBillingComponent } from './financial-product-billing';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../services/AuthGuard';

// routes
export const FINANCIAL_ROUTES: Routes = [

        { path: '', data: { breadName: 'Financial' }, component: FinancialComponent, canActivate: [AuthGuard] },
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
        // ProductRegistrationComponent,
        FinancialProductComponent,
        FinancialProductExtensionsComponent,
        FinancialProductEmployeesComponent,
        FinancialProductInvoicesComponent,
        FinancialProductInvoicesInvoiceComponent,
        FinancialProductBillingComponent
    ],
    providers: [ ],
    exports: [ RouterModule ]
})

export class FinancialModule { }


//
// export const FINANCIAL_ROUTES: Routes = [
//
//     {
//         path: '',
//         component: FinancialComponent,
//         canActivate: [AuthGuard],
//         children: [
//             {
//                 path: ':product',
//                 data: {breadName: ':product'},
//                 component: FinancialProductComponent,
//                 children: [
//                     {
//                         path: ':extensions',
//                         data: {breadName: 'extensions'},
//                         component: FinancialProductExtensionsComponent
//                     },
//                     {
//                         path: ':employees',
//                         data: {breadName: 'employees'},
//                         component: FinancialProductEmployeesComponent
//                     },
//                     {
//                         path: ':invoices',
//                         data: {breadName: 'invoices'},
//                         component: FinancialProductInvoicesComponent,
//                         children: [
//                             {
//                                 path: ':invoice',
//                                 data: {breadName: ':invoice'},
//                                 component: FinancialProductInvoicesInvoiceComponent
//                             }
//                         ]
//                     },
//                     {
//                         path: ':billing',
//                         data: {breadName: 'billing'},
//                         component: FinancialProductBillingComponent
//                     }
//                     //
//                     // {
//                     //     path: '',
//                     //     component: FinancialComponent
//                     // }
//                 ]
//             }
//         ]
//     }
// ];
