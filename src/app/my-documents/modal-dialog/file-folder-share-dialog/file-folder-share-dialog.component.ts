import { Component, Inject, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/shared/services/common.service';
import { MydocumentsService } from 'src/app/services/mydocuments.service';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';

export interface Email {
  address: string;
}


@Component({
  selector: 'app-file-folder-share-dialog',
  templateUrl: './file-folder-share-dialog.component.html',
  styleUrls: ['./file-folder-share-dialog.component.scss']
})
export class FileFolderShareDialogComponent {
  // items:any=Array(10);
  currId: any;
  docId: string = "";
  document: any;
  users: any;
  userSearchQuery: string = "";
  filteredUsers: any;
  userInfo$: Observable<any> = this.localStorageService.userInfo$;



  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emails: Email[] = [{ address: 'email1@example.com' }, { address: 'email2@example.com' }];

  announcer = inject(LiveAnnouncer);


  constructor(
    public dialogRef: MatDialogRef<FileFolderShareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private mydocs: MydocumentsService,
    private localStorageService: LocalStorageService,
    private commonservice: CommonService
  ) { }
  ngOnInit() {
    this.localStorageService.observeUserInfo();
    this.userInfo$.subscribe((data) => {
      console.log("data: ", data);
      this.currId = data?._id;
    });
    this.docId = this.data.documentId;
    this.getDocument();
    this.getAllUsers();
  }



  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our email
    if (value) {
      this.emails.push({ address: value });
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(email: Email): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);

      this.announcer.announce(`Removed ${email.address}`);
    }
  }

  edit(email: Email, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove email if it no longer has an address
    if (!value) {
      this.remove(email);
      return;
    }

    // Edit existing email
    const index = this.emails.indexOf(email);
    if (index >= 0) {
      this.emails[index].address = value;
    }
  }


  getDocument() {
    console.log("DocId:", this.docId);
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
  getAllUsers() {
    this.commonservice.getAllUsers().subscribe({
      next: (response: any) => {
        this.users = response?.data;
        console.log("user_list:", this.users);
        // Filter out the current logged-in user
        this.filteredUsers = this.users.filter((user: any) => (user._id !== this.currId));
      },
      error: (e) => {
        console.log("Error: ", e);
      },
      complete: () => {
        console.info('Complete!');
      }
    });
  }
  searchUsers(value: string): void {
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
        console.log("Response:", response);
        this.commonservice.showSnackbar("snackbar-success", response.message, "0");
        this.getDocument();
      },
      error: (e) => {
        console.log("Error:", e)
      },
      complete: () => {
        console.info('Complete!');
      }
    });
    console.log(userId);
  }
  onCloseClick() {
    this.dialogRef.close(false);
  }
}
