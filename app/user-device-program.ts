/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as _ from "underscore";
import * as Rx from "rxjs";
import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiFieldIDE from "./lib-becki/field-ide";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

@ngCore.Component({
  templateUrl: "app/user-device-program.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiFieldIDE.Component,
    libBeckiLayout.Component,
    libPatternFlyListView.Component,
    ngCommon.CORE_DIRECTIVES,
    ngRouter.ROUTER_DIRECTIVES
  ]
})
export class Component implements ngCore.OnInit, ngCore.OnDestroy {

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

  versionNameField:string;

  versionName:string;

  versionDescriptionField:string;

  versionDescription:string;

  versionCodeField:{[name:string]: string};

  versionCode:{[name:string]: string};

  versions:libPatternFlyListView.Item[];

  activatedRoute:ngRouter.ActivatedRoute;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  routeParamsSubscription:Rx.Subscription;

  constructor(@ngCore.Inject("home") home:string, activatedRoute:ngRouter.ActivatedRoute, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service) {
    "use strict";

    this.name = "Loading...";
    this.breadcrumbs = [
      new libBeckiLayout.LabeledLink(home, ["/"]),
      new libBeckiLayout.LabeledLink("User", ["/user"]),
      new libBeckiLayout.LabeledLink("Board Programs", ["/user/device/programs"])
    ];
    this.showHistory = false;
    this.editing = false;
    this.editProgram = false;
    this.addVersion = false;
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.description = "Loading...";
    this.deviceType = "";
    this.versionNameField = "Loading...";
    this.versionName = "Loading...";
    this.versionDescriptionField = "Loading...";
    this.versionDescription = "Loading...";
    this.versionCodeField = {};
    this.versionCode = {};
    this.activatedRoute = activatedRoute;
    this.backEnd = backEnd;
    this.notifications = notifications;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = params["program"];
      this.refresh();
    });
  }

  ngOnDestroy():void {
    "use strict";

    this.routeParamsSubscription.unsubscribe();
  }

  refresh():void {
    "use strict";

    this.editing = false;
    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    this.backEnd.getC_Program(this.id)
        .then(program => {
          if (!program.program_versions.length) {
            throw new Error("the program has no version");
          }
          let lastVersion = _.max(program.program_versions, version => version.version_object.date_of_create);
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-309
          let lastVersionFiles = <{[name:string]: string}>_.object(JSON.parse(lastVersion.version_code).user_files.map((file:{file_name:string, code:string}) => [file.file_name, file.code]));
          this.name = program.program_name;
          this.breadcrumbs.push(new libBeckiLayout.LabeledLink(program.program_name, ["/user/device/programs", this.id]));
          this.editProgram = program.edit_permission;
          this.addVersion = program.update_permission;
          this.nameField = program.program_name;
          this.descriptionField = program.program_description;
          this.description = program.program_description;
          this.deviceType = program.type_of_board_id;
          this.versionNameField = lastVersion.version_object.version_name;
          this.versionName = lastVersion.version_object.version_name;
          this.versionDescriptionField = lastVersion.version_object.version_description;
          this.versionDescription = lastVersion.version_object.version_description;
          this.versionCodeField = _.clone(lastVersionFiles);
          this.versionCode = _.clone(lastVersionFiles);
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
        .then(projects => Promise.all<libBackEnd.CProgram>([].concat(...projects.map(project => project.c_programs_id)).map(id => this.backEnd.getC_Program(id))))
        .then(programs => !programs.find(program => program.id != this.id && program.program_name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateC_Program(this.id, this.nameField, this.descriptionField, this.deviceType)
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
    return () => this.backEnd.getC_Program(this.id).then(program => !program.program_versions.find(version => version.version_object.version_name == this.versionNameField));
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
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-275
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-275"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The version cannot be created.", reason));
        });
  }
}
