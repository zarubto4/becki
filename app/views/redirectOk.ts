/**
 * Created by dominikkrisztof on 12/10/16.
 */


import {Component, OnInit} from '@angular/core';
import {CORE_DIRECTIVES} from "@angular/common";
import {LayoutNotLogged} from "../layouts/not-logged";
import {BeckiFormInput} from "../components/BeckiFormInput";
import {REACTIVE_FORM_DIRECTIVES} from "@angular/forms";

import {Router} from "@angular/router";


@Component({
    selector: "redirectOk",
    directives: [LayoutNotLogged,CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput],
    templateUrl: "app/views/redirectOk.html"
})
export class RedirectOkComponent implements OnInit{



    constructor(protected router:Router) {


    }


    ngOnInit(): void {

    }



    clickButtonBack():void{
        this.router.navigate(["login"]);
    }

}

