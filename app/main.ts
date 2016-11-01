///<reference path="../typings/index.d.ts"/>
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

// Imports
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {HttpModule, JsonpModule} from "@angular/http";
import {Routes, RouterModule} from "@angular/router";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {BrowserModule} from "@angular/platform-browser";
import {AppComponent} from "./app";
import {ModalComponent} from "./modals/modal";
import {LabeledLink} from "./helpers/LabeledLink";
import {Nl2Br} from "./pipes/Nl2Br";
import {LayoutMain} from "./layouts/main";
import {LayoutNotLogged} from "./layouts/not-logged";
import {FlashMessagesService} from "./services/FlashMessagesService";
import {BackendService} from "./services/BackendService";
import {AuthGuard, NonAuthGuard} from "./services/AuthGuard";
import {ModalService} from "./services/ModalService";
import {TabMenuService} from "./services/TabMenuService";
import {BreadcrumbsService} from "./services/BreadcrumbsService";
import {ValidatorErrorsService} from "./services/ValidatorErrorsService";
import {CurrentParamsService} from "./services/CurrentParamsService";
import {NotificationService} from "./services/NotificationService";
import {AceEditor} from "./components/AceEditor";
import {BeckiFormColorPicker} from "./components/BeckiFormColorPicker";
import {BeckiFormFAIconSelect} from "./components/BeckiFormFAIconSelect";
import {BeckiFormInput} from "./components/BeckiFormInput";
import {BeckiFormSelect} from "./components/BeckiFormSelect";
import {BlockoView} from "./components/BlockoView";
import {CodeIDE} from "./components/CodeIDE";
import {CProgramVersionSelector} from "./components/CProgramVersionSelector";
import {Draggable} from "./components/Draggable";
import {FileTree} from "./components/FileTree";
import {FlashMessagesComponent} from "./components/FlashMessagesComponent";
import {GridView} from "./components/GridView";
import {Error404Component} from "./views/error404";
import {LoginComponent} from "./views/login";
import {LogoutComponent} from "./views/logout";
import {DashboardComponent} from "./views/dashboard";
import {ProjectsComponent} from "./views/projects";
import {ProjectsProjectComponent} from "./views/projects-project";
import {ProjectsProjectHardwareComponent} from "./views/projects-project-hardware";
import {ProjectsProjectBlockoComponent} from "./views/projects-project-blocko";
import {ProjectsProjectCodeComponent} from "./views/projects-project-code";
import {ProjectsProjectBlockoBlockoComponent} from "./views/projects-project-blocko-blocko";
import {ProjectsProjectCodeCodeComponent} from "./views/projects-project-code-code";
import {NotificationsComponent} from "./views/notifications";
import {ProfileComponent} from "./views/profile";
import {ForgotPasswordComponent} from "./views/forgot-password";
import {PasswordRestartComponent} from "./views/password-restart";
import {ProjectsProjectBlocksComponent} from "./views/projects-project-blocks";
import {ProjectsProjectBlocksBlocksBlockComponent} from "./views/projects-project-blocks-blocks-block";
import {CreateUserComponent} from "./views/create-user";
import {ProjectsProjectGridComponent} from "./views/projects-project-grid";
import {RedirectOkComponent} from "./views/redirect-ok";
import {ProductRegistrationComponent} from "./views/product-registration";
import {ModalsProjectPropertiesComponent} from "./modals/project-properties";
import {ModalsRemovalComponent} from "./modals/removal";
import {ModalsAddHardwareComponent} from "./modals/add-hardware";
import {ModalsBlockoPropertiesComponent} from "./modals/blocko-properties";
import {ModalsCodePropertiesComponent} from "./modals/code-properties";
import {ModalsCodeFileDialogComponent} from "./modals/code-file-dialog";
import {ModalsConfirmComponent} from "./modals/confirm";
import {ModalsVersionDialogComponent} from "./modals/version-dialog";
import {ModalsBlockoJsEditorComponent} from "./modals/blocko-js-editor";
import {ModalsBlockoConfigPropertiesComponent} from "./modals/blocko-config-properties";
import {ModalsBlockoAddHardwareComponent} from "./modals/blocko-add-hardware";
import {ModalsGridConfigPropertiesComponent} from "./modals/grid-config-properties";
import {ModalsGridProjectPropertiesComponent} from "./modals/grid-project-properties";
import {ModalsGridProgramPropertiesComponent} from "./modals/grid-program-properties";
import {ModalsBlockoAddGridComponent} from "./modals/blocko-add-grid";
import {ModalsBlocksTypePropertiesComponent} from "./modals/blocks-type-properties";
import {ModalsBlocksBlockPropertiesComponent} from "./modals/blocks-block-properties";
import {ModalsHighImportanceNotificationComponent} from "./modals/high-importance-notification";
import {ModalsDeviceEditDescriptionComponent} from "./modals/device-edit-description";
import {BlockUIService} from "./services/BlockUIService";
import {BlockUIComponent} from "./components/BlockUIComponent";
import {ProjectsProjectBlocksBlocksComponent} from "./views/projects-project-blocks-blocks";
import {ProjectsProjectGridGridsComponent} from "./views/projects-project-grid-grids";
import {ProjectsProjectGridGridsGridComponent} from "./views/projects-project-grid-grids-grid";

//@formatter:off
// DON'T USE children IN ROUTER YET!!!
var routes: Routes = [
    {path: "login", component: LoginComponent, canActivate: [NonAuthGuard]},
    {path: "logout", component: LogoutComponent},
    {path: "createUser", component: CreateUserComponent, canActivate: [NonAuthGuard]},

    {path: "forgotPassword", component: ForgotPasswordComponent, canActivate: [NonAuthGuard]},
    {path: "passwordRestart/:token", component: PasswordRestartComponent, canActivate: [NonAuthGuard]},
    {path: "redirectOk", component: RedirectOkComponent, canActivate: [NonAuthGuard]},

    {path: "", redirectTo: "/dashboard", pathMatch: "full"},

    {path: "dashboard", data: {breadName: "Dashboard"}, component: DashboardComponent, canActivate: [AuthGuard]},

    {path: "notifications", data: {breadName: "Notifications"}, component: NotificationsComponent, canActivate: [AuthGuard]},

    {path: "profile", data: {breadName: "Profile"}, component: ProfileComponent, canActivate: [AuthGuard]},

    {path: "productRegistration/:tariff", data: {breadName: "Product registration"}, component: ProductRegistrationComponent, canActivate: [AuthGuard]},
    {path: "productRegistration", data: {breadName: "Product registration"}, component: ProductRegistrationComponent, canActivate: [AuthGuard]},

    {path: "projects", data: {breadName: "Projects"}, component: ProjectsComponent, canActivate: [AuthGuard]},
    {path: "projects/:project", data: {breadName: ":project"}, component: ProjectsProjectComponent, canActivate: [AuthGuard]},
    {path: "projects/:project/hardware", data: {breadName: "Hardware devices"}, component: ProjectsProjectHardwareComponent, canActivate: [AuthGuard]},
    {path: "projects/:project/blocko", data: {breadName: "Blocko programs"}, component: ProjectsProjectBlockoComponent, canActivate: [AuthGuard]},
    {path: "projects/:project/blocko/:blocko", data: {breadName: ":blocko"}, component: ProjectsProjectBlockoBlockoComponent, canActivate: [AuthGuard]},
    {path: "projects/:project/code", data: {breadName: "Code programs"}, component: ProjectsProjectCodeComponent, canActivate: [AuthGuard]},
    {path: "projects/:project/code/:code", data: {breadName: ":code"}, component: ProjectsProjectCodeCodeComponent, canActivate: [AuthGuard]},
    {path: "projects/:project/blocks", data: {breadName: "Custom blocks"}, component: ProjectsProjectBlocksComponent, canActivate: [AuthGuard]},
    {path: "projects/:project/blocks/:blocks", data: {breadName: ":blocks"}, component: ProjectsProjectBlocksBlocksComponent, canActivate: [AuthGuard]},
    {path: "projects/:project/blocks/:blocks/:block", data: {breadName: ":block"}, component: ProjectsProjectBlocksBlocksBlockComponent, canActivate: [AuthGuard]},
    {path: "projects/:project/grid", data: {breadName: "Grid programs"}, component: ProjectsProjectGridComponent, canActivate: [AuthGuard]},
    {path: "projects/:project/grid/:grids", data: {breadName: ":grids"}, component: ProjectsProjectGridGridsComponent, canActivate: [AuthGuard]},
    {path: "projects/:project/grid/:grids/:grid", data: {breadName: ":grid"}, component: ProjectsProjectGridGridsGridComponent, canActivate: [AuthGuard]},

    {path: "**", component: Error404Component},
];
//@formatter:on

var navigation = [
    new LabeledLink("Dashboard", ["/dashboard"], "tachometer"),
    new LabeledLink("Projects", ["/projects"], "tasks"),
    /*new LabeledLink("Applications", ["/user/applications"], "mobile"),
    new LabeledLink("Interactions", ["/user/interactions"], "link"),
    new LabeledLink("Devices", ["/user/devices"], "rocket"),
    new LabeledLink("System", ["/system"], "globe"),*/
    new LabeledLink("Log out", ["/logout"], "sign-out")
];

var tabMenus = {
    "projects-project": [
        new LabeledLink("Dashboard", ["/", "projects", ":project"], "tachometer", {linkActiveExact: true}),
        new LabeledLink("Code", null, "code", {items:[
            new LabeledLink("Code programs", ["/", "projects", ":project", "code"], "code"),
            new LabeledLink("Hardware devices", ["/", "projects", ":project", "hardware"], "microchip"),
        ]}),
        new LabeledLink("Blocko", null, "sitemap fa-rotate-90", {items:[
            new LabeledLink("Blocko programs", ["/", "projects", ":project", "blocko"], "sitemap fa-rotate-90"),
            new LabeledLink("Custom blocks", ["/", "projects", ":project", "blocks"], "cubes"),
        ]}),
        new LabeledLink("Grid", null, "desktop", {items:[
            new LabeledLink("Grid programs", ["/", "projects", ":project", "grid"], "desktop"),
            new LabeledLink("Screen profiles", ["/", "projects", ":project", "screen-profiles"], "arrows"),
        ]}),
        new LabeledLink("Participants", ["/", "projects", ":project", "participants"], "users"),
    ]
};


@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forRoot(routes),
        HttpModule,
        JsonpModule,
    ],
    providers: [
        ValidatorErrorsService,
        FlashMessagesService,
        BackendService, // BackendService must be after FlashMessagesService
        AuthGuard, // AuthGuard service must be after BackendService
        NonAuthGuard, // NonAuthGuard service must be after BackendService
        NotificationService,
        BlockUIService,
        ModalService,
        CurrentParamsService,
        BreadcrumbsService,
        TabMenuService,
        {provide: "routes", useValue: routes},
        {provide: "navigation", useValue: navigation},
        {provide: "tabMenus", useValue: tabMenus},
    ],
    declarations: [
        // Generic app components
        AppComponent,
        ModalComponent,
        BlockUIComponent,
        // Layouts components
        LayoutMain,
        LayoutNotLogged,
        // Pipes
        Nl2Br,
        // Components
        AceEditor,
        BeckiFormColorPicker,
        BeckiFormFAIconSelect,
        BeckiFormInput,
        BeckiFormSelect,
        BlockoView,
        CodeIDE,
        CProgramVersionSelector,
        Draggable,
        FileTree,
        FlashMessagesComponent,
        GridView,
        // Views components
        Error404Component,
        LoginComponent,
        LogoutComponent,
        DashboardComponent,
        ProjectsComponent,
        ProjectsProjectComponent,
        ProjectsProjectHardwareComponent,
        ProjectsProjectBlockoComponent,
        ProjectsProjectBlockoBlockoComponent,
        ProjectsProjectCodeComponent,
        ProjectsProjectCodeCodeComponent,
        NotificationsComponent,
        ProfileComponent,
        ForgotPasswordComponent,
        PasswordRestartComponent,
        ProjectsProjectBlocksComponent,
        CreateUserComponent,
        RedirectOkComponent,
        ProjectsProjectBlocksBlocksComponent,
        ProjectsProjectBlocksBlocksBlockComponent,
        ProjectsProjectGridComponent,
        ProjectsProjectGridGridsComponent,
        ProjectsProjectGridGridsGridComponent,
        ProductRegistrationComponent,
        // Modals components
        ModalsProjectPropertiesComponent,
        ModalsRemovalComponent,
        ModalsAddHardwareComponent,
        ModalsBlockoPropertiesComponent,
        ModalsCodePropertiesComponent,
        ModalsCodeFileDialogComponent,
        ModalsConfirmComponent,
        ModalsVersionDialogComponent,
        ModalsBlockoJsEditorComponent,
        ModalsBlockoConfigPropertiesComponent,
        ModalsBlockoAddHardwareComponent,
        ModalsGridConfigPropertiesComponent,
        ModalsGridProjectPropertiesComponent,
        ModalsGridProgramPropertiesComponent,
        ModalsBlockoAddGridComponent,
        ModalsBlocksTypePropertiesComponent,
        ModalsBlocksBlockPropertiesComponent,
        ModalsHighImportanceNotificationComponent,
        ModalsDeviceEditDescriptionComponent,

    ],
    exports: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);