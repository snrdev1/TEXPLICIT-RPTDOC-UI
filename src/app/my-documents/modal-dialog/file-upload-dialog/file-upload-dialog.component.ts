import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, catchError, throwError } from 'rxjs';
import { MydocumentsService } from 'src/app/services/mydocuments.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { WebSocketService } from 'src/app/shared/services/socketio.service';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss']
})
export class FileUploadDialogComponent {
  disableUploadButton: boolean = false;
  progress = 0;
  form: FormGroup;
  allfiles: any = [];
  selectedFiles: File[] = [];
  selectedFilesText: string = "no files selected";
  documentUploadStatus: string = "";
  uploadId: any;
  userId: string = "";
  uploadProgress: number = 0;

  constructor(
    public dialogRef: MatDialogRef<FileUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private mydocs: MydocumentsService,
    private commonService: CommonService,
    private socketService: WebSocketService
  ) {
    this.form = this.formBuilder.group({
      file: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
    this.userId = this.data.userId;
    this.uploadId = this.commonService.getUniqueId();
    this.setupDocumentUploadListener();
  }

  setupDocumentUploadListener() {
    const event = `${this.userId}_${this.uploadId}_document_upload_status`;
    console.log("this.uploadId : ", this.uploadId);

    this.socketService.listen(event).subscribe({
      next: (res: any) => {
        this.documentUploadStatus = res?.message;
        this.uploadProgress = res?.data?.progress;

        console.log("Got document upload status : ", this.documentUploadStatus);
        console.log("Got uploadProgress : ", this.uploadProgress);
      },
      error: (e: any) => {
        console.log("Error", e);
        this.commonService.showSnackbar('snackbar-error', e.message, e.status);
      },
      complete: () => {
        console.log("Completed listenting. Pending report received");
      }
    })
  }

  onCloseClick() {
    this.dialogRef.close(false);
  }

  onSelectFile(event: any) {
    this.selectedFiles = event.target.files;
    let len = this.selectedFiles.length;
    console.log("No.of Files:", len);
    if (len >= 1) {
      this.selectedFilesText = len + "file(s) selected";
      this.disableUploadButton = false;
    }
    else {
      this.selectedFilesText = "no files selected";
    }
  }

  onSubmit() {
    console.log(this.form.value);
    this.uploadFile();
  }

  uploadFile() {
    if (this.selectedFiles.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const formData = new FormData();
        console.log("Uploaded files : ", this.selectedFiles);
        var fileExtension = "";
        var fileName = this.selectedFiles[i].name;
        if (fileName.lastIndexOf(".") > 0) {
          fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);
        }
        if (fileExtension.toLowerCase() == "pdf" || fileExtension.toLowerCase() == "doc" || fileExtension.toLowerCase() == "docx" || fileExtension.toLowerCase() == "txt" || fileExtension.toLowerCase() == "pptx" || fileExtension.toLowerCase() == "ppt") {
          let file = this.selectedFiles[i];
          if (file.size > 0 && file.size < (50 * 1024 * 1024)) {
            formData.append('files', file);
          } else {
            console.log("File size too large! Max file size supported is 50MB.", "OK", "success");
          }
          if (this.data.path == "") {
            this.data.path = "/";
          }

          console.log(this.data.path);
          formData.append("path", this.data.path);
          formData.append("uploadId", this.uploadId);
          console.log("Form Data : ", formData);

          this.disableUploadButton = true;
          this.mydocs.uploadFiles(formData).pipe(catchError((error: any): Observable<any> => {
            console.error('Error:', error);
            return throwError('Something went wrong');
          })).subscribe(
            (event: HttpEvent<any>) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round((event.loaded / (event.total || 1)) * 100);
                console.log(`Uploaded! ${this.progress}%`);
              }
              else if (event.type === HttpEventType.Response) {
                console.log("File uploaded successfully. Response : ", event.body);
                setTimeout(() => {
                  this.progress = 0;
                  this.dialogRef.close(true);
                }, 500);

              }
            },
          );
        }
        else {
          // console.log("Upload format not supported! Please upload a PDF file or a DOCX file or a TXT file.");
          this.commonService.showSnackbar("snackbar-warning", "Upload format not supported! Please upload a PDF file or a DOCX file or a TXT file or a PPTX file.");
        }
      }
    }
  }
}
