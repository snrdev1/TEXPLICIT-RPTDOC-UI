import { Component, NgZone } from '@angular/core';
import { CommonService } from '../shared/services/common.service';
import { ElementQueries } from 'css-element-queries';
import { MatDialog } from '@angular/material/dialog';
import { DisclaimerDialogComponent } from './modal-dialog/disclaimer-dialog/disclaimer-dialog.component';
import { FeedbackDialogComponent } from './modal-dialog/feedback-dialog/feedback-dialog.component';
import { LocalStorageService } from '../core/local-storage.service';
import { AuthService } from '../core/auth.service';
import { Observable } from 'rxjs';
import { WebSocketService } from '../shared/services/socketio.service';
import { Route, Router } from '@angular/router';
import { LoginDialogComponent } from '../shared/components/modal-dialog/login-dialog/login-dialog.component';

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
  constructor(
    public commonService: CommonService,
    private authService: AuthService,
    public localStorage: LocalStorageService,
    public socketService: WebSocketService,
    public router: Router,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.localStorage.getUserInfo();
    this.userInfo$.subscribe((userInfo) =>{
      this.userId = userInfo?._id;
      this.userName = userInfo?.name;
      this.userRole = userInfo?.role;
    });
    this.checkUserRole();

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
  }

  checkLogin() {
    return this.authService.isLoggedIn;
  }
  onAboutClick() {
    this.router.navigate(['/about-us']);

  }

  onContactClick() {
    this.router.navigate(['/contact-us']);
  }

  onPricingClick() {
    this.router.navigate(['/pricing']);
  }

  onDisclaimerClick() {
    const dialogRef = this.dialog.open(DisclaimerDialogComponent, { panelClass: 'mat-dialog-panel' });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onFeedbackClick() {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, { panelClass: 'mat-dialog-panel' });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  chatOpen() {
    return this.commonService.chatOpen;
  }

  newsOpen() {
    return this.commonService.newsOpen;
  }

  ngAfterViewInit() {
    ElementQueries.listen();
    ElementQueries.init();
  }

  onLogoutClick() {
    this.authService.logout();
    this.commonService.clearUserMenu();
    this.commonService.closeAll();
  }

  isUserLoggedIn() {
    return this.authService.isLoggedIn;
  }

  onRegistrationClick() {
    this.router.navigateByUrl('/registration');
  }
  checkUserRole(){
    return this.userRole === 2;
  }

  onLoginClick() {
    const dialogRef = this.dialog.open(LoginDialogComponent, { panelClass: 'mat-dialog-panel' });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
