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

import * as libBackEnd from "./lib-back-end/index";
import * as libBecki from "./lib-becki/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiFieldInteractionsScheme from "./lib-becki/field-interactions-scheme";
import * as libBeckiFieldIssueBody from "./lib-becki/field-issue-body";
import * as libBeckiFieldIssueTags from "./lib-becki/field-issue-tags";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libBootstrapDropdown from "./lib-bootstrap/dropdown";

class RemovableIssueLink {

  model:libBackEnd.IssueLink;

  removing:boolean;

  get targetLink():any[] {
    "use strict";

    return ["Issue", {issue: this.model.answer.postId}];
  }

  constructor(model:libBackEnd.IssueLink) {
    "use strict";

    this.model = model;
    this.removing = false;
  }
}

class Comment {

  id:string;

  body:string;

  author:string;

  date:string;

  likes:number;

  tags:string[];

  editing:boolean;

  removing:boolean;

  bodyField:string;

  constructor(comment:libBackEnd.Comment) {
    "use strict";

    this.id = comment.postId;
    this.body = comment.text_of_post;
    this.author = libBackEnd.composeUserString(comment.author);
    this.date = libBecki.timestampToString(comment.date_of_create);
    this.likes = comment.likes;
    this.tags = comment.hashTags;
    this.editing = false;
    this.removing = false;
    this.bodyField = comment.text_of_post;
  }
}

class Item {

  id:string;

  body:string;

  author:string;

  date:string;

  likes:number;

  comments:Comment[];

  tags:string[];

  editing:boolean;

  tagsEditable:boolean;

  importing:boolean;

  removing:boolean;

  bodyField:string;

  commentField:string;

  tagsField:string;

  interactionsProjectField:string;

  interactionsNameField:string;

  interactionsDescriptionField:string;

  interactionsSchemeField:string;

  markable:boolean;

  confirmable:boolean;

  constructor(item:libBackEnd.Issue|libBackEnd.Answer) {
    "use strict";

    this.id = item.postId;
    this.body = item.text_of_post;
    this.author = libBackEnd.composeUserString(item.author);
    this.date = libBecki.timestampToString(item.date_of_create);
    this.likes = item.likes;
    this.comments = item.comments.map(comment => new Comment(comment));
    this.tags = item.hashTags;
    this.editing = false;
    this.tagsEditable = false;
    this.importing = false;
    this.removing = false;
    this.bodyField = item.text_of_post;
    this.commentField = "";
    this.tagsField = item.hashTags.join(",");
    this.interactionsProjectField = "";
    this.interactionsNameField = "";
    this.interactionsDescriptionField = "";
    this.interactionsSchemeField = libBeckiFieldIssueBody.getInteractions(item.text_of_post);
    this.markable = false;
    this.confirmable = false;
  }
}

class Issue extends Item {

  typeField:string;

  titleField:string;

  constructor(issue:libBackEnd.Issue, confirmable = true) {
    "use strict";

    super(issue);
    this.tagsEditable = true;
    this.typeField = issue.type.id;
    this.titleField = issue.name;
    this.markable = true;
    this.confirmable = confirmable;
  }
}

@ng.Component({
  templateUrl: "app/issue.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiFieldInteractionsScheme.Component,
    libBeckiFieldIssueBody.Component,
    libBeckiFieldIssueTags.Component,
    libBeckiLayout.Component,
    libBootstrapDropdown.DIRECTIVES,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES,
    ngRouter.ROUTER_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  confirmationToRemove:libBackEnd.IssueConfirmation;

  confirmations:libBackEnd.IssueConfirmation[];

  related:RemovableIssueLink[];

  types:libBackEnd.IssueType[];

  items:Item[];

  projects:libBackEnd.Project[];

  answerBodyField:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("issue");
    this.heading = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("Issues", ["Issues"]),
      new libBeckiLayout.LabeledLink("Loading...", ["Issue", {issue: this.id}])
    ];
    this.confirmationToRemove = null;
    this.answerBodyField = libBeckiFieldIssueBody.EMPTY;
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

    this.backEnd.getIssue(this.id)
        .then(issue => {
          this.heading = `${issue.type.type}: ${issue.name}`;
          this.breadcrumbs[2].label = issue.name;
          this.confirmations = issue.type_of_confirms;
          this.related = issue.linked_answers.map(link => new RemovableIssueLink(link));
          this.items = [].concat(new Issue(issue), issue.answers.map(answer => new Item(answer)));
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The issue ${this.id} cannot be loaded.`, reason));
        });
    this.backEnd.getIssueTypes()
        .then(types => this.types = types)
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Issue types cannot be loaded.", reason)));
    this.backEnd.getProjects()
        .then(projects => this.projects = projects.filter(project => project.update_permission))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Projects cannot be loaded.", reason)));
  }

  onConfirmationRemoveClick(confirmation:libBackEnd.IssueConfirmation):void {
    "use strict";

    this.confirmationToRemove = confirmation;
  }

  onConfirmationRemoveYesClick():void {
    "use strict";

    let confirmation = this.confirmationToRemove;
    this.confirmationToRemove = null;
    this.notifications.shift();
    this.backEnd.removeConfirmationFromPost(confirmation.id, this.id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The confirmation has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The confirmation cannot be removed.", reason));
        });
  }

  onConfirmationRemoveNoClick():void {
    "use strict";

    this.confirmationToRemove = null;
  }

  onRelatedRemoveClick(link:RemovableIssueLink):void {
    "use strict";

    link.removing = true;
  }

  onRelatedRemovingYesClick(link:RemovableIssueLink):void {
    "use strict";

    link.removing = false;
    this.notifications.shift();
    this.backEnd.deleteIssueLink(link.model.linkId)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The issue has been unmarked as related."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The issue cannot be unmarked as related.", reason));
        });
  }

  onRelatedRemovingNoClick(link:RemovableIssueLink):void {
    "use strict";

    link.removing = false;
  }

  onItemImportClick(item:Item):void {
    "use strict;"

    item.importing = true;
  }

  validateInteractionsSchemeName(name:string, projectId:string):()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProject(projectId)
        .then(project => Promise.all(project.b_programs_id.map(id => this.backEnd.getInteractionsScheme(id))))
        .then(schemes => !schemes.find(scheme => scheme.name == name));
  }

  onItemImportingSubmit(item:Item):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createInteractionsScheme(item.interactionsNameField, item.interactionsDescriptionField, item.interactionsProjectField)
        .then(scheme => {
          return this.backEnd.addVersionToInteractionsScheme("The original", `Imported from issue ${this.id}`, item.interactionsSchemeField, scheme.id);
        })
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The scheme has been imported."));
          item.importing = false;
          item.interactionsNameField = "";
          item.interactionsDescriptionField = "";
          item.interactionsSchemeField = libBeckiFieldIssueBody.getInteractions(item.body);
          item.interactionsProjectField = "";
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The scheme cannot be imported.", reason));
        });
  }

  onItemImportingCancelClick(item:Item):void {
    "use strict";

    item.importing = false;
  }

  onItemMarkClick(item:Item):void {
    "use strict";

    this.router.navigate(["NewRelatedIssue", {issue: item.id}]);
  }

  onItemConfirmationAddClick(item:Item):void {
    "use strict";

    this.router.navigate(["NewIssueConfirmation", {issue: item.id}]);
  }

  onItemEditClick(item:Item):void {
    "use strict";

    item.editing = true;
  }

  onItemEditingSubmit(item:Item):void {
    "use strict";

    this.notifications.shift();
    let tags = libBeckiFieldIssueTags.parseTags(item.tagsField);
    if (item instanceof Issue) {
      this.backEnd.updateIssue(item.id, item.typeField, item.titleField, item.bodyField, tags)
          .then(() => {
            this.notifications.current.push(new libBeckiNotifications.Success("The issue has been updated."));
            this.refresh();
          })
          .catch(reason => {
            this.notifications.current.push(new libBeckiNotifications.Danger("The issue cannot be updated.", reason));
          });
    } else {
      this.backEnd.updateAnswer(item.id, item.bodyField, tags)
          .then(() => {
            this.notifications.current.push(new libBeckiNotifications.Success("The answer has been updated."));
            this.refresh();
          })
          .catch(reason => {
            this.notifications.current.push(new libBeckiNotifications.Danger("The answer cannot be updated.", reason));
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
          this.notifications.current.push(new libBeckiNotifications.Success("The likes have been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The likes cannot be updated.", reason));
        });
  }

  onPlusClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.addOneToPost(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The likes have been updated."));
          this.refresh();
        })
        .catch((reason) => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The likes cannot be updated.", reason));
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
            this.notifications.next.push(new libBeckiNotifications.Success("The issue has been removed."));
            this.router.navigate(["Issues"]);
          } else {
            this.notifications.current.push(new libBeckiNotifications.Success("The answer has been removed."));
            this.refresh();
          }
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The issue/answer cannot be removed.", reason));
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
          this.notifications.current.push(new libBeckiNotifications.Success("The answer has been created."));
          this.answerBodyField = libBeckiFieldIssueBody.EMPTY;
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The answer cannot be created.", reason));
        });
  }

  onCommentCreationSubmit(item:Item):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createComment(item.id, item.commentField, [])
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The comment has been created."));
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-184
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-184"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The comment cannot be created.", reason));
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
          this.notifications.current.push(new libBeckiNotifications.Success("The comment has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The comment cannot be updated.", reason));
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
          this.notifications.current.push(new libBeckiNotifications.Success("The comment has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The comment cannot be removed.", reason));
        });
  }

  onCommentRemovingNoClick(comment:Comment):void {
    "use strict";

    comment.removing = false;
  }
}
