/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

/**
 * Created by dominik.krisztof on 10.11.16.
 */

import {OnInit, Component, Injector} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";


@Component({
    selector: "view-financial/product",
    templateUrl: "app/views/financial-product.html"
})
export class FinancialProductComponent extends BaseMainComponent implements OnInit {

    constructor(injector: Injector) {
        super(injector)
    };


    ngOnInit():void{
        this.refresh();
    }

    refresh():void{

    }
}