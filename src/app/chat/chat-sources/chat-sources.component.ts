import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MydocumentsService } from 'src/app/services/mydocuments.service';

@Component({
  selector: 'app-chat-sources',
  templateUrl: './chat-sources.component.html',
  styleUrls: ['./chat-sources.component.scss']
})
export class ChatSourcesComponent {
  files: any[] = [];
  extlist: any = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt'];

  constructor(
    public dialogRef: MatDialogRef<ChatSourcesComponent>,
    private documentsService: MydocumentsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  getIcon(item: any): string {
    let fileExtension = "";
    if (item.originalFileName.lastIndexOf(".") > 0) {
      fileExtension = item.originalFileName.substring(item.originalFileName.lastIndexOf(".") + 1, item.originalFileName.length);
    }
    if (this.extlist.indexOf(fileExtension) <= -1) fileExtension = "unknown";
    return fileExtension;
  }

  ngOnInit() {
    this.files = this.data;
  }

  onCloseClick() {
    this.dialogRef.close(true);
  }

  onDownloadClick(file: any) {
    this.documentsService.downloadFile(file.virtualFileName, file.originalFileName);
  }
}
