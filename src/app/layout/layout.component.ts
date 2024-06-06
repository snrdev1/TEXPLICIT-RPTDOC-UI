import { Component, ViewChild, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementQueries } from 'css-element-queries';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { LocalStorageService } from '../core/local-storage.service';
import { DemoRequestDialogComponent } from '../shared/components/modal-dialog/demo-request-dialog/demo-request-dialog.component';
import { LoginDialogComponent } from '../shared/components/modal-dialog/login-dialog/login-dialog.component';
import { CommonService } from '../shared/services/common.service';
import { WebSocketService } from '../shared/services/socketio.service';
import { DisclaimerDialogComponent } from './modal-dialog/disclaimer-dialog/disclaimer-dialog.component';
import { FeedbackDialogComponent } from './modal-dialog/feedback-dialog/feedback-dialog.component';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  observer: any;
  user: any = [];
  menuIds: any = [];
  menu: any = [];
  userName: string = "";
  userId: string = "";
  rightOpened: boolean = false;
  socketError: string = "";
  socketSuccess: string = "";
  socketInfo: string = "";
  userInfo: any = [];
  public userMenu: any = [];
  userRole: number = 3;
  userInfo$: Observable<any> = this.localStorage.userInfo$;
  sidenavState: boolean = false;
  windowWidth: number = window.innerWidth;
  sidenavMode: MatDrawerMode = "side";
  @ViewChild('leftnav') leftnav!: MatSidenav; // Get a reference to MatSidenav

  constructor(
    public commonService: CommonService,
    private authService: AuthService,
    public localStorage: LocalStorageService,
    public socketService: WebSocketService,
    public router: Router,
    private dialog: MatDialog,
    private el: ElementRef,
    private render: Renderer2,
    private route: ActivatedRoute
  ) {
    this.localStorage.observeUserInfo();
    this.userInfo$.subscribe((userInfo) => {
      this.userId = userInfo?._id;
      this.userName = userInfo?.name;
      this.userRole = userInfo?.role;
    });
  }

  ngOnInit() {

    // Set default state of sidenav
    this.setSidenavState();

    // this.checkUserRole();

    if (this.checkLogin()) {
      this.socketError = this.userId + '_error';
      this.socketService.listen(this.socketError).subscribe({
        next: (res) => {
          console.log("RES IN ERROR SOCKET", res);
          this.commonService.showSnackbar("snackbar-error", res);
        }
      })

      this.socketSuccess = this.userId + '_success';
      this.socketService.listen(this.socketSuccess).subscribe({
        next: (res) => {
          console.log("RES IN SUCCESS SOCKET", res);
          this.commonService.showSnackbar("snackbar-success", res);
        }
      })

      this.socketInfo = this.userId + '_info';
      this.socketService.listen(this.socketInfo).subscribe({
        next: (res) => {
          console.log("RES IN INFO SOCKET", res);
          this.commonService.showSnackbar("snackbar-info", res);
        }
      })
    }

    this.route.queryParams.subscribe((params: any) => {
      if (params['id'] == 'demo') {
        this.onRequestDemoClick();

      }
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    // Update window width on resize event
    this.windowWidth = (event.target as Window).innerWidth;
    this.setSidenavState();
  }

  setSidenavState() {
    if (this.windowWidth > 1200) {
      this.sidenavState = true;
      this.sidenavMode = "side";
    }
    else {
      this.sidenavState = false;
      this.sidenavMode = "over";
    }
  }

  checkLogin() {
    return this.authService.isLoggedIn;
  }

  onContactClick() {
    this.router.navigate(['/contact-us']);
    this.closeSidenav();
  }

  onPricingClick() {
    // Blocking it temporarily
    // this.router.navigate(['/payment']);

    this.dialog.open(DemoRequestDialogComponent, { panelClass: 'mat-dialog-panel' });
    this.closeSidenav();
  }

  onUserProfileClick() {
    this.router.navigate(['/profile']);
    this.closeSidenav();
  }

  onDisclaimerClick() {
    const dialogRef = this.dialog.open(DisclaimerDialogComponent, { panelClass: 'mat-dialog-panel' });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    this.closeSidenav();
  }

  onFeedbackClick() {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, { panelClass: 'mat-dialog-panel' });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    this.closeSidenav();
  }

  onPrivacyClick() {
    this.router.navigate(['/privacy-policy']);
    this.closeSidenav();
  }

  ngAfterViewInit() {
    ElementQueries.listen();
    ElementQueries.init();
  }

  onLogoutClick() {
    this.authService.logout();
    this.closeSidenav();
    this.commonService.clearUserMenu();
  }

  isUserLoggedIn() {
    return this.authService.isLoggedIn;
  }

  onRegistrationClick() {
    // Blocking it temporarily
    // this.router.navigateByUrl('/registration');

    this.dialog.open(DemoRequestDialogComponent, { panelClass: 'mat-dialog-panel' });
  }

  checkUserProfessional() {
    return this.userRole === 2;
  }

  checkUserAdmin() {
    return this.userRole === 1;
  }

  onLoginClick() {
    this.dialog.open(LoginDialogComponent, { panelClass: 'mat-dialog-panel' });
  }

  onRequestDemoClick() {
    this.dialog.open(DemoRequestDialogComponent, { panelClass: 'mat-dialog-panel' });
    this.closeSidenav();
  }

  closeSidenav() {
    if (this.windowWidth <= 1200 && this.leftnav.opened) {
      this.leftnav.toggle(); // Call toggle() on MatSidenav reference
    }
  }
}
