import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { WebSocketService } from 'src/app/shared/services/socketio.service';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-report-update',
  templateUrl: './report-update.component.html',
  styleUrls: ['./report-update.component.scss']
})
export class ReportUpdateComponent {
  reports: any = [];
  displayStyle: string = "list";
  message: string = '';
  statusSocket: string = '';
  userInfo: any = [];
  userId: string = '';
  offset: number = 0;
  limit: number = 30;
  source: string = "";
  format: string = "";
  reportType: string = "";
  pendingReports: any = [];

  allReports$: Observable<any> = this.reportsService.allReports$;

  constructor(public dialogRef: MatDialogRef<ReportUpdateComponent>,
    private socketService: WebSocketService,
    private localStorage: LocalStorageService,
    private reportsService: ReportsService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.reports = this.data.data;
    console.log("data from report component : ", this.reports);

    this.allReports$.subscribe((reports: any) => {
      if(reports){
      const pendingReports = this.reports.filter((item1: { report_generation_id: string; }) => !reports.some((item2: { report_generation_id: string; }) => item1.report_generation_id === item2.report_generation_id));
      this.reports = pendingReports;
      console.log("New reports received! : ", reports);
    }
    });
  }

  getPendingReports() {
    this.reportsService.pendingReports(this.limit, this.offset, this.source, this.format, this.reportType).subscribe({
      next: (res: any) => {
        console.log("RES in UPDATE CARD COMPONENT", res);
        this.reports = res.data;
        console.log("PENDING REPORTS in UPDATE CARD COMPONENT:", this.reports);

      },
      error: (e: any) => {
        console.log("Error:", e);
      },
      complete: () => {
        console.log("Complete fetching pending reports");
      }
    })
  }
  onCloseClick() {
    this.dialogRef.close(true);
  }
}
