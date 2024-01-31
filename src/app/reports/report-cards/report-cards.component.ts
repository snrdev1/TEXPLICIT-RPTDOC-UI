import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { CommonService } from 'src/app/shared/services/common.service';
import { ReportsService } from '../reports.service';
// import * as jsPDF from 'jspdf';
// import * as html2pdf from 'html2pdf.js';
import { Observable } from 'rxjs';


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
          this.report.report_type == "detailed_report" ? "Detailed Report" :
            this.report.report_type == "complete_report" ? "Combined Report" : "Unknown type";

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

  onDownloadClick(report: any) {
    console.log("report", this.report);
    if (this.report.format === 'word') {
      console.log("report", this.report.format);

      this.reportService.downloadReportsDoc(report._id).subscribe({
        next: (res) => {
          // let blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
          let blob = new Blob([res], { type: 'application/msword' });

          const url = window.URL.createObjectURL(blob);
          saveAs(blob, `${report.task}_${new Date().toISOString()}.docx`);
          console.log("Word download complete");
        },
        error: (e) => {
          console.log("Error", e);
          this.commonService.showSnackbar("snackbar-error", e.message, e.status);

        },
        complete: () => {
          console.log("Report download complete");
        }
      });
    }
    else {
      this.reportService.downloadReportsDoc(report._id).subscribe({
        next: (res) => {
          let blob = new Blob([res], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          saveAs(blob, `${report.task}_${new Date().toISOString()}.pdf`);
          console.log("PDF download complete");
        },
        error: (e) => {
          console.log("Error", e);
          this.commonService.showSnackbar("snackbar-error", e.message, e.status);
        },
        complete: () => {
          console.log("Report download complete");
        }
      });
    }
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


}
