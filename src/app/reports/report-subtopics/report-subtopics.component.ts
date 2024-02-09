import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-report-subtopics',
  templateUrl: './report-subtopics.component.html',
  styleUrls: ['./report-subtopics.component.scss']
})
export class ReportSubtopicsComponent {
  report: any;
  reportType: string = "";
  reportTime: string = "";

  constructor(
    public dialogRef: MatDialogRef<ReportSubtopicsComponent>,
    private reportsService: ReportsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.report = this.data;

    switch(this.report.report_type) {
      case 'research_report':
        this.reportType = 'Summary Report';
        break;
      case 'outline_report':
        this.reportType = 'Outline Report';
        break;
      case 'resource_report':
        this.reportType = 'Resource Report';
        break;
      case 'detailed_report':
        this.reportType = 'Detailed Report';
        break;
      case 'complete_report':
        this.reportType = 'Combined Report';
        break;
      default:
        this.reportType = 'Unknown type';
    }

    this.reportTime = this.transformTime(this.report?.report_generation_time);
  }

  transformTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);

    const minuteString = minutes > 1 ? 'minutes' : 'minute';
    const secondString = remainingSeconds > 1 ? 'seconds' : 'second';

    if (minutes === 0) {
      return `${remainingSeconds} ${secondString}`;
    } else if (remainingSeconds === 0) {
      return `${minutes} ${minuteString}`;
    } else {
      return `${minutes} ${minuteString} ${remainingSeconds} ${secondString}`;
    }
  }

  onCloseClick() {
    this.dialogRef.close(true);
  }
}
