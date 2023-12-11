import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ManageUserService } from '../../manage-user.service';

@Component({
  selector: 'app-add-edit-user-dialog',
  templateUrl: './add-edit-user-dialog.component.html',
  styleUrls: ['./add-edit-user-dialog.component.scss']
})
export class AddEditUserDialogComponent {
  form: FormGroup;
  parentUser: any;
  parentMenus: any;
  allDomains: any=[];
  userDetails:any=[];
  constructor(
    public dialogRef: MatDialogRef<AddEditUserDialogComponent>,
    private localStorage: LocalStorageService,
    private commonService: CommonService,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageUserService: ManageUserService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      name: new FormControl("", [Validators.required,Validators.pattern('^[a-zA-Z ]+$')]),
      email: new FormControl("", [Validators.required,Validators.email]),
      menus: new FormControl("", Validators.required),
    });
  }

  ngOnInit(){
    // console.log("data passed from parent: ",this.data);
    
    if(this.data){
      this.getUserDetails();
    }
    this.parentUser = this.localStorage.getitem("userInfo");
    // console.log("parentUser",this.parentUser);
    // this.getValidDomains();
    this.getParentMenu();
  }

  getParentMenu(){
    let menuIds = this.parentUser.permissions.menu;
    // console.log("menuIds",menuIds);
    this.manageUserService.getUserMenuNames(menuIds).subscribe((res:any)=>{
      this.parentMenus = res.data;
      console.log("In getParentMenu: ",this.parentMenus);

    })
  }

  getUserDetails(){
    this.manageUserService.getUserById(this.data).subscribe({
      next: (res)=>{
        this.userDetails = res.data[0];
        // console.log("res in editUser",this.userDetails);
        let oldValues = {
      "name": this.userDetails[0].name,
      "email": this.userDetails[0].email,
      "domains": this.userDetails[0].domains,
      "menus" :  this.userDetails[0].permissions.menu
    }
    this.form.patchValue(oldValues);
      },
      error: (e)=>{
        console.log("Error: ",e);
      },
      complete: ()=>{
        console.log("Complete");
      }
    })
  }

  onCloseClick(){
    this.dialogRef.close(false);
  }

  onSubmit(){
    console.log(this.form.value);
    this.dialogRef.close(this.form.value);
  }
}
