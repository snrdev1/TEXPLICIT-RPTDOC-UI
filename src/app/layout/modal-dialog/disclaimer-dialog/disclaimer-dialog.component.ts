import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-disclaimer-dialog',
  templateUrl: './disclaimer-dialog.component.html',
  styleUrls: ['./disclaimer-dialog.component.scss']
})
export class DisclaimerDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DisclaimerDialogComponent>
  ){}

  onCloseClick(){
    this.dialogRef.close(false);
  }
}
