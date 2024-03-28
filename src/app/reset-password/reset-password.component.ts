import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from './reset-password.service';
import { CommonService } from '../shared/services/common.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  form: FormGroup;
  token: string = "";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private resetPasswordService: ResetPasswordService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      newpassword: new FormControl("",Validators.required),
      confirmpassword: new FormControl("",Validators.required)
    });
  }

  ngOnInit(){
    this.token = this.route.snapshot.paramMap.get('token') || '';
    // // console.log("this.token",this.token);
    this.checkTokenValidity();
  }

  checkTokenValidity(){
    this.resetPasswordService.checkTokenValidity(this.token).subscribe({
      next: (res)=>{
        console.log("checkTokenValidity",res);
      },
      error: (e)=>{
        console.log("Error",e);
        this.navigateToHome();
      },
      complete: ()=>{
        console.log("Complete");
      }
    });
  }

  onSubmit(){
    console.log('Reset Password submit');
    // console.log(this.form.value);
    if(this.form.controls['newpassword'].value == this.form.controls['confirmpassword'].value){
      let newpassword = this.form.controls['newpassword'].value;
      this.resetPasswordService.updatePassword(this.token, newpassword ).subscribe({
        next: (res)=>{
          console.log("res",res);
          this.commonService.showSnackbar("snackbar-success", res.message, "0");
          this.navigateToHome();
        },
        error: (e)=>{
          console.log("error",e);
          this.commonService.showSnackbar("snackbar-error", e.error.message, e.status);
        },
        complete: ()=>{
          console.log("Complete");
        }
      })
    }else{
      this.commonService.showSnackbar("snackbar-error", "Passwords should match", "0");

    }

  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }
}
