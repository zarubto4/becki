/**
 * Created by davidhradek on 06.12.16.
 */

/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { ModalsAddHardwareModel } from '../modals/add-hardware';
import { ModalsRemovalModel } from '../modals/removal';
import { IProject, IBoard, IBoardPersonalDescription, IProjectParticipant } from '../backend/TyrionAPI';
import { ModalsDeviceEditDescriptionModel } from '../modals/device-edit-description';
import { ModalsMembersAddModel } from '../modals/members-add';
import { CurrentParamsService } from '../services/CurrentParamsService';

@Component({
    selector: 'bk-view-projects-project-members',
    templateUrl: './projects-project-members.html',
})
export class ProjectsProjectMembersComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;

    selfId: string = '';

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['project'];
            this.projectSubscription = this.storageService.project(this.id).subscribe((project) => {
                this.project = project;
            });
        });
        this.selfId = this.backendService.personInfoSnapshot.id;
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onMembersAddClick() {
        let m = new ModalsMembersAddModel();
        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.blockUI();
                    this.backendService.shareProject(this.id, {persons_mail: m.emails})
                        .then(() => {
                            this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                        })
                        .catch((err) => {
                            this.unblockUI();
                            this.fmError('Cannot add members.', err);
                        });
                }
            });
    }

    onMemberDeleteClick(member: IProjectParticipant) {
        if ((this.backendService.personInfoSnapshot.mail === member.user_email) || (this.backendService.personInfoSnapshot.id === member.id)) {
            this.fmError('Cannot remove yourself from project.');
        }
        this.blockUI();
        this.backendService.unshareProject(this.id, {persons_mail: [member.user_email]})
            .then(() => {
                this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
            })
            .catch((err) => {
                this.unblockUI();
                this.fmError('Cannot delete member.', err);
            });
    }

    readableState(state: ('owner'|'admin'|'member'|'invited')) {
        switch (state) {
            case 'owner': return 'Project owner';
            case 'admin': return 'Project admin';
            case 'member': return 'Project member';
            case 'invited': return 'Invitation sent';
        }
        return 'Unknown';
    }

}
