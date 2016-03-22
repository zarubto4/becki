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
import * as customValidator from "./custom-validator";
import * as fieldInteractionsScheme from "./field-interactions-scheme";
import * as fieldIssueBody from "./field-issue-body";
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapDropdown from "./lib-bootstrap/dropdown";
import * as libPatternFlyListView from "./lib-patternfly/list-view";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

class Comment {

  id:string;

  body:string;

  date:string;

  likes:number;

  tags:string[];

  editing:boolean;

  removing:boolean;

  bodyField:string;

  constructor(id:string, body:string, date:string, likes:number, tags:string[]) {
    "use strict";

    this.id = id;
    this.body = body;
    this.date = date;
    this.likes = likes;
    this.tags = tags;
    this.editing = false;
    this.removing = false;
    this.bodyField = body;
  }
}

class Item {

  id:string;

  body:string;

  date:string;

  likes:number;

  comments:Comment[];

  tags:string[];

  editing:boolean;

  importing:boolean;

  removing:boolean;

  bodyField:string;

  commentField:string;

  interactionsProjectField:string;

  interactionsNameField:string;

  interactionsDescriptionField:string;

  interactionsSchemeField:string;

  constructor(id:string, body:string, date:string, likes:number, comments:Comment[], tags:string[]) {
    "use strict";

    this.id = id;
    this.body = body;
    this.date = date;
    this.likes = likes;
    this.comments = comments;
    this.tags = tags;
    this.editing = false;
    this.importing = false;
    this.removing = false;
    this.bodyField = body;
    this.commentField = "";
    this.interactionsProjectField = "";
    this.interactionsNameField = "";
    this.interactionsDescriptionField = "";
    this.interactionsSchemeField = fieldIssueBody.getInteractions(body);
  }
}

class Issue extends Item {

  typeField:string;

  titleField:string;

  constructor(id:string, type:string, title:string, body:string, date:string, likes:number, comments:Comment[], tags:string[]) {
    "use strict";

    super(id, body, date, likes, comments, tags);
    this.typeField = type;
    this.titleField = title;
  }
}

@ng.Component({
  templateUrl: "app/issue.html",
  directives: [
    customValidator.Directive,
    fieldInteractionsScheme.Component,
    fieldIssueBody.Component,
    layout.Component,
    libBootstrapDropdown.DIRECTIVES,
    libPatternFlyListView.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES,
    ngRouter.ROUTER_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:layout.LabeledLink[];

  types:libBackEnd.IssueType[];

  items:Item[];

  projects:libBackEnd.Project[];

  answerBodyField:string;

  related:libPatternFlyListView.Item[];

  tags:libPatternFlyListView.Item[];

  confirmations:libPatternFlyListView.Item[];

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("issue");
    this.heading = "Loading...";
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("Issues", ["Issues"]),
      new layout.LabeledLink(`Issue ${this.id}`, ["Issue", {issue: this.id}])
    ];
    this.answerBodyField = fieldIssueBody.EMPTY;
    this.backEnd = backEndService;
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

    this.backEnd.getIssue(this.id)
        .then(issue => {
          this.heading = `${issue.type.type}: ${issue.name}`;
          let commentsViews = issue.comments.map(comment => new Comment(comment.postId, comment.text_of_post, comment.date_of_create, comment.likes, comment.hashTags));
          this.items = [].concat(
              new Issue(issue.postId, issue.type.id, issue.name, issue.text_of_post, issue.date_of_create, issue.likes, commentsViews, issue.hashTags),
              issue.answers.map(answer => new Item(
                  answer.postId, answer.text_of_post, answer.date_of_create, answer.likes,
                  answer.comments.map(comment => new Comment(comment.postId, comment.text_of_post, comment.date_of_create, comment.likes, comment.hashTags)),
                  answer.hashTags
              ))
          );
          this.related = issue.linked_answers.map(related => new libPatternFlyListView.Item(related.linkId, related.answer.name, "", ["Issue", {issue: related.answer.postId}]));
          this.tags = issue.hashTags.map(tag => new libPatternFlyListView.Item(tag, tag, ""));
          this.confirmations = issue.type_of_confirms.map(confirmation => new libPatternFlyListView.Item(confirmation.id, confirmation.type, null));
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The issue ${this.id} cannot be loaded: ${reason}`));
        });
    this.backEnd.getIssueTypes()
        .then(types => this.types = types)
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Issue types cannot be loaded: ${reason}`)));
    this.backEnd.getProjects()
        .then(projects => this.projects = projects)
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Projects cannot be loaded: ${reason}`)));
  }

  onItemImportClick(item:Item):void {
    "use strict;"

    item.importing = true;
  }

  validateInteractionsSchemeName(name:string, projectId:string):()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProjectInteractionsSchemes(projectId).then(schemes => !schemes.find(scheme => scheme.name == name));
  }

  onItemImportingSubmit(item:Item):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createInteractionsScheme(item.interactionsNameField, item.interactionsDescriptionField, item.interactionsProjectField)
        .then(scheme => {
          return this.backEnd.addVersionToInteractionsScheme("The original", `Imported from issue ${this.id}`, item.interactionsSchemeField, scheme.b_program_id);
        })
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The scheme has been imported."));
          item.importing = false;
          item.interactionsNameField = "";
          item.interactionsDescriptionField = "";
          item.interactionsSchemeField = fieldIssueBody.getInteractions(item.body);
          item.interactionsProjectField = "";
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The scheme cannot be imported: ${reason}`));
        });
  }

  onItemImportingCancelClick(item:Item):void {
    "use strict";

    item.importing = false;
  }

  onItemEditClick(item:Item):void {
    "use strict";

    item.editing = true;
  }

  onItemEditingSubmit(item:Item):void {
    "use strict";

    this.notifications.shift();
    if (item instanceof Issue) {
      this.backEnd.updateIssue(item.id, item.typeField, item.titleField, item.bodyField, item.tags)
          .then(() => {
            this.notifications.current.push(new libPatternFlyNotifications.Success("The issue has been updated."));
            this.refresh();
          })
          .catch(reason => {
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-150
            this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-150"));
            this.notifications.current.push(new libPatternFlyNotifications.Danger(`The issue cannot be updated: ${reason}`));
          });
    } else {
      this.backEnd.updateAnswer(item.id, item.bodyField, item.tags)
          .then(() => {
            this.notifications.current.push(new libPatternFlyNotifications.Success("The answer has been updated."));
            this.refresh();
          })
          .catch(reason => {
            this.notifications.current.push(new libPatternFlyNotifications.Danger(`The answer cannot be updated: ${reason}`));
          });
    }
  }

  onItemEditingCancelClick(item:Item):void {
    "use strict";

    item.editing = false;
  }

  onMinusClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.subtractOneFromPost(id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The likes have been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The likes cannot be updated: ${reason}`));
        });
  }

  onPlusClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.addOneToPost(id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The likes have been updated."));
          this.refresh();
        })
        .catch((reason) => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The likes cannot be updated: ${reason}`));
        });
  }

  onItemRemoveClick(item:Item):void {
    "use strict";

    item.removing = true;
  }

  onItemRemovingYesClick(item:Item):void {
    "use strict";

    item.removing = false;
    this.notifications.shift();
    this.backEnd.deletePost(item.id)
        .then(() => {
          if (item instanceof Issue) {
            this.notifications.next.push(new libPatternFlyNotifications.Success("The issue has been removed."));
            this.router.navigate(["Issues"]);
          } else {
            this.notifications.current.push(new libPatternFlyNotifications.Success("The answer has been removed."));
            this.refresh();
          }
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The issue/answer cannot be removed: ${reason}`));
        });
  }

  onItemRemovingNoClick(item:Item):void {
    "use strict";

    item.removing = false;
  }

  onAnswerCreationSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createAnswer(this.id, this.answerBodyField, [])
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The answer has been created."));
          this.answerBodyField = fieldIssueBody.EMPTY;
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The answer cannot be created: ${reason}`));
        });
  }

  onCommentCreationSubmit(item:Item):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createComment(item.id, item.commentField, [])
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The comment has been created."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The comment cannot be created: ${reason}`));
        });
  }

  onCommentEditClick(comment:Comment):void {
    "use strict";

    comment.editing = true;
  }

  onCommentEditingSubmit(comment:Comment):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateComment(comment.id, comment.bodyField, comment.tags)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The comment has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The comment cannot be updated: ${reason}`));
        });
  }

  onCommentEditingCancelClick(comment:Comment):void {
    "use strict";

    comment.editing = false;
  }

  onCommentRemoveClick(comment:Comment):void {
    "use strict";

    comment.removing = true;
  }

  onCommentRemovingYesClick(comment:Comment):void {
    "use strict";

    comment.removing = false;
    this.notifications.shift();
    this.backEnd.deleteComment(comment.id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The comment has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The comment cannot be removed: ${reason}`));
        });
  }

  onCommentRemovingNoClick(comment:Comment):void {
    "use strict";

    comment.removing = false;
  }

  onRelatedAddClick():void {
    "use strict";

    this.router.navigate(["NewRelatedIssue", {issue: this.id}]);
  }

  onRelatedRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteIssueLink(id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The issue has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The issue cannot be removed: ${reason}`));
        });
  }

  onTagAddClick():void {
    "use strict";

    this.router.navigate(["NewIssueTag", {issue: this.id}]);
  }

  onTagRemoveClick(tag:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.removeTagFromPost(tag, this.id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The tag has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The tag cannot be removed: ${reason}`));
        });
  }

  onConfirmationAddClick():void {
    "use strict";

    this.router.navigate(["NewIssueConfirmation", {issue: this.id}]);
  }

  onConfirmationRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.removeConfirmationFromPost(id, this.id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The confirmation has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The confirmation cannot be removed: ${reason}`));
        });
  }
}
