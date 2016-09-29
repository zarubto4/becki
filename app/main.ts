/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

// Angular
import {
    disableDeprecatedForms, provideForms, FormsModule, REACTIVE_FORM_PROVIDERS,
    ReactiveFormsModule
} from "@angular/forms";
import {NgModule} from "@angular/core";
import {HTTP_PROVIDERS, HttpModule, JsonpModule} from "@angular/http";
import {provideRouter, RouterConfig, Routes, RouterModule} from "@angular/router";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {BrowserModule} from "@angular/platform-browser";
// App
import {AppComponent} from "./app";
// Helpers
import {LabeledLink} from "./helpers/LabeledLink";
// Services
import {FlashMessagesService} from "./services/FlashMessagesService";
import {BackendService} from "./services/BackendService";
import {AuthGuard, NonAuthGuard} from "./services/AuthGuard";
import {ModalService} from "./services/ModalService";
import {TabMenuService} from "./services/TabMenuService";
import {BreadcrumbsService} from "./services/BreadcrumbsService";
import {ValidatorErrorsService} from "./services/ValidatorErrorsService";
import {CurrentParamsService} from "./services/CurrentParamsService";
import {NotificationService} from "./services/NotificationService";
// Views
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
import {ProjectsProjectBlocksBlockComponent} from "./views/projects-project-blocks-block";
import {CreateUserComponent} from "./views/create-user";
import {RedirectOkComponent} from "./views/redirectOk";
import {ProjectsProjectGridGridComponent} from "./views/projects-project-grid-grid";
import {ProjectsProjectGridComponent} from "./views/projects-project-grid";
import {ProductRegistrationComponent} from "./views/product-registration";

// DON'T USE children IN ROUTER YET!!!
var routes:Routes = [
    {path: "login", component: LoginComponent, canActivate:[NonAuthGuard]},
    {path: "logout", component: LogoutComponent},
    {path: "createUser", component: CreateUserComponent, canActivate:[NonAuthGuard]},

    {path: "forgotPassword", component: ForgotPasswordComponent, canActivate:[NonAuthGuard]},
    {path: "passwordRestart/:token", component: PasswordRestartComponent, canActivate:[NonAuthGuard]},
    {path: "redicectOk", component: RedirectOkComponent, canActivate:[NonAuthGuard]},

    {path: "", redirectTo: "/dashboard", pathMatch: "full"},

    {path: "dashboard", data:{breadName: "Dashboard"}, component: DashboardComponent, canActivate:[AuthGuard]},

    {path: "notifications", data:{breadName: "Notifications"}, component: NotificationsComponent, canActivate:[AuthGuard]},

    {path: "profile", data:{breadName: "Profile"}, component: ProfileComponent, canActivate:[AuthGuard]},

    {path: "productRegistration/:tariff", data:{breadName: "Product registration"}, component: ProductRegistrationComponent, canActivate:[AuthGuard]},
    {path: "productRegistration", data:{breadName: "Product registration"}, component: ProductRegistrationComponent, canActivate:[AuthGuard]},


    {path: "projects", data:{breadName: "Projects"}, component: ProjectsComponent, canActivate:[AuthGuard]},
    {path: "projects/:project", data:{breadName: ":project"}, component: ProjectsProjectComponent, canActivate:[AuthGuard]},
    {path: "projects/:project/hardware", data:{breadName: "Hardware"}, component: ProjectsProjectHardwareComponent, canActivate:[AuthGuard]},
    {path: "projects/:project/blocko", data:{breadName: "Blocko"}, component: ProjectsProjectBlockoComponent, canActivate:[AuthGuard]},
    {path: "projects/:project/blocko/:blocko", data:{breadName: ":blocko"}, component: ProjectsProjectBlockoBlockoComponent, canActivate:[AuthGuard]},
    {path: "projects/:project/code", data:{breadName: "Code"}, component: ProjectsProjectCodeComponent, canActivate:[AuthGuard]},
    {path: "projects/:project/code/:code", data:{breadName: ":code"}, component: ProjectsProjectCodeCodeComponent, canActivate:[AuthGuard]},
    {path: "projects/:project/blocks", data:{breadName: "Blocks"}, component: ProjectsProjectBlocksComponent, canActivate:[AuthGuard]},
    {path: "projects/:project/blocks/:block", data:{breadName: ":block"}, component: ProjectsProjectBlocksBlockComponent, canActivate:[AuthGuard]},
    {path: "projects/:project/grid", data:{breadName: "Grid"}, component: ProjectsProjectGridComponent, canActivate:[AuthGuard]},
    {path: "projects/:project/grid/:grid", data:{breadName: ":grid"}, component: ProjectsProjectGridGridComponent, canActivate:[AuthGuard]},


    // old routes
    // BEGIN only for temporary back compatibility
    /*{path: "old_projects/:project", component: userProject.Component},

    {path: "application/devices/:device", component: applicationDevice.Component},
    {path: "application/devices", redirectTo: "user/applications"},
    {path: "system", component: system.Component},
    {path: "system/compilation/server/new", component: systemCompilationServerNew.Component},
    {path: "system/compilation/servers/:server", component: systemCompilationServer.Component},
    {path: "system/compilation/servers", redirectTo: "system"},
    {path: "system/device/new", component: systemDeviceNew.Component},
    {path: "system/device/type/new", component: systemDeviceTypeNew.Component},
    {path: "system/device/types/:type", component: systemDeviceType.Component},
    {path: "system/device/types", redirectTo: "system"},
    {path: "system/interactions/server/new", component: systemInteractionsServerNew.Component},
    {path: "system/interactions/servers/:server", component: systemInteractionsServer.Component},
    {path: "system/interactions/servers", redirectTo: "system"},
    {path: "system/libraries/:library", component: systemLibrary.Component},
    {path: "system/libraries", redirectTo: "system"},
    {path: "system/library/group/new", component: systemLibraryGroupNew.Component},
    {path: "system/library/groups/:group", component: systemLibraryGroup.Component},
    {path: "system/library/groups", redirectTo: "system"},
    {path: "system/library/new", component: systemLibraryNew.Component},
    {path: "system/processor/new", component: systemProcessorNew.Component},
    {path: "system/processors/:processor", component: systemProcessor.Component},
    {path: "system/processors", redirectTo: "system"},
    {path: "system/producer/new", component: systemProducerNew.Component},
    {path: "system/producers/:producer", component: systemProducer.Component},
    {path: "system/producers", redirectTo: "system"},
    // see https://github.com/angular/angular/issues/10120
    {
        path: "user", children: [
        {path: "", redirectTo: "applications", pathMatch: "full"},
        {path: "application/device/new", component: userApplicationDeviceNew.Component},
        {path: "application/devices", redirectTo: "applications"},
        {path: "application/group/new", component: userApplicationGroupNew.Component},
        {path: "application/groups/:group", component: userApplicationGroup.Component},
        {path: "application/groups", redirectTo: "applications"},
        {path: "application/new", component: userApplicationNew.Component},
        {path: "applications/:application", component: userApplication.Component},
        {path: "applications", component: userApplications.Component},
        {path: "connections", comforgotPasswordponent: userConnections.Component},
        {path: "device/new", component: userDeviceNew.Component},
        {path: "device/program/new", component: userDeviceProgramNew.Component},
        {path: "device/programs/:program", component: userDeviceProgram.Component},
        {path: "device/programs", redirectTo: "devices"},
        {path: "devices", component: userDevices.Component},
        {path: "interactions/block/group/new", component: userInteractionsBlockGroupNew.Component},
        {path: "interactions/block/groups/:group", component: userInteractionsBlockGroup.Component},
        {path: "interactions/block/groups", redirectTo: "interactions"},
        {path: "interactions/block/new", component: userInteractionsBlockNew.Component},
        {path: "interactions/blocks/:block", component: userInteractionsBlock.Component},
        {path: "interactions/blocks", redirectTo: "interactions"},
        {path: "interactions/moderator/new", component: userInteractionsModeratorNew.Component},
        {path: "interactions/moderators", redirectTo: "interactions"},
        {path: "interactions/scheme/new", component: userInteractionsSchemeNew.Component},
        {path: "interactions/schemes/:scheme", component: userInteractionsScheme.Component},
        {
            path: "interactions/schemes/:scheme/versions/:version",
            component: userInteractionsSchemeVersion.Component
        },
        {path: "interactions/schemes/:scheme/versions", redirectTo: "interactions/schemes/:scheme"},
        {path: "interactions/schemes", redirectTo: "interactions"},
        {path: "interactions/spies/:spy", component: userInteractionsSpy.Component},
        {path: "interactions/spies", redirectTo: "interactions"},
        {path: "interactions", component: userInteractions.Component},
        {path: "project/new", component: userProjectNew.Component},
        {path: "projects/:project", component: userProject.Component},
        {path: "projects/:project/collaborator/new", component: userProjectCollaboratorNew.Component},
        {path: "projects/:project/edit", component: userProjectEdit.Component},

    ]
    },
    {path: "users/:user", component: user.Component},*/
    // END only for temporary back compatibility

    {path: "**", component: Error404Component},
];

var navigation = [
    new LabeledLink("Dashboard", ["/dashboard"], "tasks"),
    new LabeledLink("Projects", ["/projects"], "book"),
    new LabeledLink("Applications", ["/user/applications"], "mobile"),
    new LabeledLink("Interactions", ["/user/interactions"], "link"),
    new LabeledLink("Devices", ["/user/devices"], "rocket"),
    new LabeledLink("System", ["/system"], "globe"),
    new LabeledLink("Log out", ["/logout"], "sign-out")
];

var tabMenus = {
    "projects-project": [
        new LabeledLink("Dashboard", ["/", "projects", ":project"], "", {linkActiveExact:true}),
        new LabeledLink("Hardware", ["/", "projects", ":project", "hardware"]),
        new LabeledLink("Code", ["/", "projects", ":project", "code"]),
        new LabeledLink("Blocko", ["/", "projects", ":project", "blocko"]),
        new LabeledLink("Blocks", ["/", "projects", ":project", "blocks"]),
        new LabeledLink("Grid", ["/", "projects", ":project", "grid"]),
        new LabeledLink("Some else", ["/", "projects", ":project", "someelse"])
    ]
};


@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
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
        ModalService,
        CurrentParamsService,
        BreadcrumbsService,
        TabMenuService,
        {provide: "routes", useValue: routes},
        {provide: "navigation", useValue: navigation},
        {provide: "tabMenus", useValue: tabMenus},
    ],
    declarations: [
        AppComponent,
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
        ProjectsProjectBlocksBlockComponent,
        ProjectsProjectGridComponent,
        ProjectsProjectGridGridComponent,
        ProductRegistrationComponent,

    ],
    exports: [ AppComponent ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);