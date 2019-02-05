/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Subscription } from 'rxjs';
import { IInvitation, IPerson, IProject, IRoleList } from '../backend/TyrionAPI';
import { ModalsMembersAddModel } from '../modals/members-add';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsConfirmModel } from '../modals/confirm';
import { IError } from '../services/_backend_class/Responses';
import { FlashMessageError } from '../services/NotificationService';

@Component({
    selector: 'bk-view-projects-project-members',
    templateUrl: './projects-project-members.html',
})
export class ProjectsProjectMembersComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    project_id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;
    invitations: IInvitation[] = null;
    securityRoleList: IRoleList = null;

    activeMembers: number = 0;

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

        this.onGetInvitations();
        this.onFilterRole();
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onGetInvitations() {
        this.tyrionBackendService.projectGetInvitation(this.project_id)
            .then((value: IInvitation[]) => {
                this.invitations = value;
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }

    onFilterRole(pageNumber: number = 0): void {

        // For loading purpose
        this.securityRoleList = null;

        this.tyrionBackendService.roleGetListByFilter(pageNumber, {
            project_id: this.project_id
        })
            .then((values: IRoleList) => {


                let size: number = 0;
                for (let role in values.content) {
                    if (values.content.hasOwnProperty(role)) {
                        size = size + values.content[role].persons.length;
                    }
                }

                this.activeMembers = size;
                this.securityRoleList = values;

                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }

    onMembersAddClick() {
        let m = new ModalsMembersAddModel();
        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.blockUI();
                    this.tyrionBackendService.projectShare(this.project_id, { persons_mail: m.emails })
                        .then(() => {
                            this.onGetInvitations();
                            this.unblockUI();
                        })
                        .catch((reason: IError) => {
                            this.unblockUI();
                            this.fmError(this.translate('label_cannot_add_person', reason));
                        });
                }
            });
    }

    onMemberDeleteClick(member: IInvitation) {

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
                        this.onGetInvitations();
                        this.onFilterRole();
                    })
                    .catch((reason: IError) => {
                        this.unblockUI();
                        this.fmError(this.translate('label_cannot_delete_person', reason));
                    });
            }
        });
    }

    onMemberSendAgainClick(member: IInvitation) {
        this.blockUI();
        this.tyrionBackendService.projectShare(this.project_id, { persons_mail: [member.email] })
            .then(() => {
                this.unblockUI();
                let m = new ModalsConfirmModel(this.translate('modal_label_invitation'), this.translate('modal_label_invitation_send', member.email), true, null, null, [this.translate('btn_ok')]);
                this.modalService.showModal(m);
            })
            .catch((reason: IError) => {
                this.unblockUI();
                this.fmError(this.translate('label_cannot_resend_invitation', reason));
            });
    }

    onDrobDownEmiter(action: string, member: IInvitation): void {

        if (action === 'send_invitation') {
            this.onMemberSendAgainClick(member);
        }

        if (action === 'remove_member') {
            this.onMemberDeleteClick(member);
        }
        if (action === 'remove_invitation') {
            this.onMemberDeleteClick(member);
        }
    }

}
