import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ResetPasswordService } from 'src/app/reset-password/reset-password.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss']
})
export class ForgotPasswordDialogComponent {
  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    private resetPasswordService: ResetPasswordService,
    private commonService: CommonService,
    private formBuilder: FormBuilder
  ){
    this.form = this.formBuilder.group({
      email: new FormControl("", [Validators.required,Validators.email])
    });
  }

  onCloseClick(){
    this.dialogRef.close(false);
  }

  onSubmit(){
    console.log(this.form.value);
    this.resetPasswordService.sendPasswordResetEmail(this.form.value).subscribe({
      next: (res)=>{
        // console.log("res in passwordReset: ",res);
        this.commonService.showSnackbar("snackbar-success", res.message, "0");
      },
      error: (e)=>{
        console.log("Error: ",e);
        this.commonService.showSnackbar("snackbar-error", e.error.message, e.status);
      },
      complete: ()=>{
        console.log("Complete");
      }
    })
    this.dialogRef.close(true);
  }
}
