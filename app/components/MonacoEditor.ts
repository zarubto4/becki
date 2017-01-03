/**
 * Created by davidhradek on 15.12.16.
 */

///<reference path="../../node_modules/monaco-editor/monaco.d.ts"/>

import {
    Component,
    OnDestroy,
    OnChanges,
    AfterViewInit,
    ElementRef,
    Input,
    ViewChild,
    Output,
    EventEmitter,
    SimpleChanges
} from "@angular/core";
import {Subscription} from "rxjs";
import {MonacoEditorLoaderService} from "../services/MonacoEditorLoaderService";

@Component({
    selector: "monaco-editor",
    template: `<div data-ref-field class="form-control" style="position: relative; height: 60vh; padding: 0;"></div>`
})
export class MonacoEditor implements AfterViewInit, OnChanges, OnDestroy {

    @Input()
    code: string;

    @Input()
    language: string = "typescript";

    @Input()
    typings: string[] = [];

    @Input()
    readonly: boolean = false;

    @ViewChild("field")
    field: ElementRef;

    //TODO: annotations

    editor: monaco.editor.IStandaloneCodeEditor;

    @Output("codeChange")
    codeChange = new EventEmitter<string>();

    monacoSubscription: Subscription = null;

    constructor(protected monacoEditorLoaderService:MonacoEditorLoaderService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        let code = changes["code"];
        // TODO: https://github.com/angular/angular/issues/6114
        if (code && this.editor && code.currentValue !=  this.editor.getModel().getValue()) {
            this.editor.getModel().setValue(code.currentValue);
        }
        let language = changes["language"];
        if (language && this.editor) {
            throw new Error("Cannot change editor language after init.");
        }
        let readonly = changes["readonly"];
        if (readonly && this.editor) {
            this.editor.updateOptions({readOnly: readonly.currentValue});
        }
        let typings = changes["typings"];
        if (typings && this.editor) {
            this.monacoEditorLoaderService.setTypescriptTypings(typings.currentValue);
        }
    }

    ngAfterViewInit(): void {
        this.monacoSubscription = this.monacoEditorLoaderService.monacoLoaded.subscribe(() => {

            this.monacoEditorLoaderService.setTypescriptTypings(this.typings);

            this.editor = monaco.editor.create(this.field.nativeElement, {
                value: this.code,
                language: this.language,
                readOnly: this.readonly,
                theme: "vs-dark",
                automaticLayout: true,
                autoClosingBrackets: false
            });
            this.editor.getModel().onDidChangeContent(() => {
                this.code = this.editor.getModel().getValue();
                this.codeChange.emit(this.code);
            });

        });
    }

    ngOnDestroy(): void {
        if (this.monacoSubscription) this.monacoSubscription.unsubscribe();
        this.editor.dispose();
    }
}
