import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/shared/services/common.service';
import { DemoRequestDialogService } from './demo-request-dialog.service';

@Component({
  selector: 'app-demo-request-dialog',
  templateUrl: './demo-request-dialog.component.html',
  styleUrls: ['./demo-request-dialog.component.scss']
})
export class DemoRequestDialogComponent {
  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DemoRequestDialogComponent>,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private demoRequestService: DemoRequestDialogService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.email]),
      phone: new FormControl(""),
      comments: new FormControl(""),
    });
  }

  onCloseClick() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    if (this.form.valid) {
      this.demoRequestService.requestDemo(this.form.value)
        .subscribe({
          next: (res: any) => {
            console.log("feedback-form-response:", this.form.value);
            this.commonService.showSnackbar("snackbar-success", res.message)
            this.dialogRef.close(false);
          },
          error: (e: any) => {
            console.log("error:", e);
          }
        })
    }
  }
}
