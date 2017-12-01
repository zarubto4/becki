import { Component, Input } from '@angular/core';


@Component({
    selector: 'bk-compilation-status-component',
    template: `

        <span class="icon-hint-wraper red" *ngIf="status =='server_was_offline'">
                                        <i class="fa fa-exclamation-triangle font-red-mint"></i>
                                        <span class="hint">{{status | bkTranslateTable:this:'version_status'}}</span>
                                     </span>

        <span class="icon-hint-wraper red" *ngIf="status=='json_code_is_broken'">
                                        <i class="fa fa-exclamation-triangle font-red-mint"></i>
                                        <span class="hint">{{status | bkTranslateTable:this:'version_status'}}</span>
                                     </span>

        <span class="icon-hint-wraper orange" *ngIf="status=='compiled_with_code_errors'">
                                        <i class="fa fa-bug font-yellow"></i>
                                        <span class="hint">{{status | bkTranslateTable:this:'version_status'}}</span>
                                    </span>

        <span class="icon-hint-wraper red" *ngIf="status=='hardware_unstable'">
                                        <i class="fa fa-heartbeat font-red-mint"></i>
                                        <span class="hint">{{status | bkTranslateTable:this:'version_status'}}</span>
                                    </span>

        <span class="icon-hint-wraper orange"
              *ngIf="status=='server_was_offline' || status=='successfully_compiled_not_restored' || status=='undefined' || status=='file_with_code_not_found' || status=='compilation_server_error' || status=='json_code_is_broken'">
                                        <i class="fa fa-thumbs-down font-yellow"></i>
                                        <span class="hint">{{status | bkTranslateTable:this:'version_status'}}</span>
                                    </span>

        <span class="icon-hint-wraper gray" *ngIf="status=='compilation_in_progress'">
                                        <i class="fa fa-spinner fa-spin"></i>
                                        <span class="hint">{{status | bkTranslateTable:this:'version_status'}}</span>
                                    </span>

        <span class="icon-hint-wraper green" *ngIf="status=='successfully_compiled_and_restored'">
                                        <i class="fa fa-check font-green-jungle"></i>
                                        <span class="hint">{{status | bkTranslateTable:this:'version_status'}}</span>
                                    </span>

        <!-- Public Status -->
        <span class="icon-hint-wraper red" *ngIf="status == 'pending'">
                                        <i class="fa fa-heart font-red-flamingo"
                                           style="font-size: 1.6em; margin-left: 5px;"></i>
                                        <span class="hint"
                                              [innerHTML]="status|bkTranslateTable:this:'publish_status'"></span>
                                    </span>
        <span class="icon-hint-wraper green" *ngIf="status == 'approved'">
                                        <i class="fa fa-heart font-green-jungle"
                                           style="font-size: 1.6em; margin-left: 5px;"></i>
                                        <span class="hint"
                                              [innerHTML]="status|bkTranslateTable:this:'publish_status'"></span>
                                    </span>
        <span class="icon-hint-wraper gray" *ngIf="status == 'disapproved'">
                                        <i class="fa fa-heart" style="font-size: 1.6em; margin-left: 5px;"></i>
                                        <span class="hint"
                                              [innerHTML]="status|bkTranslateTable:this:'publish_status'"></span>
                                    </span>
        <span class="icon-hint-wraper green" *ngIf="status == 'edited'">
                                        <i class="fa fa-heart font-blue"
                                           style="font-size: 1.6em; margin-left: 5px;"></i>
                                        <span class="hint"
                                              [innerHTML]="status|bkTranslateTable:this:'publish_status'"></span>
                                    </span>
    `
})

export class CompilationStatusComponent {

    @Input()
    status: string = 'waiting_for_device';

}
