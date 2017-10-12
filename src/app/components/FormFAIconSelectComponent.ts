
import { Component, Input, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';
import { Subscription } from 'rxjs';
import { TranslationService } from '../services/TranslationService';


@Component({
    selector: 'bk-form-fa-icon-select',
/* tslint:disable:max-line-length */
    template: `
<div class="form-group icon-select-group" [class.has-success]="control && (!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid))" [class.has-error]="control && (!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid))" [class.has-warning]="control && (!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending))">
    <label>{{label}}</label>
    <div class="form-control cursor-hand select-input" (click)="onIconSelectClick()">
        <span *ngIf="value" class="fa icon-select-icon {{value}}"></span>
        {{value?value:(placeholder?placeholder:label)}}
        <span class="fa icon-select-down-icon fa-angle-down fa-pull-right"></span>
        <div class="clearfix"></div>
    </div>
    <div class="form-control icon-select-table" [class.open]="iconSelectOpen">
        <div *ngFor="let icon of iconSelectOptions;" class="fa icon-select-block" [class.selected]="icon.name == value" (click)="onIconSelectBlockClick(icon.name)">{{icon.icon}}</div>
        <div class="clearfix"></div>
    </div>
    <span class="help-block" *ngIf="control && (!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid))">{{validatorErrorsService.getMessageForErrors(control.errors)}}</span>
</div>
`
/* tslint:enable */
})
export class FormFAIconSelectComponent implements OnInit, OnDestroy {

    @Input()
    control: AbstractControl = null;

    @Input()
    value: string = '';

    @Output()
    valueChange: EventEmitter<string> = new EventEmitter<string>();

    @Input()
    label: string = this.translationService.translate('label_unknown_label', this, null);

    @Input()
    placeholder: string = null;

    @Input()
    readonly: boolean = false;

    @Input()
    waitForTouch: boolean = true;

    iconSelectOptions: {name: string, icon: string}[] = [];
    iconSelectOpen: boolean = false;

    valueSubscription: Subscription = null;

    constructor(private translationService: TranslationService ,    public validatorErrorsService: ValidatorErrorsService) {
    }

    ngOnInit(): void {
        if (this.readonly) {
            throw Error(this.translationService.translate('error_readonly_not_support', this, null));
        }

        this.iconSelectOptions = [];
        let usedIcons: string[] = [];
        // tslint:disable-next-line:forin
        for (let key in FormFAIconSelectComponent.FontAwesomeMap) {
            let fa: string = (<any>FormFAIconSelectComponent.FontAwesomeMap)[key];
            if (usedIcons.indexOf(fa) > -1) {
                continue;
            }
            usedIcons.push(fa);
            this.iconSelectOptions.push({
                name: key,
                icon: fa
            });
        }
        this.iconSelectOptions.sort((a, b) => a.name.localeCompare(b.name));

        if (this.control) {
            this.value = this.control.value;
            this.valueSubscription = this.control.valueChanges.subscribe((value) => {
                if (value === this.value) {
                    return;
                }
                this.value = value;
            });
        }
    }

    ngOnDestroy(): void {
        if (this.valueSubscription) {
            this.valueSubscription.unsubscribe();
        }
    }

    onIconSelectBlockClick(name: string) {
        this.iconSelectOpen = false;
        this.value = name;
        if (this.control) {
            this.control.setValue(name);
        }
        this.valueChange.emit(name);
    }

    onIconSelectClick() {
        if (this.iconSelectOpen) {
            if (this.control) {
                this.control.markAsTouched();
            }
        }
        this.iconSelectOpen = !this.iconSelectOpen;
    }

    // FontAwesome 4.7.0
    // tslint:disable-next-line:max-line-length whitespace member-ordering
    public static FontAwesomeMap = {'fa-glass':'\uf000','fa-music':'\uf001','fa-search':'\uf002','fa-envelope-o':'\uf003','fa-heart':'\uf004','fa-star':'\uf005','fa-star-o':'\uf006','fa-user':'\uf007','fa-film':'\uf008','fa-th-large':'\uf009','fa-th':'\uf00a','fa-th-list':'\uf00b','fa-check':'\uf00c','fa-remove':'\uf00d','fa-close':'\uf00d','fa-times':'\uf00d','fa-search-plus':'\uf00e','fa-search-minus':'\uf010','fa-power-off':'\uf011','fa-signal':'\uf012','fa-gear':'\uf013','fa-cog':'\uf013','fa-trash-o':'\uf014','fa-home':'\uf015','fa-file-o':'\uf016','fa-clock-o':'\uf017','fa-road':'\uf018','fa-download':'\uf019','fa-arrow-circle-o-down':'\uf01a','fa-arrow-circle-o-up':'\uf01b','fa-inbox':'\uf01c','fa-play-circle-o':'\uf01d','fa-rotate-right':'\uf01e','fa-repeat':'\uf01e','fa-refresh':'\uf021','fa-list-alt':'\uf022','fa-lock':'\uf023','fa-flag':'\uf024','fa-headphones':'\uf025','fa-volume-off':'\uf026','fa-volume-down':'\uf027','fa-volume-up':'\uf028','fa-qrcode':'\uf029','fa-barcode':'\uf02a','fa-tag':'\uf02b','fa-tags':'\uf02c','fa-book':'\uf02d','fa-bookmark':'\uf02e','fa-print':'\uf02f','fa-camera':'\uf030','fa-font':'\uf031','fa-bold':'\uf032','fa-italic':'\uf033','fa-text-height':'\uf034','fa-text-width':'\uf035','fa-align-left':'\uf036','fa-align-center':'\uf037','fa-align-right':'\uf038','fa-align-justify':'\uf039','fa-list':'\uf03a','fa-dedent':'\uf03b','fa-outdent':'\uf03b','fa-indent':'\uf03c','fa-video-camera':'\uf03d','fa-photo':'\uf03e','fa-image':'\uf03e','fa-picture-o':'\uf03e','fa-pencil':'\uf040','fa-map-marker':'\uf041','fa-adjust':'\uf042','fa-tint':'\uf043','fa-edit':'\uf044','fa-pencil-square-o':'\uf044','fa-share-square-o':'\uf045','fa-check-square-o':'\uf046','fa-arrows':'\uf047','fa-step-backward':'\uf048','fa-fast-backward':'\uf049','fa-backward':'\uf04a','fa-play':'\uf04b','fa-pause':'\uf04c','fa-stop':'\uf04d','fa-forward':'\uf04e','fa-fast-forward':'\uf050','fa-step-forward':'\uf051','fa-eject':'\uf052','fa-chevron-left':'\uf053','fa-chevron-right':'\uf054','fa-plus-circle':'\uf055','fa-minus-circle':'\uf056','fa-times-circle':'\uf057','fa-check-circle':'\uf058','fa-question-circle':'\uf059','fa-info-circle':'\uf05a','fa-crosshairs':'\uf05b','fa-times-circle-o':'\uf05c','fa-check-circle-o':'\uf05d','fa-ban':'\uf05e','fa-arrow-left':'\uf060','fa-arrow-right':'\uf061','fa-arrow-up':'\uf062','fa-arrow-down':'\uf063','fa-mail-forward':'\uf064','fa-share':'\uf064','fa-expand':'\uf065','fa-compress':'\uf066','fa-plus':'\uf067','fa-minus':'\uf068','fa-asterisk':'\uf069','fa-exclamation-circle':'\uf06a','fa-gift':'\uf06b','fa-leaf':'\uf06c','fa-fire':'\uf06d','fa-eye':'\uf06e','fa-eye-slash':'\uf070','fa-warning':'\uf071','fa-exclamation-triangle':'\uf071','fa-plane':'\uf072','fa-calendar':'\uf073','fa-random':'\uf074','fa-comment':'\uf075','fa-magnet':'\uf076','fa-chevron-up':'\uf077','fa-chevron-down':'\uf078','fa-retweet':'\uf079','fa-shopping-cart':'\uf07a','fa-folder':'\uf07b','fa-folder-open':'\uf07c','fa-arrows-v':'\uf07d','fa-arrows-h':'\uf07e','fa-bar-chart-o':'\uf080','fa-bar-chart':'\uf080','fa-twitter-square':'\uf081','fa-facebook-square':'\uf082','fa-camera-retro':'\uf083','fa-key':'\uf084','fa-gears':'\uf085','fa-cogs':'\uf085','fa-comments':'\uf086','fa-thumbs-o-up':'\uf087','fa-thumbs-o-down':'\uf088','fa-star-half':'\uf089','fa-heart-o':'\uf08a','fa-sign-out':'\uf08b','fa-linkedin-square':'\uf08c','fa-thumb-tack':'\uf08d','fa-external-link':'\uf08e','fa-sign-in':'\uf090','fa-trophy':'\uf091','fa-github-square':'\uf092','fa-upload':'\uf093','fa-lemon-o':'\uf094','fa-phone':'\uf095','fa-square-o':'\uf096','fa-bookmark-o':'\uf097','fa-phone-square':'\uf098','fa-twitter':'\uf099','fa-facebook-f':'\uf09a','fa-facebook':'\uf09a','fa-github':'\uf09b','fa-unlock':'\uf09c','fa-credit-card':'\uf09d','fa-feed':'\uf09e','fa-rss':'\uf09e','fa-hdd-o':'\uf0a0','fa-bullhorn':'\uf0a1','fa-bell':'\uf0f3','fa-certificate':'\uf0a3','fa-hand-o-right':'\uf0a4','fa-hand-o-left':'\uf0a5','fa-hand-o-up':'\uf0a6','fa-hand-o-down':'\uf0a7','fa-arrow-circle-left':'\uf0a8','fa-arrow-circle-right':'\uf0a9','fa-arrow-circle-up':'\uf0aa','fa-arrow-circle-down':'\uf0ab','fa-globe':'\uf0ac','fa-wrench':'\uf0ad','fa-tasks':'\uf0ae','fa-filter':'\uf0b0','fa-briefcase':'\uf0b1','fa-arrows-alt':'\uf0b2','fa-group':'\uf0c0','fa-users':'\uf0c0','fa-chain':'\uf0c1','fa-link':'\uf0c1','fa-cloud':'\uf0c2','fa-flask':'\uf0c3','fa-cut':'\uf0c4','fa-scissors':'\uf0c4','fa-copy':'\uf0c5','fa-files-o':'\uf0c5','fa-paperclip':'\uf0c6','fa-save':'\uf0c7','fa-floppy-o':'\uf0c7','fa-square':'\uf0c8','fa-navicon':'\uf0c9','fa-reorder':'\uf0c9','fa-bars':'\uf0c9','fa-list-ul':'\uf0ca','fa-list-ol':'\uf0cb','fa-strikethrough':'\uf0cc','fa-underline':'\uf0cd','fa-table':'\uf0ce','fa-magic':'\uf0d0','fa-truck':'\uf0d1','fa-pinterest':'\uf0d2','fa-pinterest-square':'\uf0d3','fa-google-plus-square':'\uf0d4','fa-google-plus':'\uf0d5','fa-money':'\uf0d6','fa-caret-down':'\uf0d7','fa-caret-up':'\uf0d8','fa-caret-left':'\uf0d9','fa-caret-right':'\uf0da','fa-columns':'\uf0db','fa-unsorted':'\uf0dc','fa-sort':'\uf0dc','fa-sort-down':'\uf0dd','fa-sort-desc':'\uf0dd','fa-sort-up':'\uf0de','fa-sort-asc':'\uf0de','fa-envelope':'\uf0e0','fa-linkedin':'\uf0e1','fa-rotate-left':'\uf0e2','fa-undo':'\uf0e2','fa-legal':'\uf0e3','fa-gavel':'\uf0e3','fa-dashboard':'\uf0e4','fa-tachometer':'\uf0e4','fa-comment-o':'\uf0e5','fa-comments-o':'\uf0e6','fa-flash':'\uf0e7','fa-bolt':'\uf0e7','fa-sitemap':'\uf0e8','fa-umbrella':'\uf0e9','fa-paste':'\uf0ea','fa-clipboard':'\uf0ea','fa-lightbulb-o':'\uf0eb','fa-exchange':'\uf0ec','fa-cloud-download':'\uf0ed','fa-cloud-upload':'\uf0ee','fa-user-md':'\uf0f0','fa-stethoscope':'\uf0f1','fa-suitcase':'\uf0f2','fa-bell-o':'\uf0a2','fa-coffee':'\uf0f4','fa-cutlery':'\uf0f5','fa-file-text-o':'\uf0f6','fa-building-o':'\uf0f7','fa-hospital-o':'\uf0f8','fa-ambulance':'\uf0f9','fa-medkit':'\uf0fa','fa-fighter-jet':'\uf0fb','fa-beer':'\uf0fc','fa-h-square':'\uf0fd','fa-plus-square':'\uf0fe','fa-angle-double-left':'\uf100','fa-angle-double-right':'\uf101','fa-angle-double-up':'\uf102','fa-angle-double-down':'\uf103','fa-angle-left':'\uf104','fa-angle-right':'\uf105','fa-angle-up':'\uf106','fa-angle-down':'\uf107','fa-desktop':'\uf108','fa-laptop':'\uf109','fa-tablet':'\uf10a','fa-mobile-phone':'\uf10b','fa-mobile':'\uf10b','fa-circle-o':'\uf10c','fa-quote-left':'\uf10d','fa-quote-right':'\uf10e','fa-spinner':'\uf110','fa-circle':'\uf111','fa-mail-reply':'\uf112','fa-reply':'\uf112','fa-github-alt':'\uf113','fa-folder-o':'\uf114','fa-folder-open-o':'\uf115','fa-smile-o':'\uf118','fa-frown-o':'\uf119','fa-meh-o':'\uf11a','fa-gamepad':'\uf11b','fa-keyboard-o':'\uf11c','fa-flag-o':'\uf11d','fa-flag-checkered':'\uf11e','fa-terminal':'\uf120','fa-code':'\uf121','fa-mail-reply-all':'\uf122','fa-reply-all':'\uf122','fa-star-half-empty':'\uf123','fa-star-half-full':'\uf123','fa-star-half-o':'\uf123','fa-location-arrow':'\uf124','fa-crop':'\uf125','fa-code-fork':'\uf126','fa-unlink':'\uf127','fa-chain-broken':'\uf127','fa-question':'\uf128','fa-info':'\uf129','fa-exclamation':'\uf12a','fa-superscript':'\uf12b','fa-subscript':'\uf12c','fa-eraser':'\uf12d','fa-puzzle-piece':'\uf12e','fa-microphone':'\uf130','fa-microphone-slash':'\uf131','fa-shield':'\uf132','fa-calendar-o':'\uf133','fa-fire-extinguisher':'\uf134','fa-rocket':'\uf135','fa-maxcdn':'\uf136','fa-chevron-circle-left':'\uf137','fa-chevron-circle-right':'\uf138','fa-chevron-circle-up':'\uf139','fa-chevron-circle-down':'\uf13a','fa-html5':'\uf13b','fa-css3':'\uf13c','fa-anchor':'\uf13d','fa-unlock-alt':'\uf13e','fa-bullseye':'\uf140','fa-ellipsis-h':'\uf141','fa-ellipsis-v':'\uf142','fa-rss-square':'\uf143','fa-play-circle':'\uf144','fa-ticket':'\uf145','fa-minus-square':'\uf146','fa-minus-square-o':'\uf147','fa-level-up':'\uf148','fa-level-down':'\uf149','fa-check-square':'\uf14a','fa-pencil-square':'\uf14b','fa-external-link-square':'\uf14c','fa-share-square':'\uf14d','fa-compass':'\uf14e','fa-toggle-down':'\uf150','fa-caret-square-o-down':'\uf150','fa-toggle-up':'\uf151','fa-caret-square-o-up':'\uf151','fa-toggle-right':'\uf152','fa-caret-square-o-right':'\uf152','fa-euro':'\uf153','fa-eur':'\uf153','fa-gbp':'\uf154','fa-dollar':'\uf155','fa-usd':'\uf155','fa-rupee':'\uf156','fa-inr':'\uf156','fa-cny':'\uf157','fa-rmb':'\uf157','fa-yen':'\uf157','fa-jpy':'\uf157','fa-ruble':'\uf158','fa-rouble':'\uf158','fa-rub':'\uf158','fa-won':'\uf159','fa-krw':'\uf159','fa-bitcoin':'\uf15a','fa-btc':'\uf15a','fa-file':'\uf15b','fa-file-text':'\uf15c','fa-sort-alpha-asc':'\uf15d','fa-sort-alpha-desc':'\uf15e','fa-sort-amount-asc':'\uf160','fa-sort-amount-desc':'\uf161','fa-sort-numeric-asc':'\uf162','fa-sort-numeric-desc':'\uf163','fa-thumbs-up':'\uf164','fa-thumbs-down':'\uf165','fa-youtube-square':'\uf166','fa-youtube':'\uf167','fa-xing':'\uf168','fa-xing-square':'\uf169','fa-youtube-play':'\uf16a','fa-dropbox':'\uf16b','fa-stack-overflow':'\uf16c','fa-instagram':'\uf16d','fa-flickr':'\uf16e','fa-adn':'\uf170','fa-bitbucket':'\uf171','fa-bitbucket-square':'\uf172','fa-tumblr':'\uf173','fa-tumblr-square':'\uf174','fa-long-arrow-down':'\uf175','fa-long-arrow-up':'\uf176','fa-long-arrow-left':'\uf177','fa-long-arrow-right':'\uf178','fa-apple':'\uf179','fa-windows':'\uf17a','fa-android':'\uf17b','fa-linux':'\uf17c','fa-dribbble':'\uf17d','fa-skype':'\uf17e','fa-foursquare':'\uf180','fa-trello':'\uf181','fa-female':'\uf182','fa-male':'\uf183','fa-gittip':'\uf184','fa-gratipay':'\uf184','fa-sun-o':'\uf185','fa-moon-o':'\uf186','fa-archive':'\uf187','fa-bug':'\uf188','fa-vk':'\uf189','fa-weibo':'\uf18a','fa-renren':'\uf18b','fa-pagelines':'\uf18c','fa-stack-exchange':'\uf18d','fa-arrow-circle-o-right':'\uf18e','fa-arrow-circle-o-left':'\uf190','fa-toggle-left':'\uf191','fa-caret-square-o-left':'\uf191','fa-dot-circle-o':'\uf192','fa-wheelchair':'\uf193','fa-vimeo-square':'\uf194','fa-turkish-lira':'\uf195','fa-try':'\uf195','fa-plus-square-o':'\uf196','fa-space-shuttle':'\uf197','fa-slack':'\uf198','fa-envelope-square':'\uf199','fa-wordpress':'\uf19a','fa-openid':'\uf19b','fa-institution':'\uf19c','fa-bank':'\uf19c','fa-university':'\uf19c','fa-mortar-board':'\uf19d','fa-graduation-cap':'\uf19d','fa-yahoo':'\uf19e','fa-google':'\uf1a0','fa-reddit':'\uf1a1','fa-reddit-square':'\uf1a2','fa-stumbleupon-circle':'\uf1a3','fa-stumbleupon':'\uf1a4','fa-delicious':'\uf1a5','fa-digg':'\uf1a6','fa-pied-piper-pp':'\uf1a7','fa-pied-piper-alt':'\uf1a8','fa-drupal':'\uf1a9','fa-joomla':'\uf1aa','fa-language':'\uf1ab','fa-fax':'\uf1ac','fa-building':'\uf1ad','fa-child':'\uf1ae','fa-paw':'\uf1b0','fa-spoon':'\uf1b1','fa-cube':'\uf1b2','fa-cubes':'\uf1b3','fa-behance':'\uf1b4','fa-behance-square':'\uf1b5','fa-steam':'\uf1b6','fa-steam-square':'\uf1b7','fa-recycle':'\uf1b8','fa-automobile':'\uf1b9','fa-car':'\uf1b9','fa-cab':'\uf1ba','fa-taxi':'\uf1ba','fa-tree':'\uf1bb','fa-spotify':'\uf1bc','fa-deviantart':'\uf1bd','fa-soundcloud':'\uf1be','fa-database':'\uf1c0','fa-file-pdf-o':'\uf1c1','fa-file-word-o':'\uf1c2','fa-file-excel-o':'\uf1c3','fa-file-powerpoint-o':'\uf1c4','fa-file-photo-o':'\uf1c5','fa-file-picture-o':'\uf1c5','fa-file-image-o':'\uf1c5','fa-file-zip-o':'\uf1c6','fa-file-archive-o':'\uf1c6','fa-file-sound-o':'\uf1c7','fa-file-audio-o':'\uf1c7','fa-file-movie-o':'\uf1c8','fa-file-video-o':'\uf1c8','fa-file-code-o':'\uf1c9','fa-vine':'\uf1ca','fa-codepen':'\uf1cb','fa-jsfiddle':'\uf1cc','fa-life-bouy':'\uf1cd','fa-life-buoy':'\uf1cd','fa-life-saver':'\uf1cd','fa-support':'\uf1cd','fa-life-ring':'\uf1cd','fa-circle-o-notch':'\uf1ce','fa-ra':'\uf1d0','fa-resistance':'\uf1d0','fa-rebel':'\uf1d0','fa-ge':'\uf1d1','fa-empire':'\uf1d1','fa-git-square':'\uf1d2','fa-git':'\uf1d3','fa-y-combinator-square':'\uf1d4','fa-yc-square':'\uf1d4','fa-hacker-news':'\uf1d4','fa-tencent-weibo':'\uf1d5','fa-qq':'\uf1d6','fa-wechat':'\uf1d7','fa-weixin':'\uf1d7','fa-send':'\uf1d8','fa-paper-plane':'\uf1d8','fa-send-o':'\uf1d9','fa-paper-plane-o':'\uf1d9','fa-history':'\uf1da','fa-circle-thin':'\uf1db','fa-header':'\uf1dc','fa-paragraph':'\uf1dd','fa-sliders':'\uf1de','fa-share-alt':'\uf1e0','fa-share-alt-square':'\uf1e1','fa-bomb':'\uf1e2','fa-soccer-ball-o':'\uf1e3','fa-futbol-o':'\uf1e3','fa-tty':'\uf1e4','fa-binoculars':'\uf1e5','fa-plug':'\uf1e6','fa-slideshare':'\uf1e7','fa-twitch':'\uf1e8','fa-yelp':'\uf1e9','fa-newspaper-o':'\uf1ea','fa-wifi':'\uf1eb','fa-calculator':'\uf1ec','fa-paypal':'\uf1ed','fa-google-wallet':'\uf1ee','fa-cc-visa':'\uf1f0','fa-cc-mastercard':'\uf1f1','fa-cc-discover':'\uf1f2','fa-cc-amex':'\uf1f3','fa-cc-paypal':'\uf1f4','fa-cc-stripe':'\uf1f5','fa-bell-slash':'\uf1f6','fa-bell-slash-o':'\uf1f7','fa-trash':'\uf1f8','fa-copyright':'\uf1f9','fa-at':'\uf1fa','fa-eyedropper':'\uf1fb','fa-paint-brush':'\uf1fc','fa-birthday-cake':'\uf1fd','fa-area-chart':'\uf1fe','fa-pie-chart':'\uf200','fa-line-chart':'\uf201','fa-lastfm':'\uf202','fa-lastfm-square':'\uf203','fa-toggle-off':'\uf204','fa-toggle-on':'\uf205','fa-bicycle':'\uf206','fa-bus':'\uf207','fa-ioxhost':'\uf208','fa-angellist':'\uf209','fa-cc':'\uf20a','fa-shekel':'\uf20b','fa-sheqel':'\uf20b','fa-ils':'\uf20b','fa-meanpath':'\uf20c','fa-buysellads':'\uf20d','fa-connectdevelop':'\uf20e','fa-dashcube':'\uf210','fa-forumbee':'\uf211','fa-leanpub':'\uf212','fa-sellsy':'\uf213','fa-shirtsinbulk':'\uf214','fa-simplybuilt':'\uf215','fa-skyatlas':'\uf216','fa-cart-plus':'\uf217','fa-cart-arrow-down':'\uf218','fa-diamond':'\uf219','fa-ship':'\uf21a','fa-user-secret':'\uf21b','fa-motorcycle':'\uf21c','fa-street-view':'\uf21d','fa-heartbeat':'\uf21e','fa-venus':'\uf221','fa-mars':'\uf222','fa-mercury':'\uf223','fa-intersex':'\uf224','fa-transgender':'\uf224','fa-transgender-alt':'\uf225','fa-venus-double':'\uf226','fa-mars-double':'\uf227','fa-venus-mars':'\uf228','fa-mars-stroke':'\uf229','fa-mars-stroke-v':'\uf22a','fa-mars-stroke-h':'\uf22b','fa-neuter':'\uf22c','fa-genderless':'\uf22d','fa-facebook-official':'\uf230','fa-pinterest-p':'\uf231','fa-whatsapp':'\uf232','fa-server':'\uf233','fa-user-plus':'\uf234','fa-user-times':'\uf235','fa-hotel':'\uf236','fa-bed':'\uf236','fa-viacoin':'\uf237','fa-train':'\uf238','fa-subway':'\uf239','fa-medium':'\uf23a','fa-yc':'\uf23b','fa-y-combinator':'\uf23b','fa-optin-monster':'\uf23c','fa-opencart':'\uf23d','fa-expeditedssl':'\uf23e','fa-battery-4':'\uf240','fa-battery':'\uf240','fa-battery-full':'\uf240','fa-battery-3':'\uf241','fa-battery-three-quarters':'\uf241','fa-battery-2':'\uf242','fa-battery-half':'\uf242','fa-battery-1':'\uf243','fa-battery-quarter':'\uf243','fa-battery-0':'\uf244','fa-battery-empty':'\uf244','fa-mouse-pointer':'\uf245','fa-i-cursor':'\uf246','fa-object-group':'\uf247','fa-object-ungroup':'\uf248','fa-sticky-note':'\uf249','fa-sticky-note-o':'\uf24a','fa-cc-jcb':'\uf24b','fa-cc-diners-club':'\uf24c','fa-clone':'\uf24d','fa-balance-scale':'\uf24e','fa-hourglass-o':'\uf250','fa-hourglass-1':'\uf251','fa-hourglass-start':'\uf251','fa-hourglass-2':'\uf252','fa-hourglass-half':'\uf252','fa-hourglass-3':'\uf253','fa-hourglass-end':'\uf253','fa-hourglass':'\uf254','fa-hand-grab-o':'\uf255','fa-hand-rock-o':'\uf255','fa-hand-stop-o':'\uf256','fa-hand-paper-o':'\uf256','fa-hand-scissors-o':'\uf257','fa-hand-lizard-o':'\uf258','fa-hand-spock-o':'\uf259','fa-hand-pointer-o':'\uf25a','fa-hand-peace-o':'\uf25b','fa-trademark':'\uf25c','fa-registered':'\uf25d','fa-creative-commons':'\uf25e','fa-gg':'\uf260','fa-gg-circle':'\uf261','fa-tripadvisor':'\uf262','fa-odnoklassniki':'\uf263','fa-odnoklassniki-square':'\uf264','fa-get-pocket':'\uf265','fa-wikipedia-w':'\uf266','fa-safari':'\uf267','fa-chrome':'\uf268','fa-firefox':'\uf269','fa-opera':'\uf26a','fa-internet-explorer':'\uf26b','fa-tv':'\uf26c','fa-television':'\uf26c','fa-contao':'\uf26d','fa-500px':'\uf26e','fa-amazon':'\uf270','fa-calendar-plus-o':'\uf271','fa-calendar-minus-o':'\uf272','fa-calendar-times-o':'\uf273','fa-calendar-check-o':'\uf274','fa-industry':'\uf275','fa-map-pin':'\uf276','fa-map-signs':'\uf277','fa-map-o':'\uf278','fa-map':'\uf279','fa-commenting':'\uf27a','fa-commenting-o':'\uf27b','fa-houzz':'\uf27c','fa-vimeo':'\uf27d','fa-black-tie':'\uf27e','fa-fonticons':'\uf280','fa-reddit-alien':'\uf281','fa-edge':'\uf282','fa-credit-card-alt':'\uf283','fa-codiepie':'\uf284','fa-modx':'\uf285','fa-fort-awesome':'\uf286','fa-usb':'\uf287','fa-product-hunt':'\uf288','fa-mixcloud':'\uf289','fa-scribd':'\uf28a','fa-pause-circle':'\uf28b','fa-pause-circle-o':'\uf28c','fa-stop-circle':'\uf28d','fa-stop-circle-o':'\uf28e','fa-shopping-bag':'\uf290','fa-shopping-basket':'\uf291','fa-hashtag':'\uf292','fa-bluetooth':'\uf293','fa-bluetooth-b':'\uf294','fa-percent':'\uf295','fa-gitlab':'\uf296','fa-wpbeginner':'\uf297','fa-wpforms':'\uf298','fa-envira':'\uf299','fa-universal-access':'\uf29a','fa-wheelchair-alt':'\uf29b','fa-question-circle-o':'\uf29c','fa-blind':'\uf29d','fa-audio-description':'\uf29e','fa-volume-control-phone':'\uf2a0','fa-braille':'\uf2a1','fa-assistive-listening-systems':'\uf2a2','fa-asl-interpreting':'\uf2a3','fa-american-sign-language-interpreting':'\uf2a3','fa-deafness':'\uf2a4','fa-hard-of-hearing':'\uf2a4','fa-deaf':'\uf2a4','fa-glide':'\uf2a5','fa-glide-g':'\uf2a6','fa-signing':'\uf2a7','fa-sign-language':'\uf2a7','fa-low-vision':'\uf2a8','fa-viadeo':'\uf2a9','fa-viadeo-square':'\uf2aa','fa-snapchat':'\uf2ab','fa-snapchat-ghost':'\uf2ac','fa-snapchat-square':'\uf2ad','fa-pied-piper':'\uf2ae','fa-first-order':'\uf2b0','fa-yoast':'\uf2b1','fa-themeisle':'\uf2b2','fa-google-plus-circle':'\uf2b3','fa-google-plus-official':'\uf2b3','fa-fa':'\uf2b4','fa-font-awesome':'\uf2b4','fa-handshake-o':'\uf2b5','fa-envelope-open':'\uf2b6','fa-envelope-open-o':'\uf2b7','fa-linode':'\uf2b8','fa-address-book':'\uf2b9','fa-address-book-o':'\uf2ba','fa-vcard':'\uf2bb','fa-address-card':'\uf2bb','fa-vcard-o':'\uf2bc','fa-address-card-o':'\uf2bc','fa-user-circle':'\uf2bd','fa-user-circle-o':'\uf2be','fa-user-o':'\uf2c0','fa-id-badge':'\uf2c1','fa-drivers-license':'\uf2c2','fa-id-card':'\uf2c2','fa-drivers-license-o':'\uf2c3','fa-id-card-o':'\uf2c3','fa-quora':'\uf2c4','fa-free-code-camp':'\uf2c5','fa-telegram':'\uf2c6','fa-thermometer-4':'\uf2c7','fa-thermometer':'\uf2c7','fa-thermometer-full':'\uf2c7','fa-thermometer-3':'\uf2c8','fa-thermometer-three-quarters':'\uf2c8','fa-thermometer-2':'\uf2c9','fa-thermometer-half':'\uf2c9','fa-thermometer-1':'\uf2ca','fa-thermometer-quarter':'\uf2ca','fa-thermometer-0':'\uf2cb','fa-thermometer-empty':'\uf2cb','fa-shower':'\uf2cc','fa-bathtub':'\uf2cd','fa-s15':'\uf2cd','fa-bath':'\uf2cd','fa-podcast':'\uf2ce','fa-window-maximize':'\uf2d0','fa-window-minimize':'\uf2d1','fa-window-restore':'\uf2d2','fa-times-rectangle':'\uf2d3','fa-window-close':'\uf2d3','fa-times-rectangle-o':'\uf2d4','fa-window-close-o':'\uf2d4','fa-bandcamp':'\uf2d5','fa-grav':'\uf2d6','fa-etsy':'\uf2d7','fa-imdb':'\uf2d8','fa-ravelry':'\uf2d9','fa-eercast':'\uf2da','fa-microchip':'\uf2db','fa-snowflake-o':'\uf2dc','fa-superpowers':'\uf2dd','fa-wpexplorer':'\uf2de','fa-meetup':'\uf2e0'};

}
