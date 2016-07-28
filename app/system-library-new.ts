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
  templateUrl: "app/system-library-new.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngCommon.FORM_DIRECTIVES]
})
export class Component implements ngCore.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  nameField:string;

  descriptionField:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("System", ["System"]),
      new libBeckiLayout.LabeledLink("New Library", ["NewSystemLibrary"])
    ];
    this.nameField = "";
    this.descriptionField = "";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
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
          return ![].concat(...librariesPages.map(page => page.content)).find(library => library.library_name == this.nameField) &&
              ![].concat(...groupsPages.map(page => page.content)).find(group => group.group_name == this.nameField);
        });
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createLibrary(this.nameField, this.descriptionField)
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The library has been created."));
          this.router.navigate(["System"]);
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The library cannot be created.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["System"]);
  }
}
