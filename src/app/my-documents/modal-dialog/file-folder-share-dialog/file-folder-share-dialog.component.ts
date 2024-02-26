import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { MydocumentsService } from 'src/app/services/mydocuments.service';
import { ReportsService } from 'src/app/services/reports.service';
import { CommonService } from 'src/app/shared/services/common.service';

export interface Email {
  address: string;
}


@Component({
  selector: 'app-file-folder-share-dialog',
  templateUrl: './file-folder-share-dialog.component.html',
  styleUrls: ['./file-folder-share-dialog.component.scss'],
})
export class FileFolderShareDialogComponent {
  currId: any;

  // To store ids of documents or reports
  documentIds: string[] = [];
  reportIds: string[] = [];

  // Variables to control the share tabs
  internalShare: boolean = true;
  emailShare: boolean = true;

  document: any;
  users: any;
  userSearchQuery: string = "";
  filteredUsers: any;
  userInfo$: Observable<any> = this.localStorageService.userInfo$;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emails: Email[] = [];

  announcer = inject(LiveAnnouncer);

  emailShareForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FileFolderShareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private mydocs: MydocumentsService,
    private reportsService: ReportsService,
    private localStorageService: LocalStorageService,
    private commonservice: CommonService
  ) {
    this.emailShareForm = this.formBuilder.group({
      emailIds: new FormControl([""], [Validators.required, Validators.email]),
      subject: new FormControl(""),
      message: new FormControl(""),
      shareType: new FormControl("")
    });
  }


  ngOnInit() {
    this.localStorageService.observeUserInfo();

    this.userInfo$.subscribe((data) => {
      console.log("data: ", data);
      this.currId = data?._id;
    });

    // Set values for internal and email sharing
    this.internalShare = this.data.internalShare != undefined ? this.data.internalShare : this.internalShare;
    this.emailShare = this.data.emailShare != undefined ? this.data.emailShare : this.emailShare;

    if (this.data.documentIds && this.data.shareDocumentType == "document") {
      this.documentIds = this.data.documentIds;
      this.getDocument();
    }

    if (this.data.reportIds && this.data.shareDocumentType == "report")
      this.reportIds = this.data.reportIds;

    this.getAllUsers();
  }


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our email
    if (value) {
      this.emails.push({ address: value });
      this.updateEmailsFormControl();
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(email: Email): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
      this.updateEmailsFormControl();

      this.announcer.announce(`Removed ${email.address}`);
    }
  }

  edit(email: Email, event: MatChipEditedEvent): void {
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
      this.updateEmailsFormControl();
    }
  }

  private updateEmailsFormControl(): void {
    this.emailShareForm.get('emailIds')?.patchValue(this.emails.map(email => email.address));
    this.emailShareForm.get('emailIds')?.updateValueAndValidity();
  }

  getDocument() {
    console.log("DocId:", this.documentIds);
    this.mydocs.getDocument(this.documentIds[0]).subscribe({
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
    let accessList = this.document && "usersWithAccess" in this.document ? this.document.usersWithAccess : [];
    if (accessList == null) {
      accessList = [];
    }

    return accessList.includes(userId);
  }


  shareToInternal(userId: string) {
    this.emailShareForm.get('shareType')?.patchValue("internal");
    this.share(userId);
  }

  shareDocument(userId: string = "") {
    this.mydocs.shareDocument(this.documentIds, [userId], this.emailShareForm.value).subscribe({
      next: (response: any) => {
        console.log("Response:", response);
        this.commonservice.showSnackbar("snackbar-success", response.message, "0");
        this.getDocument();
      },
      error: (e: any) => {
        console.log("Error:", e)
      },
      complete: () => {
        console.info('Complete!');
        if (this.emailShareForm.get("shareType")?.value == "email")
          this.dialogRef.close();
      }
    });
  }

  shareReport() {
    this.reportsService.shareReports(this.reportIds, this.emailShareForm.value).subscribe({
      next: (response: any) => {
        console.log("Response:", response);
        this.commonservice.showSnackbar("snackbar-success", response.message, "0");
      },
      error: (e: any) => {
        console.log("Error:", e)
      },
      complete: () => {
        console.info('Complete!');
        if (this.emailShareForm.get("shareType")?.value == "email")
          this.dialogRef.close();
      }
    });
  }

  share(userId: string = ""): void {
    if (this.data.shareDocumentType == "document")
      this.shareDocument(userId);
    if (this.data.shareDocumentType == "report")
      this.shareReport();
  }

  onCloseClick() {
    this.dialogRef.close(false);
  }

  getEmailsErrorMessage() {
    const emailFormControl = this.emailShareForm.get('emails');

    if (emailFormControl?.hasError('required')) {
      return 'At least one email id is required!';
    }

    return emailFormControl?.hasError('email') ? 'An invalid email address was entered!' : '';
  }


  onSubmit() {
    if (this.emailShareForm.valid) {
      console.log("form : ", this.emailShareForm.value);
      this.emailShareForm.get('shareType')?.patchValue("email");
      // this.dialogRef.close(this.emailShareForm.value);
      this.share();
    }
  }
}
