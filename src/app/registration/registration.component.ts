import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../services/registration.service';
import { SharedService } from '../shared/services/shared.service';
import { CommonService } from '../shared/services/common.service';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { LocalStorageService } from '../core/local-storage.service';
import { LoginService } from '../services/login.service';
import { AuthService } from '../core/auth.service';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  domains: any = [];
  selectedDomains: any;
  keywords: any = [];
  topics: any = [];
  selectedIndex=0;
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private router:Router,
    private sharedService: SharedService ,
    private localStorage: LocalStorageService,
    private authService: AuthService,
    private loginService: LoginService,
    private commonService: CommonService ) {
    this.form = this.formBuilder.group({
      name: new FormControl("",[Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      email: new FormControl("",[Validators.required,Validators.email]),
      mobileNumber:new FormControl("",[
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10), Validators.maxLength(10)
      ]),
      password:new FormControl("",[Validators.required, Validators.minLength(6)]),

      role:new FormControl(3,Validators.required),
      subscription:new FormControl({value : 1, disabled : true},Validators.required),
      companyName:new FormControl(""),
      website:new FormControl("",  Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'))
    });
  }

  onSubmit(){
    console.log("on Submit");

    if (this.form.invalid) return;

    console.log(this.form.value);
    this.localStorage.setitem("SignupUserInfo",this.form.value);

      this.registrationService.addUser(this.form.value).subscribe(
        {
          next: (response) => {
            // console.log(response);
          if (response.success){
              this.commonService.showSnackbar("snackbar-success",response.message );
              let formData = this.localStorage.getitem("SignupUserInfo");
              this.loginService.login(formData).subscribe({
                next: (res:any)=>{
                  if(res.success){
                    console.log("response of login:",res);
                    if(res.data && res.data.token){
                      this.authService.token = res.data.token;
                    }
                  }
                  this.authService.getCurrentUser().subscribe({
                    next: (res:any)=>{
                      console.log("Res after login:", res);
                      this.localStorage.setUserInfo(res);
                      this.router.navigateByUrl('/reports');

                    }
                  })
                }
              })
              // this.router.navigate(['/home']);
            }
          },
          error: (err) => {
            // console.log("Error adding user:", err);
            this.commonService.showSnackbar("snackbar-error",err.error.message);

        }
        }
      );
    }

    ngOnInit() {
      
    }
  
    stepCheck1(){
      if((this.form.get('name')?.valid && this.form.get('email')?.valid && this.form.get('password')?.valid)){
        return true;
      }
      else
        return false;
    }
    
    selectRole(event:MatSelectChange){
      console.log("selectRole",event.value);
      if(event.value == 3){
        this.form.controls["subscription"].setValue(1);
        this.form.controls["subscription"].disable();
      }else{
        this.form.controls["subscription"].enable();

      }

    }
  }

  
