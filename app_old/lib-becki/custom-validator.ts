/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCore from "@angular/core";

import * as notifications from "./notifications";

@ngCore.Directive({
  selector: "[customValidator]",
  host: {"(input)": "clear()", "(change)": "validate()", "(blur)": "validate()"}
})
export class Directive {

  @ngCore.Input("customValidator")
  customValidator:()=>Promise<boolean>;

  @ngCore.Input()
  message:string;

  field:ngCore.ElementRef;

  warned:boolean;

  notifications:notifications.Service;

  constructor(field:ngCore.ElementRef, notificationsService:notifications.Service) {
    "use strict";

    this.message = "Please fill out a valid value.";
    this.field = field;
    this.warned = false;
    this.notifications = notificationsService;
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
            this.notifications.current.push(new notifications.Success("Can validate a field again."));
          }
          this.warned = false;
          return valid;
        })
        .catch(reason => {
          if (!this.warned) {
            this.notifications.current.push(new notifications.Warning("Cannot validate a field.", reason));
          }
          this.warned = true;
          return true;
        })
        .then(valid => {
          this.field.nativeElement.setCustomValidity(valid ? "" : this.message);
        })
        .catch(reason => {
          this.notifications.current.push(new notifications.Danger("An unexpected error occurred during validating a field.", reason));
        });
  }
}
