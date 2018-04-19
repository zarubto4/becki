/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Subscription } from 'rxjs/Rx';
import { IProject, IProjectParticipant } from '../backend/TyrionAPI';
import { ModalsMembersAddModel } from '../modals/members-add';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsConfirmModel } from '../modals/confirm';

@Component({
    selector: 'bk-view-projects-project-members',
    templateUrl: './projects-project-members.html',
})
export class ProjectsProjectMembersComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    project_id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;

    selfId: string = '';

    currentParamsService: CurrentParamsService; // exposed for template - filled by _BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.project_id = params['project'];
            this.projectSubscription = this.storageService.project(this.project_id).subscribe((project) => {
                this.project = project;
            });
        });
        this.selfId = this.tyrionBackendService.personInfoSnapshot.id;
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
                    this.tyrionBackendService.projectShare(this.project_id, { persons_mail: m.emails })
                        .then(() => {
                            this.storageService.projectRefresh(this.project_id).then(() => this.unblockUI());
                        })
                        .catch((err) => {
                            this.unblockUI();
                            this.fmError(this.translate('label_cannot_delete_person', err));
                        });
                }
            });
    }

    onMemberDeleteClick(member: IProjectParticipant) {

        if ((this.tyrionBackendService.personInfoSnapshot.email === member.email) || (this.tyrionBackendService.personInfoSnapshot.id === member.id)) {
            this.fmError(this.translate('label_cannot_remove_yourself'));
        }

        let con = new ModalsConfirmModel(this.translate('modal_title_remove_member'), this.translate('modal_text_remove_member'), false, this.translate('btn_yes'), this.translate('btn_no'), null);
        this.modalService.showModal(con).then((success) => {
            if (!success) {
                return;
            } else {
                this.blockUI();
                this.tyrionBackendService.projectUnshare(this.project_id, { persons_mail: [member.email] })
                    .then(() => {
                        this.storageService.projectRefresh(this.project_id).then(() => this.unblockUI());
                    })
                    .catch((err) => {
                        this.unblockUI();
                        this.fmError(this.translate('label_cannot_delete_person', err));
                    });
            }
        });
    }

    onMemberSendAgainClick(member: IProjectParticipant) {
        this.blockUI();
        this.tyrionBackendService.projectShare(this.project_id, { persons_mail: [member.email] })
            .then(() => {
                this.unblockUI();
                let m = new ModalsConfirmModel(this.translate('modal_label_invitation'), this.translate('modal_label_invitation_send', member.email), true, null, null, [this.translate('btn_ok')]);
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

    onDrobDownEmiter(action: string, member: IProjectParticipant): void {

        if (action === 'send_invitation') {
            this.onMemberSendAgainClick(member);
        }

        if (action === 'remove_member') {
            this.onMemberDeleteClick(member);
        }
    }

}
