/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import {
    Component,
    Input,
    OnInit,
    ElementRef,
    OnDestroy,
    EventEmitter,
    Output,
    SimpleChanges,
    OnChanges
} from '@angular/core';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';
import { TranslationService } from '../services/TranslationService';


export interface DataCharInterface {
    chart_data: {
        data: number[],
        label: string
    }[];
    bar_chart_labels: string[];
    x_chart_label: string;
}

@Component({
    selector: 'bk-form-chart-bar',
    /* tslint:disable:max-line-length */
    template: `
        <div class="portlet light">

            <!-- Portlet - Basic Title of Panel with Buttons on right side -- START -->
            <bk-portlet-title [title_name]="title"
                              [icon]="'fa-chart-bar'"
                              (onClick)="onPortletClick($event)"
                              [btns_group_name]="btns_group_name"
                              [btns]="btns">
            </bk-portlet-title>
            <!-- Portlet - Basic Title of Panel with Buttons on right side --- END -->

            <div class="portlet-body">
                <div *ngIf="values != null" style="display: block">
                    <canvas baseChart
                            [datasets]="values.chart_data"
                            [labels]="values.bar_chart_labels"
                            [colors]="chart_colors"
                            [options]="{
                                scaleShowVerticalLines: false,
                                responsive: true,
                                beginAtZero:true,
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero:true
                                        },
                                        scaleLabel: {
                                            display: true,
                                            labelString: values.x_chart_label
                                        }
                                    }]
                                }
                            }"
                            [legend]="show_legend"
                            [chartType]="'bar'"
                            (chartHover)="chartHovered($event)"
                            (chartClick)="chartClicked($event)">
                    </canvas>
                </div>
            </div>

        </div>
    `
    /* tslint:enable */
})
export class ChartBarComponent implements OnInit, OnDestroy, OnChanges {

    @Input()
    title: string = 'NOT SET';

    @Input()
    btns_group_name: string = 'Filter';

    @Input()
    btns: any = null;

    @Input()
    barChartType: string = 'bar';

    values: DataCharInterface = null;

    @Input()
    show_legend: boolean = true;

    @Output()
    onClick: EventEmitter<string> = new EventEmitter<string>();

    public chart_colors: Array<any> = [
        { // byzance blue
            backgroundColor: 'rgba(0, 171, 233, 1)',
            borderColor: 'rgba(0, 171, 233, 1)',
            pointBackgroundColor: 'rgba(0, 171, 233, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(0, 171, 233, 1)'
        },
        { // code pink
            backgroundColor: 'rgba(250, 115, 156, 1)',
            borderColor: 'rgba(250, 115, 156, 1)',
            pointBackgroundColor: 'rgba(250, 115, 156,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(7250, 115, 156,1)'
        },
        { // grey
            backgroundColor: 'rgba(0, 171, 233,0.5)',
            borderColor: 'rgba(0, 171, 233,1)',
            pointBackgroundColor: 'rgba(0, 171, 233,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(0, 171, 233, 1)'
        }
    ];

    constructor(public validatorErrorsService: ValidatorErrorsService, private translationService: TranslationService) {
    }

    setData(data: DataCharInterface): void {



        let val: ChartBarComponent = this;
        this.values = null;

        setTimeout(function () {
            val.values = data;
        }, 200);
    }

    // events
    public chartClicked(e: any): void {
        console.info(e);
    }

    // events
    public chartHovered(e: any): void {
        console.info(e);
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    ngOnDestroy(): void {

    }

    onPortletClick(btn_name: string): void {
        this.onClick.emit(btn_name);
    }


}
