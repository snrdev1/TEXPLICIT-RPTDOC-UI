import { Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  modalTitle:string=""
  modalMessage:string=""
  
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    
  }

  ngOnInit(){
    this.modalTitle=this.data.modalTitle;
    this.modalMessage=this.data.modalMessage;
  }
  onCloseClick(){
    this.dialogRef.close(false);
  }

  onYesClick(){
    this.dialogRef.close(true);
  }

  onNoClick(){
    this.dialogRef.close(false);
  }
}
