/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
  templateUrl: "app/system-library-group.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES, ngCommon.FORM_DIRECTIVES]
})
export class Component implements ngCore.OnInit {

  id:string;

  group:libBackEnd.LibraryGroup;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  editing:boolean;

  nameField:string;

  descriptionField:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  constructor(routeParams:ngRouter.RouteParams, @ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service) {
    "use strict";

    this.id = routeParams.get("group");
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("System", ["System"]),
      new libBeckiLayout.LabeledLink("Library Groups", ["System"]),
      new libBeckiLayout.LabeledLink("Loading...", ["SystemLibraryGroup", {group: this.id}])
    ];
    this.editing = false;
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.backEnd = backEnd;
    this.notifications = notifications;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-276
    this.notifications.current.push(new libBeckiNotifications.Warning("ssue/TYRION-276"));
  }

  refresh():void {
    "use strict";

    this.editing = false;
    this.backEnd.getLibraryGroup(this.id)
        .then(group => {
          this.group = group;
          this.breadcrumbs[3].label = group.group_name;
          this.nameField = group.group_name;
          this.descriptionField = group.description;
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The group ${this.id} cannot be loaded.`, reason));
        });
  }

  onEditClick():void {
    "use strict";

    this.editing = !this.editing;
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getLibraryGroups(1)
        .then(groupCollection => {
          return Promise.all<any>([
            this.backEnd.getLibraries(1),
            Promise.all(groupCollection.pages.map(page => this.backEnd.getLibraryGroups(page)))
          ]);
        })
        .then(result => {
          let libraries:libBackEnd.Library[];
          let groupCollections:libBackEnd.LibraryGroupCollection[];
          [libraries, groupCollections] = result;
          return ![].concat(...groupCollections.map(collection => collection.content)).find(group => group.id != this.id && group.group_name == this.nameField) &&
              !libraries.find(library => library.library_name == this.nameField);
        });
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateLibraryGroup(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The group has been updated."));
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-283
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-283"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The group cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.editing = false;
  }
}
