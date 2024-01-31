import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
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

  constructor(
    public dialogRef: MatDialogRef<ReportUpdateComponent>,
    private reportsService: ReportsService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit() {
    this.reports = this.data.data;
    this.convertDatetimeForReports(this.reports);

    this.allReports$.subscribe((reports: any) => {
      if (reports) {
        const pendingReports = this.reports.filter((item1: { report_generation_id: string; }) => !reports.some((item2: { report_generation_id: string; }) => item1.report_generation_id === item2.report_generation_id));
        this.reports = pendingReports;
        console.log("New reports received! : ", reports);
      }
    });
  }

  convertDatetimeForReports(reports: any[]) {
    // Convert datetime for reports to user's local timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    reports.forEach(report => {
      const utcDatetime = new Date(report.createdOn);
      report.createdOn = this.datePipe.transform(utcDatetime, 'h:mm:ss a', userTimezone);

      console.log("Original Date : ", utcDatetime);
      console.log("New Date : ", report.createdOn);
    });
  }

  onCloseClick() {
    this.dialogRef.close(true);
  }
}
