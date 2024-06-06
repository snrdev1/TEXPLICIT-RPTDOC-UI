import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../shared/services/common.service';
import { ResetPasswordService } from './reset-password.service';

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
      newpassword: new FormControl("", Validators.required),
      confirmpassword: new FormControl("", Validators.required)
    });
  }

  ngOnInit() {
    // this.token = this.route.snapshot.paramMap.get('token') || '';
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token') || '';

      // Now you have the token, you can use it as needed
      // console.log('Got Token : ', this.token);

      // Check token validity otherwise route to home page
      if (this.token)
        this.checkTokenValidity();
      else
        this.navigateToHome();
    });
  }

  checkTokenValidity() {
    this.resetPasswordService.checkTokenValidity(this.token).subscribe({
      next: (res) => {
        console.log("Valid token!", res);
      },
      error: (e) => {
        console.log("Invalid token!", e);
        this.navigateToHome();
      },
      complete: () => {
        console.log("Complete");
      }
    });
  }

  onSubmit() {
    console.log('Reset Password submit');
    // console.log(this.form.value);
    if (this.form.controls['newpassword'].value == this.form.controls['confirmpassword'].value) {
      let newpassword = this.form.controls['newpassword'].value;
      this.resetPasswordService.updatePassword(this.token, newpassword).subscribe({
        next: (res) => {
          console.log("res", res);
          this.commonService.showSnackbar("snackbar-success", res.message, "0");
          this.navigateToHome();
        },
        error: (e) => {
          console.log("error", e);
          this.commonService.showSnackbar("snackbar-error", e.error.message, e.status);
        },
        complete: () => {
          console.log("Complete");
        }
      })
    } else {
      this.commonService.showSnackbar("snackbar-error", "Passwords should match", "0");

    }

  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }
}
