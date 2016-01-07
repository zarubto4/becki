/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
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

import * as backEnd from "./back-end";
import * as becki from "./index";
import * as events from "./events";
import * as form from "./form";
import * as libAdminlteFields from "./lib-adminlte/fields";
import * as libAdminlteWrapper from "./lib-adminlte/wrapper";
import * as libBackEnd from "./lib-back-end/index";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/lib-adminlte/wrapper-issue.html",
  directives: [form.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:libAdminlteWrapper.LabeledLink[];

  itemEditing:{[id:string]: {active:boolean, fields:libAdminlteFields.Field[]}};

  items:Array<libBackEnd.Issue|libBackEnd.Answer>;

  answerCreation:libAdminlteFields.Field[];

  commentCreation:{[id:string]: {active:boolean, fields:libAdminlteFields.Field[]}};

  commentEditing:{[id:string]: {active:boolean, fields:libAdminlteFields.Field[]}};

  linkCreation:libAdminlteFields.Field[];

  linkDeletion:libAdminlteFields.Field[];

  confirmationAddition:libAdminlteFields.Field[];

  confirmationRemoval:libAdminlteFields.Field[];

  backEnd:backEnd.Service;

  events:events.Service;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, eventsService:events.Service) {
    "use strict";

    this.id = routeParams.get("issue");
    this.heading = "Loading...";
    this.breadcrumbs = [
      becki.HOME,
      new libAdminlteWrapper.LabeledLink("Issues", ["Issues"]),
      new libAdminlteWrapper.LabeledLink(`Issue ${this.id}`, ["Issue", {issue: this.id}])
    ];
    this.backEnd = backEndService;
    this.events = eventsService;
  }

  onInit():void {
    "use strict";

    this.refresh();
  }

  refresh():void {
    "use strict";

    this.backEnd.getIssue(this.id)
        .then((issue) => {
          this.events.send(issue);
          this.heading = `${issue.type}: ${issue.name}`;
          this.itemEditing = {};
          this.itemEditing[issue.postId] = {
            active: false,
            fields: [
              new libAdminlteFields.Field("Type:", issue.type),
              new libAdminlteFields.Field("Title:", issue.name),
              new libAdminlteFields.Field("Body:", issue.textOfPost),
              new libAdminlteFields.Field("Tags:", issue.hashTags.join(","))
            ]
          };
          this.commentCreation = {};
          this.commentCreation[issue.postId] = {
            active: false,
            fields: [new libAdminlteFields.Field("Body:", "")]
          };
          this.commentEditing = {};
          issue.comments.forEach(comment => {
            this.commentEditing[comment.postId] = {
              active: false,
              fields: [
                new libAdminlteFields.Field("Body:", comment.textOfPost),
                new libAdminlteFields.Field("Tags:", comment.hashTags ? comment.hashTags.join(",") : "")
              ]
            };
          });
          issue.answers.forEach(answer => {
            this.itemEditing[answer.postId] = {
              active: false,
              fields: [
                new libAdminlteFields.Field("Body:", answer.textOfPost),
                new libAdminlteFields.Field("Tags:", answer.hashTags ? answer.hashTags.join(",") : "")
              ]
            };
            this.commentCreation[answer.postId] = {
              active: false,
              fields: [new libAdminlteFields.Field("Body:", "")]
            };
            answer.comments.forEach(comment => {
              this.commentEditing[comment.postId] = {
                active: false,
                fields: [
                  new libAdminlteFields.Field("Body:", comment.textOfPost),
                  new libAdminlteFields.Field("Tags:", comment.hashTags ? comment.hashTags.join(",") : "")
                ]
              };
            });
          });
          this.items = [].concat([issue], issue.answers);
          this.answerCreation = [new libAdminlteFields.Field("Body:", "")];
          this.linkCreation = [new libAdminlteFields.Field("ID:", "")];
          this.linkDeletion = [new libAdminlteFields.Field("ID:", "", "select", (issue.linkedAnswers || []).map(issue2 => new libAdminlteFields.Option(issue2.name, issue2.linkId)))];
          this.confirmationAddition = [new libAdminlteFields.Field("Text:", "")];
          this.confirmationRemoval = [new libAdminlteFields.Field("Text:", "")];
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  getLink(issue:string):any[] {
    "use strict";

    return ["Issue", {issue}];
  }

  onItemEditClick(id:string):void {
    "use strict";

    this.itemEditing[id].active = true;
  }

  onItemEditingSubmit(id:string):void {
    "use strict";

    switch (id) {
      case this.id:
        this.backEnd.updateIssue(this.id, this.itemEditing[this.id].fields[0].model, this.itemEditing[this.id].fields[1].model, this.itemEditing[this.id].fields[2].model, this.itemEditing[this.id].fields[3].model.split(","))
            .then((message) => {
              this.events.send(message);
              this.refresh();
            })
            .catch((reason) => {
              this.events.send(reason);
            });
        break;
      default:
        this.backEnd.updateAnswer(id, this.itemEditing[id].fields[0].model, this.itemEditing[id].fields[1].model.split(","))
            .then((message) => {
              this.events.send(message);
              this.refresh();
            })
            .catch((reason) => {
              this.events.send(reason);
            });
    }
  }

  onItemEditingCancel(id:string):void {
    "use strict";

    this.itemEditing[id].active = false;
  }

  onMinusClick(id:string):void {
    "use strict";

    this.backEnd.subtractOneFromPost(id)
        .then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onPlusClick(id:string):void {
    "use strict";

    this.backEnd.addOneToPost(id)
        .then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onItemCommentClick(id:string):void {
    "use strict";

    this.commentCreation[id].active = true;
  }

  onItemRemoveClick(id:string):void {
    "use strict";

    switch (id) {
      case this.id:
        this.backEnd.deleteIssue(this.id)
            .then((message) => {
              this.events.send(message);
              this.refresh();
            })
            .catch((reason) => {
              this.events.send(reason);
            });
        break;
      default:
        this.backEnd.deleteAnswer(id)
            .then((message) => {
              this.events.send(message);
              this.refresh();
            })
            .catch((reason) => {
              this.events.send(reason);
            });
    }
  }

  onAnswerCreationSubmit():void {
    "use strict";

    this.backEnd.createAnswer(this.id, this.answerCreation[0].model)
        .then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onCommentCreationSubmit(id:string):void {
    "use strict";

    this.backEnd.createComment(id, this.commentCreation[id].fields[0].model)
        .then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onCommentCreationCancel(id:string):void {
    "use strict";

    this.commentCreation[id].active = false;
  }


  onCommentEditClick(id:string):void {
    "use strict";

    this.commentEditing[id].active = true;
  }

  onCommentEditingSubmit(id:string):void {
    "use strict";

    this.backEnd.updateComment(id, this.commentEditing[id].fields[0].model, this.commentEditing[id].fields[1].model.split(","))
        .then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onCommentEditingCancel(id:string):void {
    "use strict";

    this.commentEditing[id].active = false;
  }

  onCommentRemoveClick(id:string):void {
    "use strict";

    this.backEnd.deleteComment(id)
        .then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onLinkCreationSubmit():void {
    "use strict";

    this.backEnd.createIssueLink(this.id, this.linkCreation[0].model)
        .then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onLinkDeletionSubmit():void {
    "use strict";

    this.backEnd.deleteIssueLink(this.linkDeletion[0].model)
        .then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onConfirmationAdditionSubmit():void {
    "use strict";

    this.backEnd.addConfirmationToPost(this.id, this.confirmationAddition[0].model)
        .then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onConfirmationRemovalSubmit():void {
    this.backEnd.removeConfirmationFromPost(this.id, this.confirmationRemoval[0].model)
        .then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }
}
