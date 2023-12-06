import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rejection-reasons',
  templateUrl: './rejection-reasons.component.html',
  styleUrls: ['./rejection-reasons.component.scss']
})
export class RejectionReasonsComponent {
  form : FormGroup
  constructor(
    private dialogRef : MatDialogRef<RejectionReasonsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb : FormBuilder
  ){
    console.log("Data passed: ", data);
    this.form = this.fb.group({
      rejectionReason: ['', Validators.required],
      reasonComment:['']
    });

    this.form.get('rejectionReason')?.valueChanges.subscribe(value => {
      if (value !== 'Other') {
        this.form.get('reasonComment')?.setValue('');
        this.form.get('reasonComment')?.clearValidators();
        this.form.get('reasonComment')?.updateValueAndValidity();
      } else {
        this.form.get('rejectionReason')?.setValue(['Other']);
        this.form.get('reasonComment')?.setValidators([Validators.required]);
        this.form.get('reasonComment')?.updateValueAndValidity();
      }
    });
  }

  onSelectionChange(event: any){
    console.log("EVENT :", event);
    if(event.value.indexOf('Other') > -1){
      this.form.get('rejectionReason')?.setValue(['Other']);
      this.form.get('reasonComment')?.setValidators([Validators.required]);
      this.form.get('reasonComment')?.updateValueAndValidity();
    }
    else{
      this.form.get('reasonComment')?.setValue('');
      this.form.get('reasonComment')?.clearValidators();
      this.form.get('reasonComment')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.dialogRef.close(this.form.value);
    }
  }
  closeClick(){
    this.dialogRef.close(false);
  }
}
