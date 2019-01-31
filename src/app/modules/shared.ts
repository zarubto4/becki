import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutMainComponent } from '../layouts/main';
import { TranslatePipe } from '../pipes/TranslationPipe';
import { PortletTitleComponent } from '../components/PortletTitleComponent';
import { PaymentMethodComponent } from '../components/PaymentMehtodComponent';
import { BeckiDrobDownButtonComponent } from '../components/DrobDownButton';
import { NothingToShowComponent } from '../components/NothingToShowComponent';
import { AppComponent } from '../app';
import { BlockUIComponent } from '../components/BlockUIComponent';
import { ModalComponent } from '../modals/modal';
import { RouterModule } from '@angular/router';
import { TranslateTablePipe } from '../pipes/TranslationTablePipe';
import { FormSelectComponent } from '../components/FormSelectComponent';
import { FormInputComponent } from '../components/FormInputComponent';
import { UnixTimeFormatPipe } from '../pipes/UnixTimeFormatPipe';
import { StringReplacerPipe } from '../pipes/StringReplacerPipe';
import { LogLevelComponent, OnlineStateComponent, PublicStateComponent } from '../components/OnlineStateComponent';
import { FormInputTagsComponent } from '../components/FormInputTagsComponent';
import { FilterPagerComponent } from '../components/FilterPagerComponent';
import { FirmwareTypeComponent } from '../components/FirmwareTypeComponent';
import { TypeOfUpdateComponent } from '../components/TypeOfUpdateComponent';
import { UpdateStateComponent } from '../components/UpdateStateComponent';
import { TerminalLogSubscriberComponent } from '../components/TerminalLogSubscriberComponent';
import { CodeIDEComponent } from '../components/CodeIDEComponent';
import { CompilationStatusComponent } from '../components/CompilationStatusComponent';
import { ConsoleLogComponent } from '../components/ConsoleLogComponent';
import { MonacoEditorComponent } from '../components/MonacoEditorComponent';
import { FormColorPickerComponent } from '../components/FormColorPickerComponent';
import { FormFAIconSelectComponent } from '../components/FormFAIconSelectComponent';
import { ServerRegionSelectorComponent, ServerSizeSelectorComponent } from '../components/ServerSizeSelectorComponent';
import { GridViewComponent } from '../components/GridViewComponent';
import { DraggableDirective } from '../components/DraggableDirective';
import { ChartBarComponent } from '../components/ChartBarComponent';
import { ChartsModule } from 'ng2-charts';
import { ProjectsProjectCodeCodeComponent } from '../views/projects-project-code-code';
import { TimePickerComponent } from '../components/TimePickerComponent';
import { DatePickerComponent } from '../components/DatePickerComponent';
import { Nl2BrPipe } from '../pipes/Nl2BrPipe';
import { FormJsonNiceTextAreaComponent } from '../components/FormJsonNiceTextAreaComponent';
import { ProducersProducerComponent } from '../views/producers-producer';
import { ModalsLogLevelComponent } from '../modals/hardware-terminal-logLevel';
import { ModalsAdminCreateHardwareComponent } from '../modals/admin-create-hardware';
import { ModalsContactComponent } from '../modals/contact';
import { ModalsProjectPropertiesComponent } from '../modals/project-properties';
import { ModalsCreateHomerServerComponent } from '../modals/homer-server-create';
import { ModalsUpdateHomerServerComponent } from '../modals/homer-server-update';
import { ModalsTariffComponent } from '../modals/tariff';
import { ModalsPublicShareResponseComponent } from '../modals/public-share-response';
import { ModalsCreateProcessorComponent } from '../modals/create-processor';
import { ModalsGridProgramSettingsComponent } from '../modals/instance-grid-program-settings';
import { ModalsBootloaderPropertyComponent } from '../modals/bootloader-property';
import { ModalsCreateCompilationServerComponent } from '../modals/compiler-server-create';
import { ModalsRemovalComponent } from '../modals/removal';
import { ModalsCreateProducerComponent } from '../modals/create-producer';
import { ModalsDeactivateComponent } from '../modals/deactivate';
import { ModalsCreateHardwareTypeComponent } from '../modals/type-of-board-create';
import { ModalsCreateHardwareTypeBatchComponent } from '../modals/type-of-board-batch-create';
import { ModalsAddHardwareComponent } from '../modals/add-hardware';
import { ModalsSelectHardwareComponent } from '../modals/select-hardware';
import { ModalsFileUploadComponent } from '../modals/file-upload';
import { ModalsBlockoPropertiesComponent } from '../modals/blocko-properties';
import { ModalsCodePropertiesComponent } from '../modals/code-properties';
import { ModalsPictureUploadComponent } from '../modals/picture-upload';
import { ModalsPublicShareRequestComponent } from '../modals/public-share-request';
import { ModalsCodeFileDialogComponent } from '../modals/code-file-dialog';
import { ModalsSetAsMainComponent } from '../modals/set-as-main';
import { ModalsShowQRComponent } from '../modals/show_QR';
import { ModalsConfirmComponent } from '../modals/confirm';
import { ModalsGarfieldComponent } from '../modals/garfield';
import { ModalsVersionDialogComponent } from '../modals/version-dialog';
import { ModalsBlockoBlockCodeEditorComponent } from '../modals/blocko-block-code-editor';
import { ModalsBlockoConfigPropertiesComponent } from '../modals/blocko-config-properties';
import { ModalsBlockoAddHardwareComponent } from '../modals/blocko-add-hardware';
import { ModalsGridConfigPropertiesComponent } from '../modals/grid-config-properties';
import { ModalsGridProjectPropertiesComponent } from '../modals/grid-project-properties';
import { ModalsGridProgramPropertiesComponent } from '../modals/grid-program-properties';
import { ModalsBlockoAddGridComponent } from '../modals/blocko-add-grid';
import { ModalsPermissionGroupComponent } from '../modals/permission-group';
import { ModalsPaymentDetailsComponent } from '../modals/payment-details';
import { ModalsRolePermissionAddComponent } from '../modals/role-permission-add';
import { ModalsPermissionPermissionPropertyComponent } from '../modals/permission-permission-properties';
import { ModalsBlocksBlockPropertiesComponent } from '../modals/blocks-block-properties';
import { ModalsHighImportanceNotificationComponent } from '../modals/high-importance-notification';
import { ModalsDeviceEditDescriptionComponent } from '../modals/device-edit-description';
import { ModalsDeviceEditDeveloperParameterValueComponent } from '../modals/device-edit-developer-parameter-value';
import { ModalsInstanceCreateComponent } from '../modals/instance-create';
import { ModalsBlockoVersionSelectComponent } from '../modals/blocko-version-select';
import { ModalsMembersAddComponent } from '../modals/members-add';
import { ModalsWidgetsWidgetPropertiesComponent } from '../modals/widgets-widget-properties';
import { ModalsSendInvoiceComponent } from '../modals/financial-send-invoice';
import { ModalsBlockoAddGridEmptyComponent } from '../modals/blocko-add-grid-emtpy';
import { ModalsHardwareBootloaderUpdateComponent } from '../modals/hardware-bootloader-update';
import { ModalsLibraryPropertiesComponent } from '../modals/library-properties';
import { ModalsCodeAddLibraryComponent } from '../modals/code-add-library';
import { ModalsCodeLibraryVersionComponent } from '../modals/code-library-version';
import { ModalsHardwareCodeProgramVersionSelectComponent } from '../modals/hardware-code-program-version-select';
import { ModalsWidgetsWidgetCopyComponent } from '../modals/widgets-widget-copy';
import { ModalsExtensionComponent } from '../modals/extension';
import { ModalsBlockoBlockCopyComponent } from '../modals/blocko-block-copy';
import { ModalsHardwareGroupPropertiesComponent } from '../modals/hardware-group-properties';
import { ModalsUpdateReleaseFirmwareComponent } from '../modals/update-release-firmware';
import { ModalsHardwareRestartMQTTPassComponent } from '../modals/hardware-restart-mqtt-pass';
import { ModalsHardwareChangeServerComponent } from '../modals/hardware-change-server';
import { ModalsCodeSelectComponent } from '../modals/code-select';
import { ModalsHardwareFindHashComponent } from '../modals/hardware-find-hash';
import { ModalsVersionSelectComponent } from '../modals/version-select';
import { ModalsProgramVersionSelectComponent } from '../modals/program-version-select';
import { ModalsSnapShotInstanceComponent } from '../modals/snapshot-properties';
import { ModalsSnapShotDeployComponent } from '../modals/snapshot-deploy';
import { ModalsGridProjectSelectComponent } from '../modals/grid-project-select';
import { ModalsBlockSelectComponent } from '../modals/block-select';
import { ModalsArticleComponent } from '../modals/article';
import { ModalsAddGSMComponent } from '../modals/add-gsm';
import { ModalsGsmPropertiesComponent } from '../modals/gsm-properties';
import { ModalsInstanceApiPropertiesComponent } from '../modals/instance-api-properties';
import { NotificationsOverlayComponent } from '../components/NotificationsOverlayComponent';
import { NotificationsListComponent } from '../components/NotificationsListComponent';
import { TagComponent } from '../components/TagComponent';
import { FileTreeComponent, IconComponent, IconFileComponent } from '../components/FileTreeComponent';
import { MonacoDiffComponent } from '../components/MonacoDiffComponent';
import { FilterTableComponent } from '../components/FilterTableComponent';
import { MyDatePickerModule } from 'mydatepicker';
import { ContactFormComponent } from '../components/ContactFormComponent';
import { PaymentDetailsFormComponent } from '../components/PaymentDetailsFormComponent';
import { BeckiBooleanButtonComponent } from '../components/BooleanButtonComponent';
import { FormTextAreaComponent } from '../components/FormTextAreaComponent';
import { MultiSelectComponent } from '../components/MultiSelectComponent';
import { ImageCropperComponent } from 'ngx-img-cropper';
import { BackNextButtonsComponent } from '../components/BackNextButtonsComponent';
import { TableListComponent } from '../components/TableListComponent';
import { ProgramVersionSelectorComponent } from '../components/VersionSelectorComponent';
import { BeckiClickOutsideDirective } from '../helpers/ClickDetection';
import { InstanceHistoryTimeLineComponent } from '../components/InstanceHistoryTimeLineComponent';
import { QRCodeComponent } from '../components/QRCodeComponent';
import { FormSwitchTwoListSelectComponent } from '../components/FormSwitchTwoListSelectComponent';
import { TimeZoneSelectorComponent } from '../components/TimeZoneComponent';
import { PortletPanelMenuComponent } from '../components/PortletPanelMenu';
import { Error404Component } from '../views/error404';
import { LoginComponent } from '../views/login';
import { LogoutComponent } from '../views/logout';
import { DashboardComponent } from '../views/dashboard';
import { NotificationsComponent } from '../views/notifications';
import { ProfileComponent } from '../views/profile';
import { ForgotPasswordComponent } from '../views/login-forgot-password';
import { PasswordRestartComponent } from '../views/login-password-restart';
import { CreateUserComponent } from '../views/create-user';
import { RedirectOkComponent } from '../components/redirect-ok';
import { ArticleComponent } from '../components/ArticleComponent';
import { ReaderQrComponent } from '../views/qr-reader';
import { GSMStatusComponent } from '../components/GSMStatusComponent';
import { LayoutNotLoggedComponent } from '../layouts/not-logged';
import { Md2HtmlPipe } from '../pipes/Md2HtmlPipe';
import { HtmlSanitizeBypassPipe } from '../pipes/HtmlSanitizeBypassPipe';
import { ModalsFinancialProductComponent } from '../modals/financial-product';
import { BlockoViewComponent } from '../components/BlockoViewComponent';
import { RoleGroupGroupComponent } from '../views/admin-permission-group-group';
import { RoleGroupComponent } from '../views/admin-permission-group';
import { ProjectsProjectWidgetsComponent } from '../views/projects-project-widgets';
import { ProjectsProjectWidgetsWidgetComponent } from '../views/projects-project-widgets-widget';
import { ProjectsProjectBlocksComponent } from '../views/projects-project-blocks';
import { ProjectsProjectBlocksBlockComponent } from '../views/projects-project-blocks-block';
import { ModalsDatabaseEditComponent } from '../modals/database-edit';
import { ModalsDatabaseCollectionNewComponent } from '../modals/database-collection-new';
import { ProjectsProjectHardwareHardwareComponent } from '../views/projects-project-hardware-hardware';
import { ProjectsProjectHardwareAddWithQrComponent } from '../views/projects-project-hardware-scan';
import { ProgramVersionDiffComponent } from '../components/VersionDiffComponent';
import { FileTreeRootComponent } from '../components/FileTreeRootComponent';
import { FileTreeNodeComponent } from '../components/FileTreeNodeComponent';
import { FileTreeFileComponent } from '../components/FileTreeFileComponent';
import { TabDropComponent } from '../components/TabDropComponent';
import { StripHtmlPipe } from '../pipes/SanitizeHtmlPipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        ChartsModule,
        MyDatePickerModule
    ],
    declarations: [

        // Generic components
        AppComponent,

        // Pipes
        Md2HtmlPipe,
        HtmlSanitizeBypassPipe,
        TranslatePipe,
        TranslateTablePipe,
        UnixTimeFormatPipe,
        StringReplacerPipe,
        Nl2BrPipe,
        StripHtmlPipe,

        // Directives
        DraggableDirective,
        BeckiClickOutsideDirective,

        NotificationsOverlayComponent,
        NotificationsListComponent,
        TagComponent,
        LogLevelComponent,
        FileTreeComponent,
        IconComponent,
        IconFileComponent,
        MonacoDiffComponent,
        FilterTableComponent,
        ContactFormComponent,
        PaymentDetailsFormComponent,
        BeckiBooleanButtonComponent,
        FormTextAreaComponent,
        MultiSelectComponent,
        ImageCropperComponent,
        BackNextButtonsComponent,
        TableListComponent,
        ProgramVersionSelectorComponent,
        InstanceHistoryTimeLineComponent,
        QRCodeComponent,
        FormSwitchTwoListSelectComponent,
        TimeZoneSelectorComponent,
        PortletPanelMenuComponent,
        PublicStateComponent,
        Error404Component,
        LoginComponent,
        LogoutComponent,
        DashboardComponent,
        NotificationsComponent,
        ProfileComponent,
        ForgotPasswordComponent,
        PasswordRestartComponent,
        CreateUserComponent,
        RedirectOkComponent,
        ArticleComponent,
        ReaderQrComponent,
        GSMStatusComponent,
        LayoutNotLoggedComponent,
        LayoutMainComponent,
        PortletTitleComponent,
        TabDropComponent,
        PaymentMethodComponent,
        BeckiDrobDownButtonComponent,
        NothingToShowComponent,
        BlockUIComponent,
        FormSelectComponent,
        FormInputComponent,
        OnlineStateComponent,
        FormInputTagsComponent,
        FilterPagerComponent,
        FirmwareTypeComponent,
        TypeOfUpdateComponent,
        UpdateStateComponent,
        TerminalLogSubscriberComponent,
        CodeIDEComponent,
        ProgramVersionDiffComponent,
        FileTreeRootComponent,
        FileTreeFileComponent,
        FileTreeNodeComponent,
        CompilationStatusComponent,
        ConsoleLogComponent,
        MonacoEditorComponent,
        FormColorPickerComponent,
        FormFAIconSelectComponent,
        ServerSizeSelectorComponent,
        ServerRegionSelectorComponent,
        GridViewComponent,
        ChartBarComponent,
        ProjectsProjectCodeCodeComponent,
        BlockoViewComponent,
        DatePickerComponent,
        TimePickerComponent,
        FormJsonNiceTextAreaComponent,
        ProducersProducerComponent,
        RoleGroupGroupComponent,
        RoleGroupComponent,
        ProjectsProjectWidgetsComponent,
        ProjectsProjectWidgetsWidgetComponent,
        ProjectsProjectBlocksComponent,
        ProjectsProjectBlocksBlockComponent,
        ProjectsProjectHardwareHardwareComponent,
        ProjectsProjectHardwareAddWithQrComponent,
        // Modals
        ModalsLogLevelComponent,
        ModalsAdminCreateHardwareComponent,
        ModalsContactComponent,
        ModalsProjectPropertiesComponent,
        ModalsCreateHomerServerComponent,
        ModalsUpdateHomerServerComponent,
        ModalsTariffComponent,
        ModalsPublicShareResponseComponent,
        ModalsCreateProcessorComponent,
        ModalsGridProgramSettingsComponent,
        ModalsBootloaderPropertyComponent,
        ModalsCreateCompilationServerComponent,
        ModalsRemovalComponent,
        ModalsCreateProducerComponent,
        ModalsDeactivateComponent,
        ModalsCreateHardwareTypeComponent,
        ModalsCreateHardwareTypeBatchComponent,
        ModalsAddHardwareComponent,
        ModalsSelectHardwareComponent,
        ModalsFileUploadComponent,
        ModalsBlockoPropertiesComponent,
        ModalsCodePropertiesComponent,
        ModalsPictureUploadComponent,
        ModalsPublicShareRequestComponent,
        ModalsCodeFileDialogComponent,
        ModalsSetAsMainComponent,
        ModalsShowQRComponent,
        ModalsConfirmComponent,
        ModalsGarfieldComponent,
        ModalsVersionDialogComponent,
        ModalsBlockoBlockCodeEditorComponent,
        ModalsBlockoConfigPropertiesComponent,
        ModalsBlockoAddHardwareComponent,
        ModalsGridConfigPropertiesComponent,
        ModalsGridProjectPropertiesComponent,
        ModalsGridProgramPropertiesComponent,
        ModalsBlockoAddGridComponent,
        ModalsPermissionGroupComponent,
        ModalsPaymentDetailsComponent,
        ModalsRolePermissionAddComponent,
        ModalsPermissionPermissionPropertyComponent,
        ModalsBlocksBlockPropertiesComponent,
        ModalsHighImportanceNotificationComponent,
        ModalsDeviceEditDescriptionComponent,
        ModalsDeviceEditDeveloperParameterValueComponent,
        ModalsInstanceCreateComponent,
        ModalsBlockoVersionSelectComponent,
        ModalsMembersAddComponent,
        ModalsWidgetsWidgetPropertiesComponent,
        ModalsSendInvoiceComponent,
        ModalsBlockoAddGridEmptyComponent,
        ModalsHardwareBootloaderUpdateComponent,
        ModalsLibraryPropertiesComponent,
        ModalsCodeAddLibraryComponent,
        ModalsCodeLibraryVersionComponent,
        ModalsHardwareCodeProgramVersionSelectComponent,
        ModalsWidgetsWidgetCopyComponent,
        ModalsExtensionComponent,
        ModalsBlockoBlockCopyComponent,
        ModalsHardwareGroupPropertiesComponent,
        ModalsUpdateReleaseFirmwareComponent,
        ModalsHardwareRestartMQTTPassComponent,
        ModalsHardwareChangeServerComponent,
        ModalsCodeSelectComponent,
        ModalsHardwareFindHashComponent,
        ModalsVersionSelectComponent,
        ModalsProgramVersionSelectComponent,
        ModalsSnapShotInstanceComponent,
        ModalsSnapShotDeployComponent,
        ModalsGridProjectSelectComponent,
        ModalsBlockSelectComponent,
        ModalsArticleComponent,
        ModalsAddGSMComponent,
        ModalsGsmPropertiesComponent,
        ModalsInstanceApiPropertiesComponent,
        ModalsDatabaseEditComponent,
        ModalsDatabaseCollectionNewComponent,
        ModalsFinancialProductComponent,
        ModalComponent
    ],
    exports:      [
        CommonModule,
        AppComponent,
        FormsModule,
        BlockoViewComponent,
        Md2HtmlPipe,
        HtmlSanitizeBypassPipe,
        StripHtmlPipe,
        BlockoViewComponent,
        NotificationsOverlayComponent,
        NotificationsListComponent,
        TagComponent,
        LogLevelComponent,
        FileTreeComponent,
        FileTreeRootComponent,
        FileTreeFileComponent,
        FileTreeNodeComponent,
        IconComponent,
        IconFileComponent,
        MonacoDiffComponent,
        FilterTableComponent,
        ContactFormComponent,
        PaymentDetailsFormComponent,
        BeckiBooleanButtonComponent,
        FormTextAreaComponent,
        MultiSelectComponent,
        ImageCropperComponent,
        BackNextButtonsComponent,
        TableListComponent,
        ProgramVersionSelectorComponent,
        BeckiClickOutsideDirective,
        InstanceHistoryTimeLineComponent,
        QRCodeComponent,
        FormSwitchTwoListSelectComponent,
        TimeZoneSelectorComponent,
        PortletPanelMenuComponent,
        PublicStateComponent,
        Error404Component,
        LoginComponent,
        LogoutComponent,
        DashboardComponent,
        NotificationsComponent,
        ProfileComponent,
        ForgotPasswordComponent,
        PasswordRestartComponent,
        CreateUserComponent,
        RedirectOkComponent,
        ArticleComponent,
        ReaderQrComponent,
        GSMStatusComponent,
        LayoutNotLoggedComponent,
        ReactiveFormsModule,
        LayoutMainComponent,
        TranslatePipe,
        PortletTitleComponent,
        TabDropComponent,
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
        ProgramVersionDiffComponent,
        CompilationStatusComponent,
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
        DatePickerComponent,
        TimePickerComponent,
        Nl2BrPipe,
        FormJsonNiceTextAreaComponent,
        ProducersProducerComponent,
        RoleGroupGroupComponent,
        RoleGroupComponent,
        ProjectsProjectWidgetsComponent,
        ProjectsProjectWidgetsWidgetComponent,
        ProjectsProjectBlocksComponent,
        ProjectsProjectBlocksBlockComponent,
        ProjectsProjectHardwareHardwareComponent,
        ProjectsProjectHardwareAddWithQrComponent,
    ]
})
export class SharedModule {}
