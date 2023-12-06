import { Component, Inject, OnInit,ViewChild,Renderer2} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MydocumentsService } from 'src/app/services/mydocuments.service';
import { CommonService } from 'src/app/shared/services/common.service';
@Component({
  selector: 'app-rename-folder-dialog',
  templateUrl: './rename-folder-dialog.component.html',
  styleUrls: ['./rename-folder-dialog.component.scss']
})
export class RenameFolderDialogComponent implements OnInit{
  form!: FormGroup;
  name:string = "";
  title:string = "";
  constructor(
    public dialogRef: MatDialogRef<RenameFolderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private mydocs:MydocumentsService,
    private commonservice: CommonService
  ) {}

  ngOnInit(){
    console.log("Details:",this.data);
    if(this.data.type == 'File'){
      this.name = this.data.originalFileName.substring(0,this.data.originalFileName.lastIndexOf('.'));
    }
    else{
      this.name = this.data.originalFileName;
    }
    console.log(this.name);
    this.form = this.formBuilder.group({folderName: new FormControl(this.name, Validators.required)});
    if(this.data.type == "Folder"){
      this.title = "Rename Folder"
    }
    else{
      this.title = "Rename File";
    }
    console.log(this.title);
  }

  onCloseClick(){
    this.dialogRef.close(false);
  }

  onSubmit(){
    console.log("Renamed:",this.form.value.folderName);
    this.mydocs.rename(this.data._id,this.form.value.folderName).subscribe((res)=>{
      console.log("File Renamed:",res);
      this.commonservice.showSnackbar("snackbar-success",res.message,"0");
      this.dialogRef.close(true);
    }
  )
  }
}
