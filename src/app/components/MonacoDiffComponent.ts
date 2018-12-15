/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

///<reference path="../../../node_modules/monaco-editor/monaco.d.ts"/>

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
    SimpleChanges,
    NgZone
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MonacoEditorLoaderService } from '../services/MonacoEditorLoaderService';
import { TranslationService } from '../services/TranslationService';

@Component({
    selector: 'bk-monaco-diff',
    template: `
        <div class="monaco-editor form-control" [class.monaco-full-screen]="fullScreen">
            <div class="monaco-container" data-ref-field></div>
        </div>
    `
})
export class MonacoDiffComponent implements AfterViewInit, OnChanges, OnDestroy {

    @Input()
    originalCode: string;

    @Input()
    code: string;

    @Input()
    language: string = 'cpp';

    @ViewChild('field')
    field: ElementRef;

    // TODO: annotations

    editor: monaco.editor.IStandaloneCodeEditor;
    diffEditor: monaco.editor.IStandaloneDiffEditor;

    fullScreen: boolean = false;

    @Output('codeChange')
    codeChange = new EventEmitter<string>();

    monacoSubscription: Subscription = null;

    constructor(protected monacoEditorLoaderService: MonacoEditorLoaderService, protected zone: NgZone, private translationService: TranslationService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.zone.runOutsideAngular(() => {
            let code = changes['code'];
            let originalCode = changes['originalCode'];
            // TODO: https://github.com/angular/angular/issues/6114
            if (originalCode && this.diffEditor && originalCode.currentValue !== this.diffEditor.getModel().original.getValue()) {
                this.diffEditor.getModel().original.setValue(originalCode.currentValue);
            }
            if (code && this.diffEditor && code.currentValue !== this.diffEditor.getModel().modified.getValue()) {
                this.diffEditor.getModel().modified.setValue(code.currentValue);
            }
        });
    }

    ngAfterViewInit(): void {
        this.zone.runOutsideAngular(() => {
            this.monacoSubscription = this.monacoEditorLoaderService.monacoLoaded.subscribe(() => {
                this.diffEditor = monaco.editor.createDiffEditor(this.field.nativeElement, {
                    theme: 'vs-dark',
                    automaticLayout: true,
                    originalEditable: false,
                    readOnly: true,
                });

                let originalModel = monaco.editor.createModel(this.originalCode, this.language);
                let modifiedModel = monaco.editor.createModel(this.code, this.language);
                this.diffEditor.setModel({
                    original: originalModel,
                    modified: modifiedModel
                });

                this.diffEditor.getModel().modified.onDidChangeContent(() => {
                    this.code = this.diffEditor.getModel().modified.getValue();
                    this.zone.run(() => {
                        this.codeChange.emit(this.code);
                    });
                });

            });
        });
    }

    ngOnDestroy(): void {
        this.zone.runOutsideAngular(() => {
            if (this.monacoSubscription) {
                this.monacoSubscription.unsubscribe();
            }
            if (this.editor) {
                this.editor.dispose();
            }
            if (this.diffEditor) {
                this.diffEditor.dispose();
            }
        });

        this.enableScroll();
    }

    onFullscreenClick(): void {
        this.fullScreen = !this.fullScreen;
        if (this.fullScreen) {
            this.disableScroll();
        } else {
            this.enableScroll();
        }
    }


    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    protected preventDefault(e: any) {
        e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.returnValue = false;
    }

    protected preventDefaultForScrollKeys(e: any) {
        const keys = [37, 38, 39, 40];

        if (keys.indexOf(e.keyCode) !== -1) {
            this.preventDefault(e);
            return false;
        }
    }

    protected disableScroll() {
        if (window.addEventListener) {
            window.addEventListener('DOMMouseScroll', this.preventDefault, false);
        }
        window.onwheel = this.preventDefault; // modern standard
        window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
        window.ontouchmove = this.preventDefault; // mobile
        document.onkeydown = this.preventDefaultForScrollKeys;
    }

    protected enableScroll() {
        if (window.removeEventListener) {
            window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
        }
        window.onmousewheel = document.onmousewheel = null;
        window.onwheel = null;
        window.ontouchmove = null;
        document.onkeydown = null;
    }
}
