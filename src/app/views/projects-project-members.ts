/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
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
import { ModalsConfirmModel } from '../modals/confirm';

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
                    this.backendService.projectShare(this.id, { persons_mail: m.emails })
                        .then(() => {
                            this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                        })
                        .catch((err) => {
                            this.unblockUI();
                            this.fmError(this.translate('label_cannot_delete_person', err));
                        });
                }
            });
    }

    onMemberDeleteClick(member: IProjectParticipant) {
        if ((this.backendService.personInfoSnapshot.mail === member.mail) || (this.backendService.personInfoSnapshot.id === member.id)) {
            this.fmError(this.translate('label_cannot_remove_yourself'));
        }




        let con = new ModalsConfirmModel(this.translate('modal_title_remove_member'), this.translate('modal_text_remove_member'), false, this.translate('btn_yes'), this.translate('btn_no'), null);
        this.modalService.showModal(con).then((success) => {
            if (!success) {
                return;
            } else {
                this.blockUI();
                this.backendService.projectUnshare(this.id, { persons_mail: [member.mail] })
                    .then(() => {
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch((err) => {
                        this.unblockUI();
                        this.fmError(this.translate('label_cannot_delete_person', err));
                    });
            }
        });
    }

    onMemberSnedAgainClick(member: IProjectParticipant) {
        this.blockUI();
        this.backendService.projectShare(this.id, { persons_mail: [member.mail] })
            .then(() => {
                this.unblockUI();
                let m = new ModalsConfirmModel(this.translate('modal_label_invitation'), this.translate('modal_label_invitation_send', member.mail), true, null, null, [this.translate('btn_ok')]);
                this.modalService.showModal(m);
            })
            .catch((err) => {
                this.unblockUI();
                this.fmError(this.translate('label_cannot_resend_invitation', err));
            });
    }

    readableState(state: ('owner' | 'admin' | 'member' | 'invited')) {
        switch (state) {
            case 'owner': return this.translate('label_project_owner');
            case 'admin': return this.translate('label_project_admin');
            case 'member': return this.translate('label_project_member');
            case 'invited': return this.translate('label_invitation_sent');
        }
        return 'Unknown';
    }

}
