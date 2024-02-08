import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ReportsService } from '../reports.service';

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
    private reportsService: ReportsService
  ) { }

  ngOnInit() {
    this.getAllFailedReports();
  }

  onCloseClick() {
    this.dialogRef.close(true);
  }

  getAllFailedReports() {
    this.reportsService.getAllFailedReports().subscribe({
      next: (res) => {
        console.log("All failed reports : ", res?.data);
        this.reports = res?.data;
      },
      error: (e) => {
        console.log("Error", e);
      },
      complete: () => {
        console.log("Completed fetching failed reports");
      }
    });
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
