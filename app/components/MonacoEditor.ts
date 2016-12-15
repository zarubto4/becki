/**
 * Created by davidhradek on 15.12.16.
 */

///<reference path="../../node_modules/monaco-editor/monaco.d.ts"/>
//const editor = require("monaco-editor/editor/editor.main");

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

@Component({
    selector: "monaco-editor",
    template: `<div data-ref-field class="form-control" style="position: relative; height: 60vh; padding: 0;"></div>`
})
export class MonacoEditor implements AfterViewInit, OnChanges, OnDestroy {

    @Input()
    code: string;

    @Input()
    mode: string;

    @Input()
    readonly: boolean;

    @Input()
    annotations: AceAjax.Annotation[] = [];

    @ViewChild("field")
    field: ElementRef;

    editor: monaco.editor.IStandaloneCodeEditor;

    @Output("codeChange")
    codeChange = new EventEmitter<string>();

    ngOnChanges(changes: SimpleChanges): void {
        /*let code = changes["code"];
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
        }*/
    }

    ngAfterViewInit(): void {
        // Inspired by https://github.com/0plus1/ng2-monaco-editor/blob/master/src/component/monaco-editor.component.ts

        let onGotAmdLoader = () => {
            // Load monaco
            (<any>window).require.config({ paths: { 'vs': 'node_modules/monaco-editor/min/vs' } });
            (<any>window).require(['vs/editor/editor.main'], () => {


                monaco.languages.typescript.typescriptDefaults.addExtraLib(`
                    declare enum ArgTypes {
                        ByzanceString,
                        ByzanceInt,
                        ByzanceFloat,
                        ByzanceBool
                    }
                    declare interface Block {
                        addDigitalInput: (inputId:string, inputName:string)=>void;
                        addAnalogInput: (inputId:string, inputName:string)=>void;
                        addMessageInput: (inputId:string, inputName:string, argumentTypes:ArgTypes[])=>void;
                        addDigitalOutput: (outputId:string, outputName:string)=>void;
                        addAnalogOutput: (outputId:string, outputName:string)=>void;
                        addMessageOutput: (outputId:string, outputName:string, argumentTypes:ArgTypes[])=>void;
                    }
                    declare var block:Block;
                `);

                this.editor = monaco.editor.create(this.field.nativeElement, {
                    value: this.code,
                    language: "typescript",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: this.readonly,
                    theme: "vs-dark",
                });
                this.editor.getModel().onDidChangeContent(() => {
                    this.code = this.editor.getModel().getValue();
                    this.codeChange.emit(this.code);
                });
            });
        };

        // Load AMD loader if necessary
        if (!(<any>window).require) {
            let loaderScript = document.createElement('script');
            loaderScript.type = 'text/javascript';
            loaderScript.src = 'node_modules/monaco-editor/min/vs/loader.js';
            loaderScript.addEventListener('load', onGotAmdLoader);
            document.body.appendChild(loaderScript);
        } else {
            onGotAmdLoader();
        }

        //});
        /*this.editor = ace.edit(this.field.nativeElement);
        this.editor.setOptions({enableBasicAutocompletion: true});
        this.editor.setReadOnly(this.readonly);
        this.editor.getSession().setMode(this.mode);
        this.editor.getSession().setAnnotations(this.annotations);
        this.editor.getSession().on("change", () => {
            this.code = this.editor.getValue();
            this.codeChange.emit(this.code);
        });*/
    }

    ngOnDestroy(): void {
        //this.editor.destroy();
    }
}
