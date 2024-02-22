import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../core/local-storage.service';
import { MydocumentsService } from '../services/mydocuments.service';
import { ConfirmDialogComponent } from '../shared/components/modal-dialog/confirm-dialog/confirm-dialog.component';
import { CommonService } from '../shared/services/common.service';
import { CreateFolderDialogComponent } from './modal-dialog/create-folder-dialog/create-folder-dialog.component';
import { FileFolderMoveDialogComponent } from './modal-dialog/file-folder-move-dialog/file-folder-move-dialog.component';
import { FileFolderShareDialogComponent } from './modal-dialog/file-folder-share-dialog/file-folder-share-dialog.component';
import { FileUploadDialogComponent } from './modal-dialog/file-upload-dialog/file-upload-dialog.component';
import { RenameFolderDialogComponent } from './modal-dialog/rename-folder-dialog/rename-folder-dialog.component';

@Component({
  selector: 'app-my-documents',
  templateUrl: './my-documents.component.html',
  styleUrls: ['./my-documents.component.scss']
})
export class MyDocumentsComponent {
  fileid: any;
  data: any = [];
  curr_id: string = "";
  files: any = [];
  fileIds: any = [];
  checkedIds: any = [];
  strPath: string = "";
  sharedstrPath = "";
  sharedpath = "";
  fid: string = "";
  filename: string = "";
  summTitle: string = "";
  sharedfiles: any;
  filteredShareFiles: any;
  selectedTab: number = 0;
  isLoading: boolean = false;
  enterHit: boolean = false;
  user$: Observable<any> = this.localstorage.userInfo$;
  userInfo: any;
  limit: number = 20;
  offset: number = 0;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private mydocs: MydocumentsService,
    private localstorage: LocalStorageService,
    private commonservice: CommonService) {
    this.userInfo = this.localstorage.getUserInfo();
  }

  ngOnInit() {
    this.strPath = this.localstorage.getitem("strPath") || "";
    this.sharedstrPath = this.localstorage.getitem("sharedstrPath") || "";
    this.sharedpath = this.localstorage.getitem("sharedpath") || "";
    this.fid = this.localstorage.getitem("fId") || "";
    this.getAllUploadedFiles("", this.strPath);
    if (this.sharedstrPath == "") {
      this.getSharedFiles();
    }
    else {
      this.getFolderContents(this.fid);
    }
    this.checkedIds = this.localstorage.getitem("FileIdArray") || [];
    this.fileIds = this.localstorage.getitem("FileIdArray") || [];
    console.log("Checked:", this.checkedIds);
    this.selectedTab = this.localstorage.getitem("selectedtab") || 0;

    if (this.userInfo) {
      this.curr_id = this.userInfo?._id;
    }
  }

  openFileMenu(id: any) {
    this.fileid = id;
  }

  getAllUploadedFiles(search: string = "", root: string = "") {
    if (this.offset == 0) {
      this.isLoading = true;
      this.files = [];
    }

    if (root == "") {
      root = "/";
    }

    this.mydocs.getAllFiles(root, this.limit, this.offset).subscribe({
      next: (res: any) => {
        console.log("Response", res);

        if (search !== "") {
          res.data.uploaded.find((obj: any) => {
            if (obj.type === "File" || obj.type === "Folder") {
              var searchFilename = obj.originalFileName.trim().toLowerCase();
              if (searchFilename.includes(search)) {
                this.files.push(obj);
              }
            }
          });
        }
        else {
          console.log("Root:", root);
          console.log(res);
          this.files = [...this.files, ...res.data.uploaded];
          console.log("Files:", this.files);
        }
        this.isLoading = false;
      },
      error: (e) => {
        this.isLoading = false;
        console.log("error:", e);
      },
      complete: () => {
        this.isLoading = false;
        console.info("Complete!")
      }
    });
  }

  getSharedFiles(search: string = "", root: string = "") {
    this.isLoading = true;
    if (root == "") {
      root = "/";
    }
    this.mydocs.getAllFiles(root).subscribe({
      next: (res: any) => {
        console.log("Response", res);
        if (search !== "") {
          this.sharedfiles = [];
          this.filteredShareFiles = [];
          res.data.shared.find((obj: any) => {
            if (obj.type === "File" || obj.type == "Folder") {
              var searchFilename = obj.originalFileName.trim().toLowerCase();
              if (searchFilename.includes(search)) {
                this.sharedfiles.push(obj);
                this.filteredShareFiles.push(obj);
              }
            }
          });
        }
        else {
          console.log("Root:", root);
          console.log(res);
          this.sharedfiles = [];
          this.filteredShareFiles = [];
          this.sharedfiles = res.data.shared;
          this.filteredShareFiles = res.data.shared;
          console.log("SharedFiles:", this.sharedfiles);
        }
        this.isLoading = false;
      },
      error: (e) => {
        this.isLoading = false;
        console.log("error:", e);
      },
      complete: () => {
        this.isLoading = false;
        console.info("Complete!")
      }
    });
  }


  getFolderContents(folderId: string) {
    this.isLoading = true;
    this.mydocs.getFolderContents(folderId).subscribe({
      next: (response) => {
        console.log("SharedFolders:", response);
        this.sharedfiles = [];
        this.filteredShareFiles = [];
        this.sharedfiles = response.data
        this.filteredShareFiles = response.data;
        this.isLoading = false;
      },
      error: (response) => {
        this.isLoading = false;
        console.error("Error:", response);
      },
      complete: () => {
        this.isLoading = false;
        console.log("Fetched folder contents! Complete!");
      }
    });
  }

  onCreateFolder() {
    const dialogRef = this.dialog.open(CreateFolderDialogComponent, { panelClass: 'mat-dialog-panel', data: { "path": this.strPath } });

    dialogRef.afterClosed().subscribe((data: any) => {
      console.log(data);
      if (data == true) {
        this.offset = 0;
        this.getAllUploadedFiles("", this.strPath)
      }
    });
  }

  onFileUpload() {
    const dialogRef = this.dialog.open(FileUploadDialogComponent, { panelClass: 'mat-dialog-panel', data: { "path": this.strPath } });

    dialogRef.afterClosed().subscribe((data: any) => {
      console.log("Response:", data);
      if (data == true) {
        this.offset = 0;
        this.getAllUploadedFiles("", this.strPath)
      }
    });
  }

  onCheckChange(event: any) {
    if (event.target.checked) {
      this.fileIds.push(event.target.value);
      console.log('push to array file Id: ', event.target.value);
      console.log("fileArray:", this.fileIds);
    }
    else {
      const idx = this.fileIds.indexOf(event.target.value);
      if (idx !== -1) {
        this.fileIds.splice(idx, 1);
      }
      console.log('remove from array file Id: ', event.target.value);
      console.log("fileArray:", this.fileIds);
    }
    this.localstorage.setitem("FileIdArray", this.fileIds);
  }

  onDownloadClick(event: any) {
    console.log('Download Trigger for file Id: ', event);
    this.mydocs.downloadFile(event.virtualFileName, event.originalFileName);
  }

  onRenameClick(event: any) {
    console.log('Rename Trigger for file Id: ', event);
    const dialogRef = this.dialog.open(RenameFolderDialogComponent, { panelClass: 'mat-dialog-panel', data: event });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.offset = 0;
        this.getAllUploadedFiles("", this.strPath);
      }
    });
  }

  onMoveClick(event: any) {
    console.log('Move Trigger for file Id: ', event);
    const dialogRef = this.dialog.open(FileFolderMoveDialogComponent, { panelClass: 'mat-dialog-panel', data: event });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result == true) {
        this.offset = 0;
        this.getAllUploadedFiles("", this.strPath);
      }
    });
  }

  onShareClick(event: any) {
    console.log('Share Trigger for file Id: ', event);
    const dialogRef = this.dialog.open(FileFolderShareDialogComponent, { panelClass: 'mat-dialog-panel', data: { "documentId": event } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onDeleteClick(event: any) {
    console.log('File Id : ', event);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'mat-dialog-panel',
      data: { "modalTitle": "Delete File/Folder", "modalMessage": "Are you sure you want to delete this file/folder?" }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        if (event.filetype == "File") {
          this.deleteDoc(event.id);
        }
        else {
          this.deleteFol(event.id)
        }
      }

    });
  }

  onItemizedSummaryClick(event: any) {
    console.log("onItemizedSummaryClick:", event);
    this.router.navigateByUrl('/my-documents/itemized-summary');
  }

  onHighlightsClick(event: any) {
    this.router.navigateByUrl('/my-documents/highlight');
  }

  viewFolder(event: any) {
    console.log("EVENT:", event);
    if (event.type != "File") {
      console.log("FolderName :", event.name);
      this.strPath += '/' + event.name;
      this.localstorage.setitem("strPath", this.strPath);
      this.offset = 0;
      this.getAllUploadedFiles("", this.strPath);
    }
    else {
      this.mydocs.downloadFile(event.file.virtualFileName, event.file.originalFileName);
      // console.log("OrignalFilename:",event.file.originalFileName);
    }
  }

  viewSharedFolder(folder: any) {
    console.log("EVENT:", folder);
    var folder_id = folder.file["_id"];
    this.localstorage.setitem("fId", folder_id);
    if (folder.type != "File") {
      this.sharedstrPath += "/" + folder_id.toString();
      this.sharedpath += "/" + folder.name;
      this.localstorage.setitem("sharedstrPath", this.sharedstrPath);
      this.localstorage.setitem("sharedpath", this.sharedpath);
      console.log("Shared folder path : ", this.sharedstrPath);
      this.getFolderContents(folder_id);
    }
  }

  onBack() {
    if (this.selectedTab === 0) {
      console.log("Working!!");
      var idx: number = this.strPath.lastIndexOf('/');
      var tmp: string = "";
      if (idx != -1) {
        tmp = this.strPath.substring(0, idx);
      }
      this.strPath = tmp;
      this.localstorage.setitem("strPath", this.strPath);
      this.offset = 0;
      this.getAllUploadedFiles("", this.strPath);
    }
    else {
      this.sharedstrPath = this.sharedstrPath.substring(0, this.sharedstrPath.lastIndexOf('/'));
      console.log("PATH:", this.sharedstrPath);
      var fId = this.sharedstrPath.substring(this.sharedstrPath.lastIndexOf('/') + 1);
      console.log("FiD:", fId);
      this.localstorage.setitem("sharedstrPath", this.sharedstrPath);
      this.localstorage.setitem("fId", fId);
      if (this.sharedstrPath != "") {
        this.getFolderContents(fId);
      }
      else {
        this.getSharedFiles();
      }
      var temp: string = "";
      if (this.sharedpath.lastIndexOf('/') != -1) {
        temp = this.sharedpath.substring(0, this.sharedpath.lastIndexOf('/'));
      }
      this.sharedpath = temp;
      this.localstorage.setitem("sharedpath", this.sharedpath);
    }
  }

  deleteDoc(id: string) {
    console.log("file to delete", id);
    this.mydocs.deleteFile(id, this.strPath).subscribe({
      next: (res: any) => {
        console.log(res);
        this.commonservice.showSnackbar("snackbar-success", res.message, "0");
        this.offset = 0;
        this.getAllUploadedFiles("", this.strPath);
      },
      error: (e) => {
        console.error("Error : ", e);
        this.commonservice.showSnackbar("snackbar-error", "Cannot Delete!", e.status);
      },
      complete: () => {
        console.info('Complete!');
      }
    });
  }

  deleteFol(id: string) {
    console.log("folder to delete", id);
    this.mydocs.deleteFolder(id, this.strPath).subscribe({
      next: (res: any) => {
        console.log(res);
        this.commonservice.showSnackbar("snackbar-success", res.message, "0");
        this.offset = 0;
        this.getAllUploadedFiles("", this.strPath);
      },
      error: (e) => {
        console.log("error: ", e);
      },
      complete: () => {
        console.info("Complete!");
      }
    })
  }

  searchFiles(value: string) {
    this.filename = value;
    console.log("Searching:" + this.filename);
    this.filename = this.filename.trim().toLowerCase();
    if (this.selectedTab == 0) {
      this.offset = 0;
      this.getAllUploadedFiles(this.filename, this.strPath);
      this.enterHit = true;
    }
    else if (this.selectedTab == 1) {
      if (this.sharedstrPath == "") {
        this.getSharedFiles(this.filename);
        this.enterHit = true;
      }
      else if (this.sharedstrPath !== "") {
        this.isLoading = true;
        setTimeout(() => {
          this.sharedfiles = this.sharedfiles.filter((shared: any) => shared.originalFileName.trim().toLowerCase().includes(this.filename));
          this.enterHit = true;
          this.isLoading = false;
        }, 500);
      }
    }
  }

  // isChecked(event:string):boolean{
  //   return this.checkedIds.includes(event);
  // }

  clearSearch() {
    this.filename = "";
    if (this.enterHit) {
      if (this.selectedTab == 0) {
        this.offset = 0;
        this.getAllUploadedFiles(this.filename, this.strPath);
      }
      else if (this.selectedTab == 1) {
        if (this.sharedstrPath == "") {
          this.getSharedFiles(this.filename);
        }
        else {
          this.isLoading = true;
          setTimeout(() => {
            this.sharedfiles = this.filteredShareFiles;
            this.isLoading = false;
          }, 500);
        }
      }
    }
    this.enterHit = false;
  }

  Refresh() {
    this.offset = 0;
    this.getAllUploadedFiles()
  }

  onTabChange(event: any) {
    this.selectedTab = event.index;
    this.localstorage.setitem("selectedtab", this.selectedTab);
    console.log("Selected tab index : ", this.selectedTab);
  }

  isFileSelected() {
    return this.fileIds.length > 0 ? true : false;
  }

  onScroll(event: any) {
    if (Math.round(event.target.scrollTop) >= (event.target.scrollHeight - event.target.offsetHeight - 1)) {
      this.offset = this.offset + this.limit;
      this.getAllUploadedFiles();
    }
  }
}
