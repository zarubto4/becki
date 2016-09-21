/**
 * Created by davidhradek on 21.09.16.
 */


import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {LayoutMain} from "../layouts/main";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {ModalsRemovalModel} from "../modals/removal";
import {ModalsCodePropertiesModel} from "../modals/code-properties";
import {IProject, ICProgram, ITypeOfBoard, ITypeOfBlock} from "../backend/TyrionAPI";

@Component({
    selector: "view-projects-project-blocks",
    templateUrl: "app/views/projects-project-blocks.html",
    directives: [ROUTER_DIRECTIVES, LayoutMain],
})
export class ProjectsProjectBlocksComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription:Subscription;

    project:IProject = null;

    constructor(injector:Injector) {super(injector)};

    ngOnInit():void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params["project"];
            this.refresh();
        });
    }

    ngOnDestroy():void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh():void {
        this.backendService.getProject(this.id)
            .then((project:IProject) => {
                this.project = project;
                console.log(this.project);

                return Promise.all<ITypeOfBlock>(project.type_of_blocks_id.map((typeOfBlockId) => {
                    return this.backendService.getTypeOfBlock(typeOfBlockId);
                }));
            })
            .then((typeOfBlocks:ITypeOfBlock[]) => {
                console.log(typeOfBlocks);
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The project ${this.id} cannot be loaded.`, reason));
            });


        /*this.backendService.createBlockoBlock({
            design_json: "[]",
            general_description: "Super bloček ktereje je fuckt nejvíc peckovek ... nekecám!",
            logic_json: "[]",
            name: "TEST Bloček",
            new_type_of_block:false,
            project_id: "1",
            type_of_block_id: "21",
            version_description: "žádný nemám, páč tohle je první verze která nic neobsahuje",
            version_name: "0.0 prdlačky"
        });*/

        //this.backendService.createTypeOfBlock({general_description:"Peckoidní bločíčky .... piče, kterej vocas vymysle že tu musí být 24 znaků!", name:"Caffemat Blocks", project_id:"1"})
    }

}
