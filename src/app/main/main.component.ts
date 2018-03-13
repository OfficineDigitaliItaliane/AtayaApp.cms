import { Component, OnInit, OnDestroy, ViewChild, HostListener, ViewEncapsulation, AnimationTransitionEvent } from '@angular/core';
import { MenuItems } from '../core/menu/menu-items/menu-items';
import { PageTitleService } from '../core/page-title/page-title.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MediaChange, ObservableMedia } from "@angular/flex-layout";
import { Ng2DeviceService } from 'ng2-device-detector';
import * as Ps from 'perfect-scrollbar';
import { AuthenticationService, User } from '../authentication/authentication.service';
import { UtilsService } from '../common/utils.service';
import { WorkService } from '../work/work.service';
import { ApiServiceService } from '../common/api-service.service';
import { LogServiceService } from '../common/log-service.service';
declare var $: any;

const screenfull = require('screenfull');

@Component({
    selector: 'gene-layout',
    templateUrl: './main-material.html',
    styleUrls: ['./main-material.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, OnDestroy {

    private _router: Subscription;
    header: string;
    currentLang = 'en';
    url: string;
    showSettings = false;
    dark: boolean = true;
    boxed: boolean;
    collapseSidebar: boolean;
    compactSidebar: boolean;
    customizerIn: boolean = false;
    root = 'ltr';
    chatpanelOpen: boolean = false;
    deviceInfo = null;
    user: User;

    private _mediaSubscription: Subscription;
    sidenavOpen: boolean = true;
    sidenavMode: string = 'side';
    isMobile: boolean = false;
    private _routerEventsSubscription: Subscription;

    @ViewChild('sidenav') sidenav;

    constructor(public menuItems: MenuItems,
        private pageTitleService: PageTitleService,
        public translate: TranslateService,
        private router: Router,
        private media: ObservableMedia,
        private deviceService: Ng2DeviceService,
        private authenticationService: AuthenticationService,
        private utils: UtilsService,
        private api: ApiServiceService,
        private logger: LogServiceService
    ) {

        this.user = authenticationService.getUser();
        const browserLang: string = translate.getBrowserLang();
        translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');

    }

    ngOnInit() {
        this.pageTitleService.title.subscribe((val: string) => {
            this.header = val;
        });

        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            this.url = event.url;
        });

        if (this.url != '/session/login' && this.url != '/session/register' && this.url != '/session/forgot-password' && this.url != '/session/lockscreen') {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar-container ');


            if (window.matchMedia(`(min-width: 960px)`).matches) {
                Ps.initialize(elemSidebar, { wheelSpeed: 2, suppressScrollX: true });
            }
        }

        this.deviceInfo = this.deviceService.getDeviceInfo();
        console.log(this.deviceInfo.device);
        if (this.deviceInfo.device == 'ipad' || this.deviceInfo.device == 'iphone' || this.deviceInfo.device == 'android') {
            this.sidenavMode = 'over';
            this.sidenavOpen = false;
        } else {
            this._mediaSubscription = this.media.asObservable().subscribe((change: MediaChange) => {
                let isMobile = (change.mqAlias == 'xs') || (change.mqAlias == 'sm');

                this.isMobile = isMobile;
                this.sidenavMode = (isMobile) ? 'over' : 'side';
                this.sidenavOpen = !isMobile;
            });

            this._routerEventsSubscription = this.router.events.subscribe((event) => {
                if (event instanceof NavigationEnd && this.isMobile) {
                    this.sidenav.close();
                }
            });
        }

        if (this.dark) {
            $('body').addClass('dark-theme-active');
        }
    }

    ngOnDestroy() {
        this._router.unsubscribe();
        this._mediaSubscription.unsubscribe();
    }

    isFullscreen: boolean = false;

    menuMouseOver(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && this.collapseSidebar) {
            this.sidenav.mode = 'over';
        }
    }

    menuMouseOut(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && this.collapseSidebar) {
            this.sidenav.mode = 'side';
        }
    }

    toggleFullscreen() {
        if (screenfull.enabled) {
            screenfull.toggle();
            this.isFullscreen = !this.isFullscreen;
        }
    }

    customizerFunction() {
        this.customizerIn = !this.customizerIn;
    }

    addClassOnBody(event) {
        if (event.checked) {
            $('body').addClass('dark-theme-active');
        } else {
            $('body').removeClass('dark-theme-active');
        }
    }

    onActivate(e, scrollContainer) {
        scrollContainer.scrollTop = 0;
    }

    createBook() {
        this.api.createBook().subscribe(res => {
            this.translate.get('Libro generato correttamente').subscribe((translatedText: string) => {
                this.logger.success(translatedText)
            })
        })
    }
}