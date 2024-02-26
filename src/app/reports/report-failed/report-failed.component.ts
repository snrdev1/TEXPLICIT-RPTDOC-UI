import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-report-failed',
  templateUrl: './report-failed.component.html',
  styleUrls: ['./report-failed.component.scss']
})
export class ReportFailedComponent {
  reports: any = [];
  displayStyle: string = "list";

  constructor(
    public dialogRef: MatDialogRef<ReportFailedComponent>,
    private reportsService: ReportsService,
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
}
