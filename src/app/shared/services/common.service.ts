import { HttpClient } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { LoginDialogComponent } from '../components/modal-dialog/login-dialog/login-dialog.component';
import { CommonSnackbarComponent } from '../components/snackbar/common-snackbar/common-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private _newsOpen: boolean = false;
  private _chatOpen: boolean = false;
  public userMenu: any = [];

  constructor(private snackbar: MatSnackBar, private http: HttpClient, public dialog: MatDialog,
    private router: Router, private authService: AuthService,
    private localStorage: LocalStorageService) {

  }

  get chatOpen(): boolean {
    return this._chatOpen;
  }

  @Input() set chatOpen(value: boolean) {
    this._chatOpen = value;
  }

  get newsOpen(): boolean {
    return this._newsOpen;
  }

  @Input() set newsOpen(value: boolean) {
    this._newsOpen = value;
  }

  getUniqueId() {
    const uniqueID: any = uuidv4();
    const timestamp: any = new Date().toLocaleTimeString();
    const combinedID: any = `${uniqueID}-${timestamp}`;

    return combinedID;
  }

  closeAll() {
    this.newsOpen = false;
    this.chatOpen = false;
  }

  showSnackbar(snackbarPanelClass: string, messageText: string, errorCode: string = '0') {
    this.snackbar.openFromComponent(CommonSnackbarComponent, {
      panelClass: snackbarPanelClass,
      data: {
        type: snackbarPanelClass.replace('snackbar-', ''),
        errorCode: errorCode,
        messageText: messageText
      },
      duration: 5000
    });
  }
  getAllUsers(): Observable<any> {
    const url = `${environment.hostName}/users/all`;

    return this.http.get<any>(url);
  }

  openLoginModal(returnUrl?: string) {
    const dialogRef = this.dialog.open(LoginDialogComponent, { panelClass: 'mat-dialog-panel' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!returnUrl) returnUrl = "/";
        this.router.navigateByUrl(returnUrl)
      }
      else {
        if (!this.authService.isLoggedIn) {
          this.router.navigateByUrl('/home')
        }
      }
    });
  }

  getMenu(menuIds: string[] = []): Observable<any> {
    const url = `${environment.hostName}/menu`;
    const data = {
      "menu_ids": menuIds
    };
    return this.http.post<any>(url, data);
  }

  getUserMenu() {
    const userInfo = this.localStorage.getUserInfo() || [];
    const menuIds = userInfo?.permissions?.menu;
    this.getMenu(menuIds).subscribe({
      next: (res) => {
        this.userMenu = res.data;
      },
      error: (e) => {
        console.log("Error: ", e);
      },
      complete: () => {
        console.log("Complete");
      }
    })
  }
  clearUserMenu() {
    this.userMenu = [];
  }
}
