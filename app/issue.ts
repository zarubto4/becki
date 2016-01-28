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
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapFields from "./lib-bootstrap/fields";
import * as libBootstrapPanelList from "./lib-bootstrap/panel-list";
import * as wrapper from "./wrapper";

class Comment {

  id:string;

  body:string;

  date:number;

  likes:number;

  tags:string[];

  editing:boolean;

  fields:libBootstrapFields.Field[];

  constructor(id:string, body:string, date:number, likes:number, tags?:string[]) {
    "use strict";

    this.id = id;
    this.body = body;
    this.date = date;
    this.likes = likes;
    this.tags = tags;
    this.editing = false;
    this.fields = [new libBootstrapFields.Field("Comment", body, "text", "glyphicon-comment")];
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

  fields:libBootstrapFields.Field[];

  commentCreationFields:libBootstrapFields.Field[];

  constructor(id:string, body:string, date:number, likes:number, comments:Comment[], tags?:string[]) {
    "use strict";

    this.id = id;
    this.body = body;
    this.date = date;
    this.likes = likes;
    this.comments = comments;
    this.tags = tags;
    this.editing = false;
    this.fields = [new libBootstrapFields.Field("Body", body)];
    this.commentCreationFields = [new libBootstrapFields.Field("New Comment", "", "text", "glyphicon-comment")];
  }
}

class Issue extends Item {

  constructor(id:string, type:string, title:string, body:string, date:number, likes:number, comments:Comment[], tags?:string[]) {
    "use strict";

    super(id, body, date, likes, comments, tags);
    this.fields = [].concat(
        [
          new libBootstrapFields.Field("Type", type),
          new libBootstrapFields.Field("Title", title)
        ],
        this.fields);
  }
}

@ng.Component({
  templateUrl: "app/issue.html",
  directives: [form.Component, libBootstrapPanelList.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  items:Array<Item>;

  answerCreation:libBootstrapFields.Field[];

  related:libBootstrapPanelList.Item[];

  newRelatedLink:any[];

  tags:libBootstrapPanelList.Item[];

  newTagLink:any[];

  confirmations:libBootstrapPanelList.Item[];

  newConfirmationLink:any[];

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
    this.answerCreation = [
      new libBootstrapFields.Field("Body", ""),
      new libBootstrapFields.Field("Homer Program", `{"blocks":{}}`, "homer-program", "glyphicon-console")
    ];
    this.newRelatedLink = ["NewRelatedIssue", {issue: this.id}];
    this.newTagLink = ["NewIssueTag", {issue: this.id}];
    this.newConfirmationLink = ["NewIssueConfirmation", {issue: this.id}];
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

    this.backEnd.getIssue(this.id)
        .then(issue => {
          this.events.send(issue);
          return Promise.all<any>([
            issue,
            this.backEnd.request("GET", issue.textOfPost),
            this.backEnd.request("GET", issue.comments),
            this.backEnd.request("GET", issue.answers),
            issue.linkedAnswers ? this.backEnd.request("GET", issue.linkedAnswers) : []
          ]);
        })
        .then(result => {
          this.events.send(result);
          let issue:libBackEnd.Issue;
          let body:string;
          let comments:libBackEnd.Comment[];
          let answers:libBackEnd.Answer[];
          let related:libBackEnd.IssueLink[];
          [issue, body, comments, answers, related] = result;
          this.heading = `${issue.type}: ${issue.name}`;
          let commentsViews = comments.map(comment => new Comment(comment.postId, comment.textOfPost, comment.dateOfCreate, comment.likes, comment.hashTags));
          this.items = [].concat(
              new Issue(issue.postId, issue.type, issue.name, body, issue.dateOfCreate, issue.likes, commentsViews, issue.hashTags),
              // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-35
              answers.map(answer => new Item(
                  answer.postId, answer.textOfPost, answer.dateOfCreate, answer.likes,
                  [], // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-35 answer.comments.map(comment => new Comment(comment.postId, comment.textOfPost, comment.dateOfCreate, comment.likes)),
                  answer.hashTags
              ))
          );
          this.related = related.map(related2 => new libBootstrapPanelList.Item(related2.linkId, related2.name, ""));
          this.tags = issue.hashTags ? issue.hashTags.map(tag => new libBootstrapPanelList.Item(tag, tag, "")) : [];
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-31
          this.confirmations = [new libBootstrapPanelList.Item(null, "(issue/TYRION-31)", "does not work")];
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onItemEditClick(item:Item):void {
    "use strict";

    item.editing = true;
  }

  onItemEditingSubmit(item:Item):void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-29
    if (item instanceof Issue) {
      this.backEnd.updateIssue(item.id, item.fields[0].model, item.fields[1].model, item.fields[2].model, item.tags || [])
          .then((message) => {
            this.events.send(message);
            this.refresh();
          })
          .catch((reason) => {
            this.events.send(reason);
          });
    } else {
      this.backEnd.updateAnswer(item.id, item.fields[0].model, item.tags || [])
          .then((message) => {
            this.events.send(message);
            this.refresh();
          })
          .catch((reason) => {
            this.events.send(reason);
          });
    }
  }

  onItemEditingCancel(item:Item):void {
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

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-16
    this.backEnd.createAnswer(this.id, this.answerCreation[0].model)
        .then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onCommentCreationSubmit(item:Item):void {
    "use strict";

    this.backEnd.createComment(item.id, item.commentCreationFields[0].model)
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

    this.backEnd.updateComment(comment.id, comment.fields[0].model, comment.tags || [])
        .then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onCommentEditingCancel(comment:Comment):void {
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
}
