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
import * as fieldHomerProgram from "./field-homer-program";
import * as fieldIssueBody from "./field-issue-body";
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapPanelList from "./lib-bootstrap/panel-list";
import * as wrapper from "./wrapper";

class Comment {

  id:string;

  body:string;

  date:number;

  likes:number;

  tags:string[];

  editing:boolean;

  bodyField:string;

  constructor(id:string, body:string, date:number, likes:number, tags?:string[]) {
    "use strict";

    this.id = id;
    this.body = body;
    this.date = date;
    this.likes = likes;
    this.tags = tags;
    this.editing = false;
    this.bodyField = body;
  }
}

class Item {

  id:string;

  body:string;

  date:number;

  likes:number;

  comments:Comment[];

  tags:string[];

  editing:boolean;

  importing:boolean;

  bodyField:string;

  commentField:string;

  programProjectField:string;

  programNameField:string;

  programDescriptionField:string;

  programCodeField:string;

  constructor(id:string, body:string, date:number, likes:number, comments:Comment[], tags?:string[]) {
    "use strict";

    this.id = id;
    this.body = body;
    this.date = date;
    this.likes = likes;
    this.comments = comments;
    this.tags = tags;
    this.editing = false;
    this.importing = false;
    this.bodyField = body;
    this.commentField = "";
    this.programProjectField = "";
    this.programNameField = "";
    this.programDescriptionField = "";
    this.programCodeField = fieldIssueBody.getHomer(body);
  }
}

class Issue extends Item {

  typeField:string;

  titleField:string;

  constructor(id:string, type:string, title:string, body:string, date:number, likes:number, comments:Comment[], tags?:string[]) {
    "use strict";

    super(id, body, date, likes, comments, tags);
    this.typeField = type;
    this.titleField = title;
  }
}

@ng.Component({
  templateUrl: "app/issue.html",
  directives: [
    fieldHomerProgram.Component,
    fieldIssueBody.Component,
    libBootstrapPanelList.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES,
    ngRouter.ROUTER_DIRECTIVES,
    wrapper.Component
  ]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  types:libBackEnd.IssueType[];

  items:Item[];

  projects:libBackEnd.Project[];

  answerBodyField:string;

  related:libBootstrapPanelList.Item[];

  tags:libBootstrapPanelList.Item[];

  confirmations:libBootstrapPanelList.Item[];

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("issue");
    this.heading = "Loading...";
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Issues", ["Issues"]),
      new wrapper.LabeledLink(`Issue ${this.id}`, ["Issue", {issue: this.id}])
    ];
    this.answerBodyField = fieldIssueBody.EMPTY;
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.refresh();
  }

  refresh():void {
    "use strict";

    Promise.all<any>([
          this.backEnd.getIssueTypes(),
          this.backEnd.getIssue(this.id)
        ])
        .then(result => {
          this.events.send(result);
          let issue:libBackEnd.Issue;
          [this.types, issue] = result;
          return Promise.all<any>([
            issue,
            this.backEnd.request("GET", issue.textOfPost),
            issue.comments ? this.backEnd.request("GET", issue.comments) : [],
            this.backEnd.request<libBackEnd.Answer[]>("GET", issue.answers).then(answers => Promise.all(answers.map(answer => Promise.all([answer, answer.comments ? this.backEnd.request("GET", answer.comments) : []])))),
            issue.linkedAnswers ? this.backEnd.request<libBackEnd.IssueLink[]>("GET", issue.linkedAnswers).then(related => Promise.all(related.map(related2 => Promise.all([related2, this.backEnd.request("GET", related2.post)])))) : []
          ]);
        })
        .then(result => {
          this.events.send(result);
          let issue:libBackEnd.Issue;
          let body:string;
          let comments:libBackEnd.Comment[];
          let answers:[libBackEnd.Answer, libBackEnd.Comment[]][];
          let related:[libBackEnd.IssueLink, libBackEnd.Issue][];
          [issue, body, comments, answers, related] = result;
          this.heading = `${issue.type}: ${issue.name}`;
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-61
          let type = this.types.filter(type => type.type == issue.type)[0].id;
          let commentsViews = comments.map(comment => new Comment(comment.postId, comment.textOfPost, comment.dateOfCreate, comment.likes, comment.hashTags));
          this.items = [].concat(
              new Issue(issue.postId, type, issue.name, body, issue.dateOfCreate, issue.likes, commentsViews, issue.hashTags),
              answers.map(answer => new Item(
                  answer[0].postId, answer[0].textOfPost, answer[0].dateOfCreate, answer[0].likes,
                  answer[1].map(comment => new Comment(comment.postId, comment.textOfPost, comment.dateOfCreate, comment.likes)),
                  answer[0].hashTags
              ))
          );
          this.related = related.map(related2 => new libBootstrapPanelList.Item(related2[0].name, "", ["Issue", {issue: related2[1].postId}]));
          this.tags = issue.hashTags ? issue.hashTags.map(tag => new libBootstrapPanelList.Item(tag, "")) : [];
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-86
          this.confirmations = [new libBootstrapPanelList.Item("(issue/TYRION-86)", "does not work")];
        })
        .catch(reason => {
          this.events.send(reason);
        });
    this.backEnd.getProjects()
        .then(projects => {
          this.events.send(projects);
          this.projects = projects;
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onItemImportClick(item:Item):void {
    "use strict;"

    item.importing = true;
  }

  onItemImportingSubmit(item:Item):void {
    "use strict";

    this.backEnd.createHomerProgram(item.programNameField, item.programDescriptionField, item.programCodeField, item.programProjectField)
        .then(message => {
          this.events.send(message);
          item.importing = false;
          item.programNameField = "";
          item.programDescriptionField = "";
          item.programCodeField = fieldIssueBody.getHomer(item.body);
          item.programProjectField = "";
        })
        .catch(reason => {
          this.events.send(reason);
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

    if (item instanceof Issue) {
      this.backEnd.updateIssue(item.id, item.typeField, item.titleField, item.bodyField, item.tags || [])
          .then((message) => {
            this.events.send(message);
            this.refresh();
          })
          .catch((reason) => {
            this.events.send(reason);
          });
    } else {
      this.backEnd.updateAnswer(item.id, item.bodyField, item.tags || [])
          .then((message) => {
            this.events.send(message);
            this.refresh();
          })
          .catch((reason) => {
            this.events.send(reason);
          });
    }
  }

  onItemEditingCancelClick(item:Item):void {
    "use strict";

    item.editing = false;
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

  onItemRemoveClick(item:Item):void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-79
    if (item instanceof Issue) {
      this.backEnd.deleteIssue(item.id)
          .then((message) => {
            this.events.send(message);
            this.router.navigate(["Issues"]);
          })
          .catch((reason) => {
            this.events.send(reason);
          });
    } else {
      this.backEnd.deleteAnswer(item.id)
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

    this.backEnd.createAnswer(this.id, this.answerBodyField)
        .then((message) => {
          this.events.send(message);
          this.answerBodyField = fieldIssueBody.EMPTY;
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onCommentCreationSubmit(item:Item):void {
    "use strict";

    this.backEnd.createComment(item.id, item.commentField)
        .then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onCommentEditClick(comment:Comment):void {
    "use strict";

    comment.editing = true;
  }

  onCommentEditingSubmit(comment:Comment):void {
    "use strict";

    this.backEnd.updateComment(comment.id, comment.bodyField, comment.tags || [])
        .then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onCommentEditingCancelClick(comment:Comment):void {
    "use strict";

    comment.editing = false;
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

  onRelatedAddClick():void {
    "use strict";

    this.router.navigate(["NewRelatedIssue", {issue: this.id}]);
  }

  onTagAddClick():void {
    "use strict";

    this.router.navigate(["NewIssueTag", {issue: this.id}]);
  }

  onConfirmationAddClick():void {
    "use strict";

    this.router.navigate(["NewIssueConfirmation", {issue: this.id}]);
  }
}
