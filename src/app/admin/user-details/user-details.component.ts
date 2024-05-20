import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: any },
    public dialogRef: MatDialogRef<UserDetailsComponent>,
  ) {
    console.log("Data : ", this.data);
   }

  onCloseClick() {
    this.dialogRef.close(false);
  }

  sizeToMb(documentSize: number){
    return (documentSize / (1024*1024));
  }
}
