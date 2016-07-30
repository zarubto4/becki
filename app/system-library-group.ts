/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as Rx from "rxjs";
import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
  templateUrl: "app/system-library-group.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES]
})
export class Component implements ngCore.OnInit, ngCore.OnDestroy {

  id:string;

  group:libBackEnd.LibraryGroup;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  editing:boolean;

  nameField:string;

  descriptionField:string;

  activatedRoute:ngRouter.ActivatedRoute;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  routeParamsSubscription:Rx.Subscription;

  constructor(@ngCore.Inject("home") home:string, activatedRoute:ngRouter.ActivatedRoute, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service) {
    "use strict";

    this.breadcrumbs = [
      new libBeckiLayout.LabeledLink(home, ["/"]),
      new libBeckiLayout.LabeledLink("System", ["/system"]),
      new libBeckiLayout.LabeledLink("Library Groups", ["/system/library/groups"])
    ];
    this.editing = false;
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.activatedRoute = activatedRoute;
    this.backEnd = backEnd;
    this.notifications = notifications;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = params["group"];
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
    this.backEnd.getLibraryGroup(this.id)
        .then(group => {
          this.group = group;
          this.breadcrumbs.push(new libBeckiLayout.LabeledLink(group.group_name, ["/system/library/groups", this.id]));
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
    return () => Promise.all<any>([
          this.backEnd.getLibraries(1),
          this.backEnd.getLibraryGroups(1)
        ])
        .then(result => {
          let librariesPage:libBackEnd.LibrariesPage;
          let groupsPage:libBackEnd.LibraryGroupsPage;
          [librariesPage, groupsPage] = result;
          return Promise.all<any>([
            Promise.all(librariesPage.pages.map(number => this.backEnd.getLibraries(number))),
            Promise.all(groupsPage.pages.map(number => this.backEnd.getLibraryGroups(number)))
          ]);
        })
        .then(result => {
          let librariesPages:libBackEnd.LibrariesPage[];
          let groupsPages:libBackEnd.LibraryGroupsPage[];
          [librariesPages, groupsPages] = result;
          return ![].concat(...groupsPages.map(page => page.content)).find(group => group.id != this.id && group.group_name == this.nameField) &&
              ![].concat(...librariesPages.map(page => page.content)).find(library => library.library_name == this.nameField);
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
