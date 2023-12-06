import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FeedbackDialogService } from './feedback-dialog.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.scss']
})
export class FeedbackDialogComponent {
  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<FeedbackDialogComponent>,
    private formBuilder: FormBuilder,
    private feedbackService: FeedbackDialogService,
    private commonService: CommonService
   ) {
    this.form = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required,Validators.email]),
      phoneNumber: new FormControl(""),
      comments: new FormControl("", Validators.required),
    });
  }

  onCloseClick(){
    this.dialogRef.close(false);
  }

  onSubmit(){
    // console.log(this.form.value);
    // this.dialogRef.close(true);
    if(this.form.valid){
      this.feedbackService.saveCustomerFeedBack(this.form.value)
      .subscribe({
        next : (res)=>{
          console.log("feedback-form-response:",this.form.value);
          this.commonService.showSnackbar("snackbar-success",res.message )
          this.dialogRef.close(false);
        },
        error : (e)=>{
          console.log("error:",e);
        } 
      })
    }
  }
}
