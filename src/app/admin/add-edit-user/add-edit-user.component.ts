import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { CommonService } from 'src/app/shared/services/common.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AdminServices } from '../admin.service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss'],
})
export class AddEditUserComponent {
  form: FormGroup;
  isLinear: boolean = false;
  userDetails: any;
  selectedOption: any = [];
  emailDisable: boolean = true;
  defaultOptions: any = [];
  disabledArray: any = [];
  modes: any[] = [{ id: 2, name: "Professional" }, { id: 3, name: "Personal" }];
  constructor(public dialogRef: MatDialogRef<AddEditUserComponent>,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private sharedservice: SharedService,
    private adminService: AdminServices,
    @Inject(MAT_DIALOG_DATA) public data: { user: any }) {
    this.form = this.formBuilder.group({
      name: new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      email: new FormControl("", [Validators.required, Validators.email]),
      mobileNumber: new FormControl("", [
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10), Validators.maxLength(10)
      ]),
      role: new FormControl(3, Validators.required),
      subscription: new FormControl({ value: 1, disabled: true }, Validators.required),
      companyName: new FormControl(""),
      website: new FormControl("", Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')),
      start_date: new FormControl(""),
      end_date: new FormControl(""),
      report_count: new FormControl(0, Validators.pattern("^[0-9]*$")),
      document_size: new FormControl(0, Validators.pattern("^[0-9]*$")),
      chat_count: new FormControl(0, Validators.pattern("^[0-9]*$"))
    });
  }

  ngOnInit() {
    console.log("UserDetals:", this.data.user);
    this.getData();
  }

  onCloseClick() {
    this.dialogRef.close(false);
  }

  getData() {
    this.form.patchValue({
      name: this.data.user?.name || "",
      email: this.data.user?.email || "",
      mobileNumber: this.data.user?.mobileNumber || "",
      companyName: this.data.user?.companyName || "",
      website: this.data.user?.website || "",
      role: this.data.user?.role || 3,
      subscription: this.data.user?.subscription || 1,
      start_date: this.data.user?.permissions?.subscription_duration?.start_date,
      end_date: this.data.user?.permissions?.subscription_duration?.end_date,
      report_count: this.data.user?.permissions?.report?.allowed?.total,
      document_size: this.data.user?.permissions?.document?.allowed?.document_size / (1024 * 1024),
      chat_count: this.data.user?.permissions?.chat?.allowed?.chat_count
    })

    if (this.form.controls['email'].value !== "") {
      this.form.get('email')?.disable();
    }

    if (this.form.controls['role'].value == 2) {
      this.form.get('subscription')?.enable();
    }
  }

  onSubmit() {
    this.userDetails = this.form.value;
    console.log("Form:", this.userDetails);
    if (this.data.user) {
      this.userDetails["userId"] = this.data.user["_id"];
      this.userDetails["email"] = this.data.user["email"];
    }
    this.adminService.createUpdateUser(this.userDetails).subscribe({
      next: (response: any) => {
        console.log("Response:", response);
        this.commonService.showSnackbar("snackbar-success", response.message, "0");
        this.dialogRef.close(true);
      },
      error: (e: any) => {
        console.log("Error:", e);
        this.commonService.showSnackbar("snackbar-error", e.error.message, e.status);
      },
      complete: () => {
        console.info("Complete!");
      }
    })
  }

  onModeSelect(event: MatSelectChange) {
    if (event.value == 3) {
      this.form.get('subscription')?.setValue(1);
      this.form.get('subscription')?.disable();
    }
    else {
      this.form.get('subscription')?.enable();
    }

    console.log("defaultOption:", this.defaultOptions)
    this.selectedOption = this.defaultOptions;
    console.log("selectedOption:", this.selectedOption)
  }

  personalCheck() {
    if (this.form.get('name')?.valid && this.form.get('email')?.value) {
      return true;
    }
    else {
      return false;
    }
  }
}
