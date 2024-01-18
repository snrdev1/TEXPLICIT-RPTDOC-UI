import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { WebSocketService } from 'src/app/shared/services/socketio.service';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-report-update',
  templateUrl: './report-update.component.html',
  styleUrls: ['./report-update.component.scss']
})
export class ReportUpdateComponent {
  reports: any=[];
  displayStyle:string="list";
  message:string='';
  statusSocket:string='';
  userInfo:any=[];
  userId:string='';
  offset: number = 0;
  limit: number = 30;
  source: string = "";
  format: string = "";
  reportType: string = "";
  pendingReports:any=[];
  
  constructor( public dialogRef: MatDialogRef<ReportUpdateComponent>,
                private socketService:WebSocketService,
                private localStorage:LocalStorageService,
                private reportsService:ReportsService,
                @Inject(MAT_DIALOG_DATA) public data: any){}

  ngOnInit(){
    // this.reports = this.localStorage.getitem("reportDataArrayString")||[];
    console.log("data from report component",this.data.data);
    this.reports = this.data.data;
    // this.limit = this.data.limit;
    // this.offset = this.data.offset;
    // this.filteredSource = this.data.source;
    // this.filteredReportType = this.data.filteredReportType;
    // this.filteredFormat = this.data.filteredFormat;

    // this.getPendingReports();
    // this.userInfo =  this.localStorage.getUserInfo();
    // console.log("Userinfo:", this.userInfo);
    // this.userId = this.userInfo._id;
    // this.statusSocket = this.userId + '_report_status';
    // this.socketService.listen(this.statusSocket).subscribe({
    //   next:(res)=>{
    //     console.log("Response of socket", res);
    //     this.message = res;
        
    //   }
    // })
    
    // this.reports = this.data.data;
    // console.log(" this.reports in REPORT UPDATE COMPONENT", this.reports);
    
    }

    getPendingReports(){
      this.reportsService.pendingReports(this.limit, this.offset, this.source, this.format,this.reportType).subscribe({
        next: (res:any)=>{
          console.log("RES in UPDATE CARD COMPONENT", res);
          this.reports = res.data;
          console.log("PENDING REPORTS in UPDATE CARD COMPONENT:", this.reports);
  
        },
        error: (e:any)=>{
          console.log("Error:",e);
        },
        complete:()=>{
          console.log("Complete fetching pending reports");
        }
      })
    }
  onCloseClick(){
    this.dialogRef.close(true);
  }
}
