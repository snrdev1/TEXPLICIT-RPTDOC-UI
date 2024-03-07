import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-chat-sources',
  templateUrl: './chat-sources.component.html',
  styleUrls: ['./chat-sources.component.scss']
})
export class ChatSourcesComponent {
  sources: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ChatSourcesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.sources = this.data;
    console.log("Sources : ", this.sources);
  }

  onCloseClick() {
    this.dialogRef.close(true);
  }
}
