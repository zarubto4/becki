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

class Selectable<T> {

  model:T;

  selected:boolean;

  select:boolean;

  selectable:boolean;

  constructor(model:T, selected:boolean, selectable = true) {
    "use strict";

    this.model = model;
    this.selected = selected;
    this.select = selected;
    this.selectable = selectable;
  }
}

@ngCore.Component({
  templateUrl: "app/user.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES, ngCommon.FORM_DIRECTIVES]
})
export class Component implements ngCore.OnInit {

  id:string;

  userString:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  editing:boolean;

  tab:string;

  editAccount:boolean;

  nameField:string;

  usernameField:string;

  user:libBackEnd.User;

  roles:Selectable<libBackEnd.Role>[];

  permissions:Selectable<libBackEnd.Permission>[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("user");
    this.userString = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("Users", home.link),
      new libBeckiLayout.LabeledLink("Loading...", ["User", {user: this.id}])
    ];
    this.editing = false;
    this.tab = 'account';
    this.editAccount = false;
    this.nameField = "Loading...";
    this.usernameField = "Loading...";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.editing = false;
    this.backEnd.getUser(this.id)
        .then(user => {
          this.userString = libBackEnd.composeUserString(user, true);
          this.breadcrumbs[2].label = libBackEnd.composeUserString(user, true);
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-249
          this.editAccount = true;
          this.nameField = user.full_name;
          this.usernameField = user.nick_name;
          this.user = user;
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The user ${this.id} cannot be loaded.`, reason));
        });
    Promise.all<any>([
          this.backEnd.getRoles(),
          this.backEnd.getPermissions(),
          this.backEnd.getUserRolesAndPermissions(this.id)
        ])
        .then(result => {
          let roles:libBackEnd.Role[];
          let permissions:libBackEnd.Permission[];
          let userPermissions:libBackEnd.RolesAndPermissions;
          [roles, permissions, userPermissions] = result;
          this.roles = roles.map(role => new Selectable(role, userPermissions.roles.find(userRole => userRole.id == role.id) != undefined, role.update_permission));
          this.permissions = permissions.map(permission => new Selectable(permission, userPermissions.permissions.find(userPermission => userPermission.value == permission.value) != undefined, permission.edit_person_permission));
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
    this.backEnd.updateUser(this.id, this.nameField, this.usernameField, "", this.user.last_title)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The user has been updated."));
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-249
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-249"));
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
