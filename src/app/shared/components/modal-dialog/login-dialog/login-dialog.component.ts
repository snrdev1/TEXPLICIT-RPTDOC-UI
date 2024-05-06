import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';
import { LoginService } from 'src/app/services/login.service';
import { AuthService } from 'src/app/core/auth.service';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { DemoRequestDialogComponent } from '../demo-request-dialog/demo-request-dialog.component';
@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  form: FormGroup;
  domains: any = [];
  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private loginservice: LoginService,
    private commonService: CommonService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    });
  }

  ngOnInit() {
  }
  onCloseClick() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    if (this.form.valid) {
      console.log("On login");
      console.log(this.form.value);
      this.loginservice.login(this.form.value).subscribe(
        (response) => {
          if (response.success) {
            console.log(response);
            this.commonService.showSnackbar("snackbar-success", response.message, response.status);

            // Store the token in local storage
            if (response.data && response.data.token) {
              this.authService.token = response.data.token;

              console.log("Token:", response.data.token);
            }
          }
          this.authService.getCurrentUser().subscribe({
            next: (res: any) => {
              console.log("Login Res:", res);
              this.localStorageService.setUserInfo(res);
              // this.commonService.getUserMenu();
              this.router.navigateByUrl('/reports');
              this.dialogRef.close(true);
            }

          });
          this.commonService.showSnackbar("snackbar-success", response.message, response.status);

        },
        (error) => {
          console.log("Error:", error);
          this.commonService.showSnackbar("snackbar-error", error.error.message);
        }
      )
    }
  }

  onForgotPasswordClick(event: any) {
    event.preventDefault();

    const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, { panelClass: 'mat-dialog-panel' });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onContactClick(event: any){
    event.preventDefault();

    const dialogRef = this.dialog.open(DemoRequestDialogComponent, { panelClass: 'mat-dialog-panel' });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
