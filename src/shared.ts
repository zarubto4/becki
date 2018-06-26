import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { OnlineStateComponent } from './app/components/OnlineStateComponent';
import { FormInputTagsComponent } from './app/components/FormInputTagsComponent';
import { FilterPagerComponent } from './app/components/FilterPagerComponent';
import { FirmwareTypeComponent } from './app/components/FirmwareTypeComponent';
import { TypeOfUpdateComponent } from './app/components/TypeOfUpdateComponent';
import { UpdateStateComponent } from './app/components/UpdateStateComponent';
import { TerminalLogSubscriberComponent } from './app/components/TerminalLogSubscriberComponent';
import { CodeIDEComponent } from './app/components/CodeIDEComponent';
import { CompilationStatusComponent } from './app/components/CompilationStatusComponent';
import { BlockoViewComponent } from './app/components/BlockoViewComponent';
import { ConsoleLogComponent } from './app/components/ConsoleLogComponent';
import { MonacoEditorComponent } from './app/components/MonacoEditorComponent';
import { FormColorPickerComponent } from './app/components/FormColorPickerComponent';
import { FormFAIconSelectComponent } from './app/components/FormFAIconSelectComponent';
import { ServerRegionSelectorComponent, ServerSizeSelectorComponent } from './app/components/ServerSizeSelectorComponent';
import { GridViewComponent } from './app/components/GridViewComponent';
import { DraggableDirective } from './app/components/DraggableDirective';
import { ChartBarComponent } from './app/components/ChartBarComponent';
import { ChartsModule } from 'ng2-charts';
import { ProjectsProjectCodeCodeComponent } from './app/views/projects-project-code-code';
import { ProjectsProjectBlocksBlockComponent } from './app/views/projects-project-blocks-block';
import { ProjectsProjectBlocksComponent } from './app/views/projects-project-blocks';
import { ProjectsProjectWidgetsWidgetComponent } from './app/views/projects-project-widgets-widget';
import { ProjectsProjectWidgetsComponent } from './app/views/projects-project-widgets';
import { ProjectsProjectHardwareHardwareComponent } from './app/views/projects-project-hardware-hardware';
import {TimePickerComponent} from "./app/components/TimePickerComponent";
import {DatePickerComponent} from "./app/components/datePickerComponent";
import {Nl2BrPipe} from "./app/pipes/Nl2BrPipe";
import {FormJsonNiceTextAreaComponent} from "./app/components/FormJsonNiceTextAreaComponent";
import { ProducersProducerComponent } from './app/views/producers-producer';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        ChartsModule
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
        OnlineStateComponent,
        FormInputTagsComponent,
        FilterPagerComponent,
        FirmwareTypeComponent,
        TypeOfUpdateComponent,
        UpdateStateComponent,
        TerminalLogSubscriberComponent,
        CodeIDEComponent,
        CompilationStatusComponent,
        BlockoViewComponent,
        ConsoleLogComponent,
        MonacoEditorComponent,
        FormColorPickerComponent,
        FormFAIconSelectComponent,
        ServerSizeSelectorComponent,
        ServerRegionSelectorComponent,
        GridViewComponent,
        DraggableDirective,
        ChartBarComponent,
        ProjectsProjectCodeCodeComponent,
        ProjectsProjectHardwareHardwareComponent,
        ProjectsProjectWidgetsComponent,
        ProjectsProjectWidgetsWidgetComponent,
        ProjectsProjectBlocksComponent,
        ProjectsProjectBlocksBlockComponent,
        DatePickerComponent,
        TimePickerComponent,
        Nl2BrPipe,
        FormJsonNiceTextAreaComponent,
        ProducersProducerComponent

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
        StringReplacerPipe,
        OnlineStateComponent,
        FormInputTagsComponent,
        FilterPagerComponent,
        FirmwareTypeComponent,
        TypeOfUpdateComponent,
        UpdateStateComponent,
        TerminalLogSubscriberComponent,
        CodeIDEComponent,
        CompilationStatusComponent,
        BlockoViewComponent,
        ConsoleLogComponent,
        MonacoEditorComponent,
        FormColorPickerComponent,
        FormFAIconSelectComponent,
        ServerSizeSelectorComponent,
        ServerRegionSelectorComponent,
        GridViewComponent,
        DraggableDirective,
        ChartBarComponent,
        ProjectsProjectCodeCodeComponent,
        ProjectsProjectHardwareHardwareComponent,
        ProjectsProjectWidgetsComponent,
        ProjectsProjectWidgetsWidgetComponent,
        ProjectsProjectBlocksComponent,
        ProjectsProjectBlocksBlockComponent,
        DatePickerComponent,
        TimePickerComponent,
        Nl2BrPipe,
        FormJsonNiceTextAreaComponent,
        ProducersProducerComponent


    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SharedModule {}

