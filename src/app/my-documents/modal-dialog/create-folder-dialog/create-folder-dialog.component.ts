import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MydocumentsService } from 'src/app/services/mydocuments.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-create-folder-dialog',
  templateUrl: './create-folder-dialog.component.html',
  styleUrls: ['./create-folder-dialog.component.scss']
})
export class CreateFolderDialogComponent {
  form: FormGroup;
  folderName :string = "";
  constructor(
    public dialogRef: MatDialogRef<CreateFolderDialogComponent>,
    private mydocs: MydocumentsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private commonservice: CommonService
  ) {
      this.form = this.formBuilder.group({
        path: this.data.path == "" ? new FormControl("/"): new FormControl(this.data.path),
        folderName: new FormControl("", Validators.required)
      });
  }
  ngOnInit(){
    console.log(this.data);
  }

  onCloseClick(){
    this.dialogRef.close(false);
  }

  onSubmit(){
    this.folderName = this.form.get('folderName')?.value;
    console.log(this.folderName)
    console.log("form-value: ",this.form.value);
    this.mydocs.createFolder(this.form.value).subscribe(
      (response) =>{
        console.log("File uploaded",response);
       this.commonservice.showSnackbar("snackbar-success", response.message,"0");
       this.dialogRef.close(true);
      },
      (error)=>{
        console.log("Error:",error);
        this.commonservice.showSnackbar("snackbar-error",error.message,error.status);
        this.dialogRef.close(true);
      }
    )
  }
}