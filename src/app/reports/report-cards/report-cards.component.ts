import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { FileFolderShareDialogComponent } from 'src/app/my-documents/modal-dialog/file-folder-share-dialog/file-folder-share-dialog.component';
import { ReportsService } from 'src/app/services/reports.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ReportSubtopicsComponent } from '../report-subtopics/report-subtopics.component';


@Component({
  selector: 'app-report-cards',
  templateUrl: './report-cards.component.html',
  styleUrls: ['./report-cards.component.scss']
})
export class ReportCardsComponent {
  @Input() public checkboxVisible: boolean = true;
  @Input() public moreButtonVisible: boolean = true;
  reportType: string = "";
  showFullTextFlag: boolean = false;
  isPlaying: boolean = false;
  @Input() report: any = [];
  @Input() displayStyle: any = "";
  audioPlayerVisible: boolean = false;
  @Output() deleteReport = new EventEmitter<any>();
  @Output() playAudioEvent = new EventEmitter<any>();
  @Output() stopAudioEvent = new EventEmitter<any>();
  reportsAudio$: Observable<any> = this.reportService.reportsAudio$;

  constructor(private reportService: ReportsService,
    public dialog: MatDialog,
    private commonService: CommonService) { }

  ngOnInit() {
    this.report = {
      ... this.report,
      isTruncated: true
    };

    this.reportType = this.report.report_type == "research_report" ? "Summary Report" :
      this.report.report_type == "outline_report" ? "Outline Report" :
        this.report.report_type == "resource_report" ? "Resource Report" :
          this.report.report_type == "detailed_report" ? "Detailed Report" : "Unknown type";

    // remove later
    if (this.report.format == undefined) {
      this.report.format = "pdf";
    }

    this.setupReportsAudioListener();
  }

  setupReportsAudioListener() {
    this.reportsAudio$.subscribe((reportid: any) => {
      if (reportid && reportid == this.report._id) {
        this.audioPlayerVisible = true;
      } else {
        this.audioPlayerVisible = false;
      }
    });
  }

  onChange(e: any) { }
  isChecked(item: any) { }

  playAudio(report: any) {
    this.playAudioEvent.emit(report);
  }

  stopAudio() {
    this.audioPlayerVisible = false;
    this.stopAudioEvent.emit();
  }

  /**
   * Handles the download button click for a given report.
   * Downloads the report in either Word (.docx) or PDF (.pdf) format based on the report's format.
   * @param report - The report object containing details like report_type, task, and _id.
   */
  onDownloadClick(report: any): void {
    // Log the original report (assuming this.report is the intended object)
    console.log("Original report", this.report);

    // File naming convention: <Report Type> - <Report Name_timestamp>.docx or .pdf
    const reportDownloadName = `${report.report_type.toUpperCase()}-${report.task}_${new Date().toISOString()}`;

    // Determine the file type based on the report format
    const fileType = (this.report.format === 'word') ? 'application/msword' : 'application/pdf';

    // Subscribe to the report download service
    this.reportService.downloadReportsDoc(report._id).subscribe({
      next: (res) => {
        // Create a Blob from the response
        const blob = new Blob([res], { type: fileType });

        // Determine the file extension based on the report format
        const fileExtension = (this.report.format === 'word') ? 'docx' : 'pdf';

        // Save the Blob as a file using the file-saver library
        saveAs(blob, `${reportDownloadName}.${fileExtension}`);

        // Log download completion message
        console.log(`${fileExtension.toUpperCase()} download complete`);
      },
      error: (e) => {
        // Log and display an error message
        console.error("Error", e);
        this.commonService.showSnackbar("snackbar-error", e.message, e.status);
      },
      complete: () => {
        // Log completion message
        console.log("Report download complete");
      }
    });
  }


  // onDeleteClick(report:any){
  //   console.log("Report in onDeleteClick: ",report);
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent,{panelClass:'mat-dialog-panel',data:{"modalTitle":"Delete report","modalMessage":"Are you sure you want to delete this report?"}});

  //   dialogRef.afterClosed().subscribe((result:any) => {
  //     if(result){
  //         let data: any = {
  //           "reportid": report._id,
  //           "virtualFilename": report.virtualFilename
  //         }
  //         console.log("data",data);
  //         this.reportService.deleteReport(data).subscribe({
  //           next: (res)=>{
  //             console.log("Delete report",res);
  //             this.commonService.showSnackbar("snackbar-success",res.message,"0");
  //             this.deleteReport.emit();
  //           },
  //           error: (e)=>{
  //             console.log("Error",e);
  //             this.commonService.showSnackbar("snackbar-error",e.error.message,e.status);
  //           },
  //           complete: ()=>{
  //             console.log("Report deletion complete");
  //           }
  //         })
  //       }
  //     })
  //   }


  // onRenameClick(item:any){}
  // onShareClick(item:any){}
  // onMoveClick(item:any){}

  truncateText(text: string, maxLength: number): string {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  // // Add this function to toggle text truncation on hover
  // toggleTruncateText(item: any) {
  //   item.isTruncated = !item.isTruncated;
  // }
  showFullText() {
    this.showFullTextFlag = true;
  }

  hideFullText() {
    this.showFullTextFlag = false;
  }

  onReportDetailsClick() {
    console.log("Report : ", this.report);

    // if (this.report?.subtopics.length > 0) {
    this.dialog.open(ReportSubtopicsComponent, { panelClass: 'mat-dialog-panel', data: this.report });
    // }
  }

  onReportShareClick(reportId: string) {
    const dialogRef = this.dialog.open(FileFolderShareDialogComponent, { panelClass: 'mat-dialog-panel', data: { "reportIds": [reportId], "shareDocumentType": "report", "internalShare": false } });
  }

  onDownloadDataTablesClick(report: any) {

    // File naming convention: <Report Type> - <Report Name_timestamp>.docx or .pdf
    const downloadName = `${report.report_type.toUpperCase()}-${report.task}_${new Date().toISOString()}_data_table`;

    // Determine the file type based on the report format
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    this.reportService.downloadReportDataTable(report?._id).subscribe({
      next: (res) => {
        // Create a Blob from the response
        const blob = new Blob([res], { type: fileType });

        // Determine the file extension based on the report format
        const fileExtension = 'xlsx';

        // Save the Blob as a file using the file-saver library
        saveAs(blob, `${downloadName}.${fileExtension}`);

        // Log download completion message
        console.log(`${fileExtension.toUpperCase()} download complete`);
      },
      error: (e) => {
        // Log and display an error message
        console.error("Error", e);
        this.commonService.showSnackbar("snackbar-error", e.message, e.status);
      },
      complete: () => {
        // Log completion message
        console.log("Report download complete");
      }
    });
  }
}
