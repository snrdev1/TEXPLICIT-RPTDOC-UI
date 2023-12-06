import { Component,Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/shared/services/common.service';
import { MydocumentsService } from 'src/app/services/mydocuments.service';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-file-folder-share-dialog',
  templateUrl: './file-folder-share-dialog.component.html',
  styleUrls: ['./file-folder-share-dialog.component.scss']
})
export class FileFolderShareDialogComponent {
  // items:any=Array(10);
  currId: any;
  docId : string = "";
  document:any;
  users:any;
  userSearchQuery:string = "";
  filteredUsers:any;
  userInfo$: Observable<any> = this.localStorageService.userInfo$;
  constructor(
    public dialogRef: MatDialogRef<FileFolderShareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private mydocs : MydocumentsService,
    private localStorageService:LocalStorageService,
    private commonservice : CommonService
  ) {}
  ngOnInit(){
    this.localStorageService.getUserInfo();
    this.userInfo$.subscribe((data) =>{
      console.log("data: ",data);
      this.currId = data?._id;
    });
    this.docId = this.data.documentId;
    this.getDocument();
    this.getAllUsers();
  }
  getDocument(){
    console.log("DocId:",this.docId);
    this.mydocs.getDocument(this.docId).subscribe({
      next: (response: any) => {
        this.document = response.data;
        // console.log("OUT: ",this.document);
        this.hasAccess(this.currId);
      },
      error: (e) => {
        console.log("Error :", e);
      },
      complete: () => {
        console.info('Complete!');
      }
    });
  }
  getAllUsers(){
    this.commonservice.getAllUsers().subscribe({
      next: (response: any) => {
        this.users = response?.data;
        console.log("user_list:",this.users);
        // Filter out the current logged-in user
        this.filteredUsers = this.users.filter((user: any) => (user._id !== this.currId));
      },
      error: (e) => {
        console.log("Error: ",e);
      },
      complete: () => {
        console.info('Complete!');
      }
    });
  }
  searchUsers(value : string): void {
    this.userSearchQuery = value;
    if (this.userSearchQuery) {
      const cleanedQuery: string = this.userSearchQuery.toLowerCase().trim();
      this.filteredUsers = this.users.filter((user: any) => user.name.toLowerCase().trim().includes(cleanedQuery));
    } else {
      this.filteredUsers = this.users;
    }
  }
  clearUserSearch() {
    this.userSearchQuery = '';
    this.filteredUsers = this.users;
  }
  hasAccess(userId: string) {
    console.log("Document : ", this.document);
    let accessList = "usersWithAccess" in this.document ? this.document.usersWithAccess : [];
    console.log("AccessList : ", accessList);
    if (accessList == null) {
      accessList = [];
    }

    return accessList.includes(userId);
  }
  shareDocument(userId: string): void {
    this.mydocs.shareDocument(this.docId, [userId]).subscribe({
      next: (response: any) => {
        console.log("Response:",response);
        this.commonservice.showSnackbar("snackbar-success",response.message,"0");
        this.getDocument();
      },
      error: (e) => {
        console.log("Error:",e)
      },
      complete: () => {
        console.info('Complete!');
      }
    });
    console.log(userId);
  }
  onCloseClick(){
    this.dialogRef.close(false);
  }
}
