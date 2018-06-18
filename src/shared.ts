import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { FormSelectComponent } from './app/components/FormSelectComponent';
import { FormInputComponent } from './app/components/FormInputComponent';
import { UnixTimeFormatPipe } from './app/pipes/UnixTimeFormatPipe';
import { StringReplacerPipe } from './app/pipes/StringReplacerPipe';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule
    ],
    providers: [],
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
        TranslateTablePipe,
        FormSelectComponent,
        FormInputComponent,
        UnixTimeFormatPipe,
        StringReplacerPipe,
    ],
    exports:      [
        AppComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LayoutMainComponent,
        TranslatePipe,
        PortletTitleComponent,
        PaymentMethodComponent,
        BeckiDrobDownButtonComponent,
        NothingToShowComponent,
        BlockUIComponent,
        ModalComponent,
        TranslateTablePipe,
        FormSelectComponent,
        FormInputComponent,
        UnixTimeFormatPipe,
        StringReplacerPipe
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SharedModule {}
