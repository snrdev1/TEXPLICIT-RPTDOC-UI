import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/core/local-storage.service';

@Component({
  selector: 'app-report-update',
  templateUrl: './report-update.component.html',
  styleUrls: ['./report-update.component.scss']
})
export class ReportUpdateComponent {
  reports: any=[];
  displayStyle:string="list";
  constructor( public dialogRef: MatDialogRef<ReportUpdateComponent>,
                private localStorage:LocalStorageService,
                @Inject(MAT_DIALOG_DATA) public data: any){}

  ngOnInit(){
    this.reports = this.localStorage.getitem("reportDataArrayString")||[];
    console.log(" this.reports in REPORT UPDATE COMPONENT", this.reports);
    }
  onCloseClick(){
    this.dialogRef.close(true);
  }
}
