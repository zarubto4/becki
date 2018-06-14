import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// containers

import { SharedModule } from '../../shared';
import { FinancialComponent } from './financial';
import { ProductRegistrationComponent } from './financial-product-registration';
import { FinancialProductComponent } from './financial-product';
import { FinancialProductExtensionsComponent } from './financial-product-extensions';
import { FinancialProductEmployeesComponent } from './financial-product-employees';
import { FinancialProductInvoicesComponent } from './financial-product-invoices';
import { FinancialProductInvoicesInvoiceComponent } from './financial-product-invoices-invoice';
import { FinancialProductBillingComponent } from './financial-product-billing';


// routes
export const ROUTES: Routes = [

    {
        path: '',
        component: FinancialComponent,
        children: [

            { path: '', redirectTo: '/financial', pathMatch: 'full' },
            { path: '', component: ProductRegistrationComponent },
            { path: '', component: FinancialProductComponent, },
            { path: '', component: FinancialProductExtensionsComponent },
            { path: '', component: FinancialProductEmployeesComponent },
            { path: '', component: FinancialProductInvoicesComponent },
            { path: '', component: FinancialProductInvoicesInvoiceComponent },
            { path: '', component: FinancialProductBillingComponent}
        ]
    }

];

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES),
        SharedModule
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
    providers: [],
    exports: [ RouterModule ]
})

export class FinancialModule { }
