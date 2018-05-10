
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { IArticle } from "../backend/TyrionAPI";

@Component({
    selector: 'bk-article-time-line',
    /* tslint:disable */
    template:
`
        <div class="timeline-item">
            <div class="timeline-badge">
                <div class="timeline-icon">
                    <i [class.font-color-hardware]="article_head_color === 'HARDWARE'"
                       [class.font-color-cloud]="article_head_color === 'CLOUD'"
                       [class.font-color-code]="article_head_color === 'CODE'"
                       [class.font-color-grid]="article_head_color === 'GRID'"
                       [class.font-color-blocko]="article_head_color === 'BLOCKO'"
                       [class.font-color-byzance-blue]="article_head_color === 'BYZANCE'"
                       class="fa {{icon}}"></i>
                </div>
            </div>
            <div class="timeline-body">
                <div class="timeline-body-arrow"> </div>
                <div class="timeline-body-head" style="margin-bottom: 30px;">
                    <div class="timeline-body-head-caption">
                        <span class="timeline-body-alerttitle"
                              [class.color-hardware]="article_head_color === 'HARDWARE'"
                              [class.color-cloud]="article_head_color === 'CLOUD'"
                              [class.color-code]="article_head_color === 'CODE'"
                              [class.color-grid]="article_head_color === 'GRID'"
                              [class.color-blocko]="article_head_color === 'BLOCKO'"
                              [class.color-byzance-blue]="article_head_color === 'BYZANCE'"
                              [class.color-default]="article_head_color === 'DEFAULT' || article_head_color === null"
                        >{{article.name}}</span>
                        <span class="timeline-body-time font-grey-cascade">({{article.created|bkUnixTimeToDate}})</span>
                    </div>
                    <div class="timeline-body-head-actions">
                        <div class="btn-group dropup">
                            <bk-drob-down-button *ngIf="article"
                                [btns_group_name]="('label_settings'|bkTranslate:this)"
                                [btns]="[
                                    {
                                        condition: (article.update_permission),
                                        btn_label_for_person: ('label_article_edit'|bkTranslate:this),
                                        btn_tag: 'article_edit',
                                        icon: 'fa-cog',
                                        colorType: 'EDIT',
                                        permission: (article.update_permission)
                                    },
                                    {
                                        condition: (article.delete_permission),
                                        btn_label_for_person: ('label_article_remove'|bkTranslate:this),
                                        btn_tag: 'article_remove',
                                        icon: 'fa-trash',
                                        colorType: 'REMOVE',
                                        permission: (article.delete_permission)
                                    }
                                ]"
                                (onValueChanged)="onDropDownEmitter($event)"
                            >
                            </bk-drob-down-button>
                        </div>
                    </div>
                </div>
                <div class="timeline-body-content">
                     <span class="font-grey-cascade"> 
                         {{article.mark_down_text}}
                      </span>
                </div>
            </div>
        </div>
`
/* tslint:enable */
})
export class ArticleComponent implements OnInit, OnChanges {

    @Input()
    article: IArticle = null;

    @Input()
    icon: string = 'fa-info';

    @Input()
    article_head_color: ('HARDWARE' | 'BLOCKO' | 'GRID' | 'CODE' | 'CLOUD' | 'BYZANCE' | 'DEFAULT') = 'DEFAULT';


    @Output()
    onBtnClick: EventEmitter<string> = new EventEmitter<string>();

    constructor() { }

    ngOnInit(): void {
        // nevím
    }

    ngOnChanges(changes: SimpleChanges) {
        // nevím
    }

    onDropDownEmitter(action: string): void {
        this.onBtnClick.emit(action);
    }
}
