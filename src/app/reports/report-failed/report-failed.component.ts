import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReportsService } from 'src/app/services/reports.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-report-failed',
  templateUrl: './report-failed.component.html',
  styleUrls: ['./report-failed.component.scss']
})
export class ReportFailedComponent {
  reports: any = [];

  constructor(
    public dialogRef: MatDialogRef<ReportFailedComponent>,
    private reportsService: ReportsService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.reports = this.data;
  }

  onCloseClick() {
    this.dialogRef.close(true);
  }

  deleteAllFailedReports() {
    this.reportsService.deleteAllFailedReports().subscribe({
      next: (res) => {
        this.reports = [];
      },
      error: (e) => {
        console.log("Error", e);
      },
      complete: () => {
        console.log("Completed deleting all failed reports!");
      }
    });
  }

  onDeleteClick(reportId: any){
    this.reportsService.deleteReports([reportId]).subscribe({
      next: (res) => {
        this.commonService.showSnackbar("snackbar-success", res.message, res.status);
      },
      error: (e) => {
        console.log("Error", e);
        this.commonService.showSnackbar("snackbar-error", e.message, e.status);
      },
      complete: () => {
        this.reports = this.reports.filter((report: any) => report._id !== reportId);
      }
    })
  }
}
