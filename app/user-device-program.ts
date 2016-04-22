/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * Documentation in this file might be outdated and the code might be dirty and
 * flawed since management prefers speed over quality.
 *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */

import * as _ from "underscore";
import * as ng from "angular2/angular2";
import * as ngRouter from "angular2/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiFieldCode from "./lib-becki/field-code";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

@ng.Component({
  templateUrl: "app/user-device-program.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiFieldCode.Component,
    libBeckiLayout.Component,
    libPatternFlyListView.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES,
    ngRouter.ROUTER_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  id:string;

  name:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  editing:boolean;

  nameField:string;

  descriptionField:string;

  description:string;

  versionNameField:string;

  versionName:string;

  versionDescriptionField:string;

  versionDescription:string;

  versionCodeField:string;

  versionCode:string;

  editProgram:boolean;

  versions:libPatternFlyListView.Item[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service) {
    "use strict";

    this.id = routeParams.get("program");
    this.name = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Device Programs", ["Projects"]),
      new libBeckiLayout.LabeledLink("Loading...", ["UserDeviceProgram", {program: this.id}])
    ];
    this.editing = false;
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.description = "Loading...";
    this.versionNameField = "Loading...";
    this.versionName = "Loading...";
    this.versionDescriptionField = "Loading...";
    this.versionDescription = "Loading...";
    this.versionCodeField = "Loading...";
    this.versionCode = "Loading...";
    this.editProgram = false;
    this.backEnd = backEnd;
    this.notifications = notifications;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.editing = false;
    this.backEnd.getDeviceProgram(this.id)
        .then(program => {
          if (!program.version_objects.length) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error("the program has no version"));
          }
          let lastVersion = _.max(program.version_objects, version => version.date_of_create);
          if (lastVersion.files_id.length != 1) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error("the program version does not have only one file"));
          }
          return Promise.all<any>([
            program,
            lastVersion,
            this.backEnd.getFile(lastVersion.files_id[0])
          ]);
        })
        .then(result => {
          let program:libBackEnd.DeviceProgram;
          let version:libBackEnd.Version;
          let versionFile:libBackEnd.BackEndFile;
          [program, version, versionFile] = result;
          this.name = program.program_name;
          this.breadcrumbs[3].label = program.program_name;
          this.nameField = program.program_name;
          this.descriptionField = program.program_description;
          this.description = program.program_description;
          this.versionNameField = version.version_name;
          this.versionName = version.version_name;
          this.versionDescriptionField = version.version_description;
          this.versionDescription = version.version_description;
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-195
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-195"));
          //this.versionCodeField = versionFile.fileContent;
          //this.versionCode = versionFile.fileContent;
          this.editProgram = program.edit_permission;
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-126
          this.versions = program.version_objects.map(version => new libPatternFlyListView.Item(version.id, `${version.version_name} (issue/TYRION-126)`, version.version_description));
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The program ${this.id} cannot be loaded.`, reason));
        });
  }

  onEditClick():void {
    "use strict";

    this.editing = !this.editing;
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProjects()
        .then(projects => Promise.all([].concat(...projects.map(project => this.backEnd.getDevicePrograms(project.id)))))
        .then(programs => !programs.find(program => program.id != this.id && program.program_name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateDeviceProgram(this.id, this.nameField, this.descriptionField)
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

  validateVersionNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getDeviceProgram(this.id).then(program => !program.version_objects.find(version => version.version_name == this.versionNameField));
  }

  onVersionSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.addVersionToDeviceProgram(this.versionNameField, this.versionDescriptionField, this.versionCodeField, this.id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The version has been created."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The version cannot be created.", reason));
        });
  }

  onVersionRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.removeVersionFromDeviceProgram(id, this.id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The version has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The version cannot be removed.", reason));
        });
  }
}
