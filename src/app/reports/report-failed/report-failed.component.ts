import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ReportsService } from 'src/app/services/reports.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-report-failed',
  templateUrl: './report-failed.component.html',
  styleUrls: ['./report-failed.component.scss']
})
export class ReportFailedComponent {
  reports: any = [];
  isLoading: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<ReportFailedComponent>,
    private reportsService: ReportsService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.getFailedReports();
  }

  onCloseClick() {
    this.dialogRef.close(true);
  }

  getFailedReports() {
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
        this.isLoading = false;
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

  onDeleteClick(reportId: string) {
    this.reportsService.deleteReports([reportId]).subscribe({
      next: (res) => {
        console.log("Successfully deleted report : ", res);
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

  onReportRetry(report: any) {
    const reportArgs = {
      start_time: new Date().toLocaleTimeString(),
      createdBy: report?.createdBy,
      format: report?.format,
      report_generation_id: report?.report_generation_id,
      report_type: report?.report_type,
      restrict_search: report?.restrict_search,
      source: report?.source,
      subtopics: report?.subtopics,
      task: report?.task,
      urls: report?.urls
    };

    // First delete the existing report
    this.onDeleteClick(report?._id);

    // Generate the report again
    this.reportsService.generateReport(reportArgs).subscribe({
      next: (res) => {
        this.commonService.showSnackbar("snackbar-info", "Report generation started...!", "0");
      },
      error: (e) => {
        console.log("Error: ", e);
        this.commonService.showSnackbar("snackbar-error", e.error.message, e.status);
      },
      complete: () => {
        console.log("Report generation in progress");
      }
    });
  }
}
