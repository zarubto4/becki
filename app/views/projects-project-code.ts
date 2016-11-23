/**
 * Created by davidhradek on 15.08.16.
 */

import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/NotificationService";
import {Subscription} from "rxjs/Rx";
import {ModalsRemovalModel} from "../modals/removal";
import {ModalsCodePropertiesModel} from "../modals/code-properties";
import {IProject, ICProgram, ITypeOfBoard} from "../backend/TyrionAPI";

@Component({
    selector: "view-projects-project-code",
    templateUrl: "app/views/projects-project-code.html",
})
export class ProjectsProjectCodeComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;

    project: IProject = null;

    codePrograms: ICProgram[] = null;

    typeOfBoards: ITypeOfBoard[] = null;

    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params["project"];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    getBoardType(typeId: string): string {
        var typeOfBoard:ITypeOfBoard = null;
        if (this.typeOfBoards) {
            typeOfBoard = this.typeOfBoards.find(dt => {
                return dt.id == typeId
            });
        }
        if (typeOfBoard) return typeOfBoard.name;
        return "";
    }

    refresh(): void {
        this.blockUI();
        this.backendService.getProject(this.id)
            .then((project) => {
                this.project = project;
                return this.backendService.getAllTypeOfBoards();
            })
            .then((typeOfBoards) => {
                this.typeOfBoards = typeOfBoards;
                return Promise.all<ICProgram>(this.project.c_programs.map((c_program) => {
                    return this.backendService.getCProgram(c_program.id);
                }));
            })
            .then((codePrograms) => {
                this.codePrograms = codePrograms;
                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The project ${this.id} cannot be loaded.`, reason));
                this.unblockUI();
            });
    }

    onCodeClick(code: ICProgram): void {
        this.navigate(["/projects", this.currentParamsService.get("project"), "code", code.id]);
    }

    onRemoveClick(code: ICProgram): void {
        this.modalService.showModal(new ModalsRemovalModel(code.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteCProgram(code.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The code has been removed."));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The code cannot be removed.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onAddClick(): void {
        if (!this.typeOfBoards) new FlashMessageError(`The code cannot be added to project.`);
        var model = new ModalsCodePropertiesModel(this.typeOfBoards);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.createCProgram({
                    project_id: this.id,
                    name: model.name,
                    description: model.description,
                    type_of_board_id: model.deviceType
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(`The code ${model.name} has been added to project.`));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(`The code ${model.name} cannot be added to project.`, reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onEditClick(code: ICProgram): void {
        if (!this.typeOfBoards) new FlashMessageError(`The code cannot be added to project.`);

        var model = new ModalsCodePropertiesModel(this.typeOfBoards, code.name, code.description, "", true, code.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editCProgram(code.id, {
                    project_id: this.id,
                    name: model.name,
                    description: model.description,
                    type_of_board_id: code.type_of_board_id
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The code has been updated."));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The code cannot be updated.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

}
