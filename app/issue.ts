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
import * as fieldHomerProgram from "./field-homer-program";
import * as fieldIssueBody from "./field-issue-body";
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapAlerts from "./lib-bootstrap/alerts";
import * as libBootstrapPanelList from "./lib-bootstrap/panel-list";

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
    customValidator.Directive,
    fieldHomerProgram.Component,
    fieldIssueBody.Component,
    layout.Component,
    libBootstrapPanelList.Component,
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

  related:libBootstrapPanelList.Item[];

  tags:libBootstrapPanelList.Item[];

  confirmations:libBootstrapPanelList.Item[];

  progress:number;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("issue");
    this.heading = "Loading...";
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("Issues", ["Issues"]),
      new layout.LabeledLink(`Issue ${this.id}`, ["Issue", {issue: this.id}])
    ];
    this.answerBodyField = fieldIssueBody.EMPTY;
    this.progress = 0;
    this.backEnd = backEndService;
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.alerts.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.progress += 2;
    Promise.all<any>([
          this.backEnd.getIssueTypes(),
          this.backEnd.getIssue(this.id)
        ])
        .then(result => {
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
          this.related = related.map(related2 => new libBootstrapPanelList.Item(related2[0].linkId, related2[0].name, "", ["Issue", {issue: related2[1].postId}]));
          this.tags = issue.hashTags ? issue.hashTags.map(tag => new libBootstrapPanelList.Item(tag, tag, "")) : [];
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-86
          this.confirmations = [new libBootstrapPanelList.Item(null, "(issue/TYRION-86)", "does not work")];
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The issue ${this.id} cannot be loaded: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
    this.backEnd.getProjects()
        .then(projects => this.projects = projects)
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`Projects cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
  }

  onItemImportClick(item:Item):void {
    "use strict;"

    this.alerts.shift();
    item.importing = true;
  }

  validateHomerProgramName(name:string, projectId:string):()=>Promise<boolean> {
    "use strict";
    return () => {
      this.progress += 1;
      // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
      return this.backEnd.getProject(projectId)
          .then(project => {
            return this.backEnd.request<libBackEnd.HomerProgram[]>("GET", project.b_programs);
          })
          .then(programs => {
            this.progress -= 1;
            return !programs.find(program => program.programName == name);
          })
          .catch(reason => {
            this.progress -= 1;
            return Promise.reject(reason);
          });
    };
  }

  onItemImportingSubmit(item:Item):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    this.backEnd.createHomerProgram(item.programNameField, item.programDescriptionField, item.programCodeField, item.programProjectField)
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The program has been imported."));
          item.importing = false;
          item.programNameField = "";
          item.programDescriptionField = "";
          item.programCodeField = fieldIssueBody.getHomer(item.body);
          item.programProjectField = "";
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The program cannot be imported: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onItemImportingCancelClick(item:Item):void {
    "use strict";

    this.alerts.shift();
    item.importing = false;
  }

  onItemEditClick(item:Item):void {
    "use strict";

    this.alerts.shift();
    item.editing = true;
  }

  onItemEditingSubmit(item:Item):void {
    "use strict";

    this.alerts.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-97
    if (item instanceof Issue) {
      this.progress += 1;
      this.backEnd.updateIssue(item.id, item.typeField, item.titleField, item.bodyField, item.tags || [])
          .then(() => {
            this.alerts.current.push(new libBootstrapAlerts.Success("The issue has been updated."));
            this.refresh();
          })
          .catch(reason => {
            this.alerts.current.push(new libBootstrapAlerts.Danger(`The issue cannot be updated: ${reason}`));
          })
          .then(() => {
            this.progress -= 1;
          });
    } else {
      this.backEnd.updateAnswer(item.id, item.bodyField, item.tags || [])
          .then(() => {
            this.alerts.current.push(new libBootstrapAlerts.Success("The answer has been updated."));
            this.refresh();
          })
          .catch(reason => {
            this.alerts.current.push(new libBootstrapAlerts.Danger(`The answer cannot be updated: ${reason}`));
          })
          .then(() => {
            this.progress -= 1;
          });
    }
  }

  onItemEditingCancelClick(item:Item):void {
    "use strict";

    this.alerts.shift();
    item.editing = false;
  }

  onMinusClick(id:string):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    this.backEnd.subtractOneFromPost(id)
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The likes have been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The likes cannot be updated: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onPlusClick(id:string):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    this.backEnd.addOneToPost(id)
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The likes have been updated."));
          this.refresh();
        })
        .catch((reason) => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The likes cannot be updated: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onItemRemoveClick(item:Item):void {
    "use strict";

    this.alerts.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-79
    if (item instanceof Issue) {
      this.progress += 1;
      this.backEnd.deleteIssue(item.id)
          .then(() => {
            this.alerts.next.push(new libBootstrapAlerts.Success("The issue has been removed."));
            this.router.navigate(["Issues"]);
          })
          .catch(reason => {
            this.alerts.current.push(new libBootstrapAlerts.Danger(`The issue cannot be removed: ${reason}`));
          })
          .then(() => {
            this.progress -= 1;
          });
    } else {
      this.progress += 1;
      this.backEnd.deleteAnswer(item.id)
          .then(() => {
            this.alerts.current.push(new libBootstrapAlerts.Success("The answer has been removed."));
            this.refresh();
          })
          .catch((reason) => {
            this.alerts.current.push(new libBootstrapAlerts.Danger(`The answer cannot be removed: ${reason}`));
          })
          .then(() => {
            this.progress -= 1;
          });
    }
  }

  onAnswerCreationSubmit():void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    this.backEnd.createAnswer(this.id, this.answerBodyField)
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The answer has been created."));
          this.answerBodyField = fieldIssueBody.EMPTY;
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The answer cannot be created: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onCommentCreationSubmit(item:Item):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    this.backEnd.createComment(item.id, item.commentField)
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The comment has been created."));
          this.refresh();
        })
        .catch((reason) => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The comment cannot be created: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onCommentEditClick(comment:Comment):void {
    "use strict";

    this.alerts.shift();
    comment.editing = true;
  }

  onCommentEditingSubmit(comment:Comment):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    this.backEnd.updateComment(comment.id, comment.bodyField, comment.tags || [])
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The comment has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The comment cannot be updated: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onCommentEditingCancelClick(comment:Comment):void {
    "use strict";

    this.alerts.shift();
    comment.editing = false;
  }

  onCommentRemoveClick(id:string):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    this.backEnd.deleteComment(id)
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The comment has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The comment cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onRelatedAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewRelatedIssue", {issue: this.id}]);
  }

  onRelatedRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-95
    Promise.all(ids.map(id => this.backEnd.deleteIssueLink(id)))
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The issues have been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The issues cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onTagAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewIssueTag", {issue: this.id}]);
  }

  onTagsRemoveClick(tags:string[]):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-96
    this.backEnd.removeTagsFromPost(tags, this.id)
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The tags have been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The tags cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onConfirmationAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewIssueConfirmation", {issue: this.id}]);
  }

  onConfirmationsRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-94
    this.alerts.current.push(new libBootstrapAlerts.Danger("issue/TYRION-94"));
  }
}
