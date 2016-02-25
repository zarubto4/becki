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

import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Directive({
  selector: "[custom-validator]",
  host: {"(input)": "clear()", "(change)": "validate()", "(blur)": "validate()"}
})
export class Directive {

  @ng.Input()
  customValidator:()=>Promise<boolean>;

  @ng.Input()
  message:string;

  field:ng.ElementRef;

  warned:boolean;

  notifications:libPatternFlyNotifications.Service;

  constructor(field:ng.ElementRef, notifications:libPatternFlyNotifications.Service) {
    "use strict";

    this.message = "Please fill out a valid value.";
    this.field = field;
    this.warned = false;
    this.notifications = notifications;
  }

  clear():void {
    "use strict";

    this.field.nativeElement.setCustomValidity("");
  }

  validate():void {
    "use strict";

    this.customValidator()
        .then(valid => {
          if (this.warned) {
            this.notifications.current.push(new libPatternFlyNotifications.Success("Can validate a field again."));
          }
          this.warned = false;
          return valid;
        })
        .catch(reason => {
          if (!this.warned) {
            this.notifications.current.push(new libPatternFlyNotifications.Warning(`Cannot validate a field: ${reason}`));
          }
          this.warned = true;
          return false;
        })
        .then(valid => {
          this.field.nativeElement.setCustomValidity(valid ? "" : this.message);
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`An unexpected error occurred during validating a field: ${reason}`));
        });
  }
}
