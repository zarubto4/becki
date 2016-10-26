/**
 * Created by dominikkrisztof on 12/10/16.
 */


import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";


@Component({
    selector: "view-redirect-ok",
    templateUrl: "app/views/redirect-ok.html"
})
export class RedirectOkComponent implements OnInit {


    constructor(protected router: Router) {
    }


    ngOnInit(): void {
    }


    clickButtonBack(): void {
        this.router.navigate(["login"]);
    }

}

