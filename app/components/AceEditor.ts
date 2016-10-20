/**
 * Created by davidhradek on 23.08.16.
 */

import "ace";
import "ace/ext-language_tools";
import "ace/mode-c_cpp";
import "ace/mode-javascript";
import {
    Component, OnDestroy, OnChanges, AfterViewInit, ElementRef, Input, ViewChild, Output,
    EventEmitter, SimpleChanges
} from "@angular/core";


@Component({
    selector: "ace-editor",
    template: `<div data-ref-field class="form-control" style="position: relative; height: 60vh;">{{code}}</div>`
})
export class AceEditor implements AfterViewInit, OnChanges, OnDestroy {

    @Input()
    code:string;

    @Input()
    mode:string;

    @Input()
    readonly:boolean;

    @Input()
    annotations:AceAjax.Annotation[] = [];

    @ViewChild("field")
    field:ElementRef;

    editor:AceAjax.Editor;

    @Output("codeChange")
    codeChange = new EventEmitter<string>();

    ngOnChanges(changes:SimpleChanges):void {
        let code = changes["code"];
        // TODO: https://github.com/angular/angular/issues/6114
        if (code && this.editor && code.currentValue != this.editor.getValue()) {
            this.editor.setValue(code.currentValue, 1);
        }
        let mode = changes["mode"];
        if (mode && this.editor) {
            this.editor.getSession().setMode(mode.currentValue);
        }
        let readonly = changes["readonly"];
        if (readonly && this.editor) {
            this.editor.setReadOnly(readonly.currentValue);
        }
        let annotations = changes["annotations"];
        if (annotations && this.editor) {
            this.editor.getSession().setAnnotations(annotations.currentValue);
        }
    }

    ngAfterViewInit():void {
        this.editor = ace.edit(this.field.nativeElement);
        this.editor.setOptions({enableBasicAutocompletion: true});
        this.editor.setReadOnly(this.readonly);
        this.editor.getSession().setMode(this.mode);
        this.editor.getSession().setAnnotations(this.annotations);
        this.editor.getSession().on("change", () => {
            this.code = this.editor.getValue();
            this.codeChange.emit(this.code);
        });
    }

    ngOnDestroy():void {
        this.editor.destroy();
    }
}
