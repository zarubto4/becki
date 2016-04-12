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

import * as ng from "angular2/angular2";
import * as ngRouter from "angular2/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

function composeDateString(date:Date):string {
  "use strict";

  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1).toString()).slice(-2);
  let day = ("0" + date.getDate().toString()).slice(-2);
  return `${year}-${month}-${day}`;
}

function parseDateString(dateString:string):Date {
  "use strict";

  let dateStrings = /^(\d{4,})-(\d{2})-(\d{2})$/.exec(dateString);
  if (!dateStrings) {
    throw "invalid date format";
  }

  let year = parseInt(dateStrings[1]);
  let month = parseInt(dateStrings[2]) - 1;
  let day = parseInt(dateStrings[3]);
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw "date component not a number";
  }

  let date = new Date(year, month, day);
  if (year == 0 || date.getFullYear() != year || date.getMonth() != month || date.getDate() != day) {
    throw "component out of range";
  }

  return date;
}

class Selectable<T> {

  model:T;

  selected:boolean;

  select:boolean;

  constructor(model:T, selected:boolean) {
    "use strict";

    this.model = model;
    this.selected = selected;
    this.select = selected;
  }
}

@ng.Component({
  templateUrl: "app/user.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  id:string;

  userString:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  editing:boolean;

  editRoles:boolean;

  editPermissions:boolean;

  tab:string;

  viewRolesAndPermissions:boolean;

  firstNameField:string;

  middleNameField:string;

  lastNameField:string;

  usernameField:string;

  birthdateField:string;

  birthdateString:string;

  user:libBackEnd.User;

  roles:Selectable<libBackEnd.Role>[];

  permissions:Selectable<libBackEnd.Permission>[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("user");
    this.userString = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("Users", home.link),
      new libBeckiLayout.LabeledLink("Loading...", ["User", {user: this.id}])
    ];
    this.editing = false;
    this.editRoles = false;
    this.editPermissions = false;
    this.tab = 'account';
    this.viewRolesAndPermissions = false;
    this.firstNameField = "Loading...";
    this.middleNameField = "Loading...";
    this.lastNameField = "Loading...";
    this.usernameField = "Loading...";
    this.birthdateField = "";
    this.birthdateString = "Loading...";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.editing = false;
    this.backEnd.getUser(this.id)
        .then(user => {
          let birthdate = new Date(user.date_of_birth * 1000);
          this.userString = libBackEnd.composeUserString(user);
          this.breadcrumbs[2].label = libBackEnd.composeUserString(user);
          this.firstNameField = user.first_name;
          this.middleNameField = user.middle_name;
          this.lastNameField = user.last_name;
          this.usernameField = user.nick_name;
          this.birthdateField = composeDateString(birthdate);
          this.birthdateString = birthdate.toLocaleDateString();
          this.user = user;
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The user ${this.id} cannot be loaded.`, reason));
        });
    this.backEnd.getUserRolesAndPermissionsCurrent()
        .then(currentPermissions => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-192
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-192"));
          this.editRoles = libBackEnd.containsPermissions(currentPermissions, ["role.manager", "role.person"]);
          this.editPermissions = libBackEnd.containsPermissions(currentPermissions, ["permission.connect_with_person", "permission.disconnect_with_person"]);
          this.viewRolesAndPermissions = libBackEnd.containsPermissions(currentPermissions, ["permission.read", "role.manager"]);
          if (this.viewRolesAndPermissions) {
            return Promise.all<any>([
                  this.backEnd.getRoles(),
                  this.backEnd.getPermissions(),
                  this.backEnd.getUserRolesAndPermissions(this.id)
                ])
                .then(result => {
                  let roles:libBackEnd.Role[];
                  let permissions:libBackEnd.Permission[];
                  let userPermissions:libBackEnd.RolesAndPermissions;
                  [roles, permissions, userPermissions] = result;
                  this.roles = roles.map(role => new Selectable(role, userPermissions.roles.find(userRole => userRole.id == role.id) != undefined));
                  // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-191
                  this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-191"));
                  this.permissions = permissions.map(permission => new Selectable(permission, userPermissions.permissions.find(userPermission => userPermission.value == permission.value) != undefined));
                });
          } else {
            this.roles = [];
            this.permissions = [];
            if (["roles", "permissions"].indexOf(this.tab) >= 0) {
              this.tab = "account";
            }
          }
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`Permissions cannot be loaded.`, reason));
        });
  }

  onEditClick():void {
    "use strict";

    this.editing = !this.editing;
  }

  onTabClick(tab:string):void {
    "use strict";

    this.tab = tab;
  }

  validateAccountUsernameField():()=>Promise<boolean> {
    "use strict";

    return () => {
      if (this.usernameField) {
        return this.backEnd.getUsernameUsed(this.usernameField);
      } else {
        return Promise.resolve(true);
      }
    };
  }

  onAccountSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateUser(this.id, this.firstNameField, this.middleNameField, this.lastNameField, this.usernameField, parseDateString(this.birthdateField).getTime().toString(), this.user.first_title, this.user.last_title)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The user has been updated."));
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-189
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-189"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The user cannot be updated.", reason));
        });
  }

  onRolesSubmit():void {
    "use strict";

    this.notifications.shift();
    Promise.all(this.roles.filter(role => role.selected != role.select).map(role => {
          if (role.select) {
            return this.backEnd.addRoleToUser(role.model.id, this.id);
          } else {
            return this.backEnd.removeRoleFromUser(role.model.id, this.id);
          }
        }))
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The roles have been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The roles cannot be updated.", reason));
        });
  }

  onPermissionsSubmit():void {
    "use strict";

    this.notifications.shift();
    Promise.all(this.permissions.filter(permission => permission.selected != permission.select).map(permission => {
          if (permission.select) {
            return this.backEnd.addPermissionToUser(permission.model.value, this.id);
          } else {
            return this.backEnd.removePermissionFromUser(permission.model.value, this.id);
          }
        }))
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The permissions have been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The permissions cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.editing = false;
  }
}
