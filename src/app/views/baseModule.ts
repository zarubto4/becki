import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// containers
import { FinancialComponent } from './financial';

import { SharedModule } from '../../shared';


// routes
export const ROUTES: Routes = [

    { path: '', component: FinancialComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES),
        SharedModule
    ],
    declarations: [ FinancialComponent ],
    providers: []
})

export class FinancialModule { }
