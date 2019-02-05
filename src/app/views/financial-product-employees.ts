/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
import { OnInit, Component, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IProduct, IEmployee, IProductExtension } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { ModalsConfirmModel } from '../modals/confirm';
import { ModalsMembersAddModel } from '../modals/members-add';
import { IError } from '../services/_backend_class/Responses';


@Component({
    selector: 'bk-view-financial-product-employees',
    templateUrl: './financial-product-employees.html'
})
export class FinancialProductEmployeesComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;

    product: IProduct = null;
    selfId: string = null;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.blockUI();
        this.selfId = this.tyrionBackendService.personInfoSnapshot.id;
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['product'];
            this.refresh();
            this.unblockUI();
        });

    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    onMembersAddClick() {
        let m = new ModalsMembersAddModel();
        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.blockUI();
                    this.tyrionBackendService.employeeAdd({
                        mails: m.emails,
                        customer_id: this.product.owner.id
                    })
                        .then(() => {

                        })
                        .catch((reason: IError) => {
                            this.unblockUI();
                            this.fmError(this.translate('label_cannot_add_new_employees', reason));
                        });
                }
            });
    }

    onMemberDeleteClick(member: IEmployee) {

        if ((this.tyrionBackendService.personInfoSnapshot.email === member.person.email) || (this.tyrionBackendService.personInfoSnapshot.id === member.person.id)) {
            this.fmError(this.translate('label_cannot_remove_yourself'));
        }

        let con = new ModalsConfirmModel(this.translate('modal_title_remove_member'), this.translate('modal_text_remove_member'), false, this.translate('btn_yes'), this.translate('btn_no'), null);
        this.modalService.showModal(con).then((success) => {
            if (!success) {
                return;
            } else {
                this.blockUI();
                this.tyrionBackendService.employeeRemove(member.id)
                    .then(() => {
                        this.refresh();
                    })
                    .catch((err) => {
                        this.unblockUI();
                        this.fmError(this.translate('label_cannot_delete_person', err));
                    });
            }
        });
    }

    onMemberSendAgainClick(member: IEmployee) {
        this.blockUI();
        this.tyrionBackendService.employeeAdd({
            mails: [member.person.email],
            customer_id: this.product.owner.id
        })
            .then(() => {
                this.unblockUI();
                let m = new ModalsConfirmModel(this.translate('modal_label_invitation'), this.translate('modal_label_invitation_send', member.person.email), true, null, null, [this.translate('btn_ok')]);
                this.modalService.showModal(m);
            })
            .catch((err) => {
                this.unblockUI();
                this.fmError(this.translate('label_cannot_resend_invitation', err));
            });
    }

    readableState(state: ('owner' | 'admin' | 'member' | 'invited')) {
        switch (state) {
            case 'owner': return this.translate('label_product_owner');
            case 'admin': return this.translate('label_product_admin');
            case 'member': return this.translate('label_product_member');
            case 'invited': return this.translate('label_product_sent');
        }
        return 'Unknown';
    }

    onDrobDownEmiter(action: string, member: IEmployee): void {

        if (action === 'send_invitation') {
            this.onMemberSendAgainClick(member);
        }

        if (action === 'remove_member') {
            this.onMemberDeleteClick(member);
        }
    }

    refresh(): void {
        this.blockUI();
        this.tyrionBackendService.productGet(this.id).then(product =>  {
            this.product = product;
            this.unblockUI();
        }).catch(reason =>  {
            this.fmError(this.translate('flash_fail'), reason);
            this.unblockUI();
        });

    }
}
