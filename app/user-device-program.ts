/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as _ from "underscore";
import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiFieldCode from "./lib-becki/field-code";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

@ngCore.Component({
  templateUrl: "app/user-device-program.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiFieldCode.Component,
    libBeckiLayout.Component,
    libPatternFlyListView.Component,
    ngCommon.CORE_DIRECTIVES,
    ngCommon.FORM_DIRECTIVES,
    ngRouter.ROUTER_DIRECTIVES
  ]
})
export class Component implements ngCore.OnInit {

  id:string;

  name:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  showHistory:boolean;

  editing:boolean;

  editProgram:boolean;

  addVersion:boolean;

  nameField:string;

  descriptionField:string;

  description:string;

  deviceType:string;

  versionName:string;

  versionDescription:string;

  versionCodeField:string;

  versionCode:string;

  versions:libPatternFlyListView.Item[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  constructor(routeParams:ngRouter.RouteParams, @ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service) {
    "use strict";

    this.id = routeParams.get("program");
    this.name = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Device Programs", ["UserDevices"]),
      new libBeckiLayout.LabeledLink("Loading...", ["UserDeviceProgram", {program: this.id}])
    ];
    this.showHistory = false;
    this.editing = false;
    this.editProgram = false;
    this.addVersion = false;
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.description = "Loading...";
    this.deviceType = "";
    this.versionName = "Loading...";
    this.versionDescription = "Loading...";
    this.versionCodeField = "Loading...";
    this.versionCode = "Loading...";
    this.backEnd = backEnd;
    this.notifications = notifications;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-252
    this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-252"));
  }

  refresh():void {
    "use strict";

    this.editing = false;
    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    this.backEnd.getDeviceProgram(this.id)
        .then(program => {
          if (!program.program_versions.length) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error("the program has no version"));
          }
          let lastVersion = _.max(program.program_versions.map(version => version.version_object), version => version.date_of_create);
          if (lastVersion.files.length != 1) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error("the program version does not have only one file"));
          }
          return Promise.all<any>([
            program,
            lastVersion,
            this.backEnd.getFile(lastVersion.files[0].id)
          ]);
        })
        .then(result => {
          let program:libBackEnd.DeviceProgram;
          let version:libBackEnd.Version;
          let versionFile:string;
          [program, version, versionFile] = result;
          this.name = program.program_name;
          this.breadcrumbs[3].label = program.program_name;
          this.editProgram = program.edit_permission;
          this.addVersion = program.update_permission;
          this.nameField = program.program_name;
          this.descriptionField = program.program_description;
          this.description = program.program_description;
          this.deviceType = program.type_of_board_id;
          this.versionName = version.version_name;
          this.versionDescription = version.version_description;
          this.versionCodeField = versionFile;
          this.versionCode = versionFile;
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-126
          this.versions = program.program_versions.map(version => new libPatternFlyListView.Item(version.version_object.id, `${version.version_object.version_name} (issue/TYRION-126)`, version.version_object.version_description, undefined, false));
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The program ${this.id} cannot be loaded.`, reason));
        });
  }

  onEditClick():void {
    "use strict";

    this.editing = !this.editing;
  }

  onDetailsClick():void {
    "use strict";

    this.showHistory = false;
  }

  onHistoryClick():void {
    "use strict";

    this.showHistory = true;
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProjects()
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        .then(projects => Promise.all<libBackEnd.DeviceProgram>([].concat(...projects.map(project => project.c_programs_id)).map(id => this.backEnd.getDeviceProgram(id))))
        .then(programs => !programs.find(program => program.id != this.id && program.program_name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateDeviceProgram(this.id, this.nameField, this.descriptionField, this.deviceType)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The program has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The program cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.editing = false;
  }

  onVersionSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.addVersionToDeviceProgram(this.versionCodeField, this.id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The version has been created."));
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-275
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-275"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The version cannot be created.", reason));
        });
  }
}
