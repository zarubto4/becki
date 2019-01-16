import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IContact } from '../backend/TyrionAPI';
import { ModalsContactModel } from '../modals/contact';
import { NotificationService } from '../services/NotificationService';
import { ModalService } from '../services/ModalService';
import { BlockUIService } from '../services/BlockUIService';
import { TyrionBackendService } from '../services/BackendService';
import { TranslationService } from '../services/TranslationService';
import { ContactFormData } from './ContactFormComponent';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-contact-table',
    templateUrl: './ContactTableComponent.html'
})
export class ContactTableComponent implements OnInit {

    @Input() edit = false;

    @Input() title: string;

    @Input() contact: IContact;

    @Output() contactChange = new EventEmitter<IContact>();

    // emitted only when we have no contact
    @Output() onCreate = new EventEmitter<ContactFormData>();

    constructor(private tyrionBackendService: TyrionBackendService, private modalService: ModalService,
        private notificationService: NotificationService, private blockUIService: BlockUIService, private translationService: TranslationService) {
    };

    ngOnInit() {}

    editContact() {
        const create = !this.contact || !this.contact.id;

        let model = new ModalsContactModel (create, create, this.contact);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                if (create) {
                    this.onCreate.emit(model.contactData);
                    return;
                }

                this.blockUIService.blockUI();
                this.tyrionBackendService.contactEditDetails(this.contact.id, model.contactData)
                    .then((contact) => {
                        this.contact = contact;
                        this.blockUIService.unblockUI();
                        this.contactChange.emit(contact);
                    })
                    .catch((reason: IError) => {
                        this.notificationService.fmError(reason);
                        this.blockUIService.unblockUI();
                    });
            }
        });
    }
}
