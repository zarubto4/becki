import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutMainComponent } from './app/layouts/main';
import { TranslatePipe } from './app/pipes/TranslationPipe';
import { PortletTitleComponent } from './app/components/PortletTitleComponent';
import { PaymentMethodComponent } from './app/components/PaymentMehtodComponent';
import { BeckiDrobDownButtonComponent } from './app/components/DrobDownButton';
import { NothingToShowComponent } from './app/components/NothingToShowComponent';
import { AppComponent } from './app/app';
import { BlockUIComponent } from './app/components/BlockUIComponent';
import { ModalComponent } from './app/modals/modal';
import { RouterModule } from '@angular/router';
import { TranslateTablePipe } from './app/pipes/TranslationTablePipe';


@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [
        AppComponent,
        LayoutMainComponent,
        TranslatePipe,
        PortletTitleComponent,
        PaymentMethodComponent,
        BeckiDrobDownButtonComponent,
        NothingToShowComponent,
        BlockUIComponent,
        ModalComponent,
        TranslateTablePipe
    ],
    exports:      [
        AppComponent,
        CommonModule,
        FormsModule ,
        LayoutMainComponent,
        TranslatePipe,
        PortletTitleComponent,
        PaymentMethodComponent,
        BeckiDrobDownButtonComponent,
        NothingToShowComponent,
        BlockUIComponent,
        ModalComponent,
        TranslateTablePipe
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SharedModule { }
