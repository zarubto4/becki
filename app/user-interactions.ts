/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

class SelectableInteractionsModeratorItem extends libPatternFlyListView.Item {

  project:string;

  online:boolean;

  selected:boolean;

  constructor(moderator:libBackEnd.InteractionsModerator, project:libBackEnd.Project) {
    "use strict";

    super(moderator.id, moderator.id, moderator.type_of_device, null, moderator.update_permission && project.update_permission);
    this.project = project.id;
    this.online = moderator.online;
    this.selected = false;
  }
}

@ngCore.Component({
  templateUrl: "app/user-interactions.html",
  directives: [libBeckiLayout.Component, libPatternFlyListView.Component, ngCommon.CORE_DIRECTIVES],
})
export class Component implements ngCore.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  tab:string;

  schemes:libPatternFlyListView.Item[];

  blocks:libPatternFlyListView.Item[];

  uploadSchemes:libBackEnd.InteractionsScheme[];

  BlockGroups:libPatternFlyListView.Item[];

  uploadSchemeField:string;

  uploadVersionField:string;

  moderators:SelectableInteractionsModeratorItem[];

  spies:libPatternFlyListView.Item[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ngCore.Inject("home") home:string, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      new libBeckiLayout.LabeledLink(home, ["/"]),
      new libBeckiLayout.LabeledLink("User", ["/user"]),
      new libBeckiLayout.LabeledLink("Interactions", ["/user/interactions"])
    ];
    this.tab = 'schemes';
    this.uploadSchemeField = "";
    this.uploadVersionField = "";
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

    this.backEnd.getProjects()
        .then(projects => {
          return Promise.all<any>([
            // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
            Promise.all([].concat(...projects.map(project => project.b_programs_id)).map(id => this.backEnd.getB_Program(id))),
            Promise.all([].concat(...projects.map(project => project.type_of_blocks_id)).map(id => this.backEnd.getTypeOfBlock(id))),
            // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
            Promise.all([].concat(...projects.map(project => project.homers_id.map(id => [id, project]))).map(pair => Promise.all<any>([this.backEnd.getHomer(pair[0]), pair[1]])))
          ]);
        })
        .then(result => {
          let schemes:libBackEnd.InteractionsScheme[];
          let groups:libBackEnd.TypeOfBlock[];
          let moderators:[libBackEnd.InteractionsModerator, libBackEnd.Project][];
          [schemes, groups, moderators] = result;
          this.schemes = schemes.map(scheme => new libPatternFlyListView.Item(scheme.id, scheme.name, scheme.program_description, ["/user/interactions/schemes", scheme.id], scheme.delete_permission));
          this.blocks = [].concat(...groups.map(group => group.blockoBlocks)).map(block => new libPatternFlyListView.Item(block.id, block.name, block.general_description, ["/user/interactions/blocks", block.id], block.delete_permission));
          this.uploadSchemes = schemes.filter(scheme => scheme.update_permission);
          this.moderators = moderators.map(pair => new SelectableInteractionsModeratorItem(pair[0], pair[1]));
          this.BlockGroups = groups.map(group => new libPatternFlyListView.Item(group.id, group.name, group.general_description, ["/user/interactions/block/groups", group.id], group.delete_permission));
          this.spies = schemes.filter(scheme => scheme.program_state.uploaded).map(scheme => new libPatternFlyListView.Item(scheme.id, scheme.name, scheme.program_versions.find(version => version.version_Object.id == scheme.program_state.version_id).version_Object.version_name, ["/user/interactions/spies", scheme.id], false));
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("Interactions cannot be loaded.", reason));
        });
  }

  onAddClick():void {
    "use strict";

    switch (this.tab) {
      case "schemes":
        this.onAddSchemeClick();
        break;
      case "blocks":
        this.onAddBlockClick();
        break;
      case "moderators":
        this.onAddModeratorClick();
        break;
      case "BlockGroups":
        this.onAddBlockGroupsClick();
        break;

    }
  }


  onAddBlockGroupsClick():void {
    "use strict";

    this.router.navigate(["/user/interactions/block/group/new"]);
  }


  onAddSchemeClick():void {
    "use strict";

    this.router.navigate(["/user/interactions/scheme/new"]);
  }

  onAddBlockClick():void {
    "use strict";

    this.router.navigate(["/user/interactions/block/new"]);
  }

  onAddModeratorClick():void {
    "use strict";

    this.router.navigate(["/user/interactions/moderator/new"]);
  }

  onTabClick(tab:string):void {
    "use strict";

    this.tab = tab;
  }

  onRemoveSchemeClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteB_Program(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The scheme has been removed."));
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-185
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-185"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The scheme cannot be removed.", reason));
        });
  }

  onRemoveBlockClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteBlockoBlock(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The block has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The block cannot be removed.", reason));
        });
  }

  getUploadVersions():libBackEnd.Version[] {
    "use strict";

    let scheme = this.uploadSchemes.find(scheme => scheme.id == this.uploadSchemeField);
    return scheme ? scheme.program_versions.map(version => version.version_Object) : [];
  }

  onUploadSchemeFieldChange():void {
    "use strict";

    let versions = this.getUploadVersions();
    this.uploadVersionField = versions.length ? versions[0].id : "";
  }

  onUploadSubmit():void {
    "use strict";

    let moderators = this.moderators.filter(moderator => moderator.selected).map(moderator => moderator.id);
    if (!moderators.length) {
      return;
    }

    this.notifications.shift();
    Promise.all(moderators.map(id => this.backEnd.uploadB_ProgramToHomer(this.uploadVersionField, id, this.uploadSchemeField)))
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The scheme has been uploaded."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The scheme cannot be uploaded.", reason));
        });
  }

  onRemoveBlockGroupsClick(id:string):void {
    "use strict";

    this.notifications.shift();
    let moderator = this.BlockGroups.find(moderator => moderator.id == id);
    this.backEnd.removeTypeOfBlock(moderator.id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The Block Group has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The Block Group cannot be removed.", reason));
        })
  }
  
  onRemoveModeratorClick(id:string):void {
    "use strict";

    this.notifications.shift();
    let moderator = this.moderators.find(moderator => moderator.id == id);
    this.backEnd.removeInteractionsModeratorFromProject(moderator.id, moderator.project)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The moderator has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The moderator cannot be removed.", reason));
        });
  }
}
