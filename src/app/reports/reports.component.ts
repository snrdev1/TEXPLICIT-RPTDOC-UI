import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../core/auth.service';
import { LocalStorageService } from '../core/local-storage.service';
import { CommonService } from '../shared/services/common.service';
import { WebSocketService } from '../shared/services/socketio.service';
import { AddSubtopicComponent } from './add-subtopic/add-subtopic.component';
import { AddUrlsComponent } from './add-urls/add-urls.component';
import { ReportFilterComponent } from './report-filter/report-filter.component';
import { ReportUpdateComponent } from './report-update/report-update.component';
import { ReportFailedComponent } from './report-failed/report-failed.component';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],

})
export class ReportsComponent {
  form: FormGroup;
  sourceSelection: number = 1;
  filteredSource: string = "";
  filteredFormat: string = "";
  filteredReportType: string = "";
  userId: string = "";
  reportEvent: string = "";
  reportPendingEvent: string = "";
  completedReports: any = [];
  topic: any = "";
  sortBy: string = "task";
  sortDirection: string = "asc;"
  reportGenerationData: any[] = [];
  offset: number = 0;
  limit: number = 20;
  userInfo: any = [];
  displayStyle: string = 'list';
  isLoading: boolean = true;
  isDismissed: boolean = false;
  pendingReports: any = [];
  allReports: any = [];
  failedReports: any = [];
  fileBlob: Blob | null = null;
  audioPlayerVisible: boolean = false;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  @ViewChild('searchinput') searchInput!: ElementRef;
  userInfo$: Observable<any> = this.localStorage.userInfo$;

  constructor(
    private localStorage: LocalStorageService,
    private reportsService: ReportsService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private authService: AuthService,
    private socketService: WebSocketService,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      task: new FormControl('', Validators.required),
      source: new FormControl('external'),
      report_type: new FormControl('', Validators.required),
      format: new FormControl('pdf'),
      subtopics: new FormControl([]),
      report_generation_id: new FormControl(''),
      start_time: new FormControl(''),
      urls: new FormControl([]),
      restrict_search: new FormControl(false)
    });
    this.userInfo = this.localStorage.getUserInfo();
  }

  ngOnInit() {
    if (this.userInfo) {
      this.userId = this.userInfo?._id;
    }

    this.reportEvent = this.userId + "_report";
    this.reportPendingEvent = this.userId + "_report_pending";

    let filterValues = this.localStorage.getitem('reportFilter') || [];
    if (filterValues) {
      this.filteredSource = filterValues?.source || "";
      this.filteredFormat = filterValues?.format || "";
      this.filteredReportType = filterValues?.report_type || "";
    }
    this.isDismissed = this.localStorage.getitem('report-steps') || false;
    if (this.authService.isLoggedIn) {
      this.isLoading = true;
      this.getAllReports();
    }

    this.getPendingReports();
    this.getAllFailedReports();
    this.setupReportsListener();
    this.setupPendingReportsListener();
  }

  setupReportsListener() {
    this.socketService.listen(this.reportEvent).subscribe({
      next: (res) => {
        console.log("Received new completed report : ", res?.data);
        if (res.success) {
          this.appendNewReport(res.data);
        }
        else {
          this.commonService.showSnackbar('snackbar-error', res.message, res.status);
        }

        this.reportsService._allReportsSubject$.next(this.allReports);

        // Call pending reports to remove generated report from pending queue
        this.getPendingReports();
      },
      error: (e) => {
        console.log("Error", e);
        this.commonService.showSnackbar('snackbar-error', e.message, e.status);
      },
      complete: () => {
        console.log("Completed listenting. Report generated ");
      }
    })
  }

  setupPendingReportsListener() {
    this.socketService.listen(this.reportPendingEvent).subscribe({
      next: (res) => {
        if (res.success) {
          console.log("Received new pending report : ", res?.data);
          // Append received report as latest report to be pending

          this.pendingReports = [res.data, ...this.pendingReports];
        }
      },
      error: (e) => {
        console.log("Error", e);
        this.commonService.showSnackbar('snackbar-error', e.message, e.status);
      },
      complete: () => {
        console.log("Completed listenting. Pending report received");
      }
    })
  }

  getAllReports() {
    console.log("getAllReports called");
    this.reportsService.getAllreports(this.limit, this.offset, this.filteredSource, this.filteredFormat, this.filteredReportType).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log("All reports : ", res?.data);
        this.allReports = [...this.allReports, ...res?.data];
        console.log("Res in getAllReports", this.allReports);
        this.getPendingReports();
      },
      error: (e) => {
        this.isLoading = false;
        console.log("Error", e);
      },
      complete: () => {
        console.log("Completed fetching reports");
      }
    });
  }

  getPendingReports() {
    this.reportsService.pendingReports(this.limit, this.offset, this.filteredSource, this.filteredFormat, this.filteredReportType).subscribe({
      next: (res: any) => {
        this.pendingReports = res?.data;
        console.log("PENDING REPORTS:", res?.data);
      },
      error: (e: any) => {
        console.log("Error:", e);
      },
      complete: () => {
        console.log("Complete fetching pending reports");
      }
    })
  }

  appendNewReport(report: any) {
    // Convert datetime for report to user's local timezone

    // Update allReports array
    this.allReports = [report, ...this.allReports];

    // Show success message
    this.commonService.showSnackbar('snackbar-success', 'Report received successfully', 'success');
  }


  onSubmit() {
    if (!this.form.invalid) {
      const uniqueID: any = uuidv4();

      const timestamp: any = new Date().toLocaleTimeString();
      const combinedID: any = `${uniqueID}-${timestamp}`;
      this.form.patchValue({
        report_generation_id: combinedID,
        start_time: timestamp
      });

      this.reportsService.generateReport(this.form.value).subscribe({
        next: (res) => {
          console.log("On submitting topic: ", res);
          this.form.controls['task'].setValue('');
          this.form.controls['subtopics'].setValue([]);
          this.localStorage.setitem('subtopics', null);
          this.localStorage.setitem('urls', null);
          this.localStorage.setitem('restrictSearch', false);
          this.searchInput.nativeElement.value = "";
          this.commonService.showSnackbar("snackbar-info", "Report generation started...!", "0");
          this.showLoadingReports();
        },
        error: (e) => {
          console.log("Error: ", e);
          this.commonService.showSnackbar("snackbar-error", e.error.message, e.status);
        },
        complete: () => {
          console.log("Report generation in progress");
        }
      })
    }
  }

  onScroll(event: any) {
    // console.log('offsetHeight: ', event.target.offsetHeight)
    // console.log('scrollHeight: ', event.target.scrollHeight);
    // console.log('scrollTop: ', event.target.scrollTop);
    // console.log("Difference:", (event.target.scrollHeight - event.target.offsetHeight));
    if (Math.round(event.target.scrollTop) >= (event.target.scrollHeight - event.target.offsetHeight - 1)) {
      this.offset = this.offset + this.limit;
      this.limit = 10;
      this.getAllReports();
    }
  }


  sortReports(criteria: string) {
    if (criteria === this.sortBy) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = criteria;
      this.sortDirection = 'asc';
    }

    this.allReports.sort((report1: any, report2: any) => {
      if (this.sortDirection === 'asc') {
        return report1[this.sortBy] > report2[this.sortBy] ? 1 : -1;
      } else {
        return report2[this.sortBy] > report1[this.sortBy] ? 1 : -1;

      }
    });
  }

  onFilterClick() {
    console.log('Home Filter Click')
    const dialogRef = this.dialog.open(ReportFilterComponent, { panelClass: 'mat-filter-dialog' });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ', result);
      if (result !== undefined) {
        this.filteredSource = result?.source || "";
        this.filteredFormat = result?.format || "";
        this.filteredReportType = result?.report_type || "";
        this.reset();
        this.getAllReports();
      }
    });
  }

  showLoadingReports() {
    this.dialog.open(ReportUpdateComponent, { panelClass: 'mat-ki-add-dialog', data: this.pendingReports });
  }

  showFailedReports() {
    this.dialog.open(ReportFailedComponent, { panelClass: 'mat-report-dialog', data: this.failedReports });
  }

  getUrls() {
    let urls: any = this.localStorage.getitem('urls') || [];
    let restrictSearch: any = this.localStorage.getitem('restrictSearch') || false;
    const dialogRef = this.dialog.open(
      AddUrlsComponent,
      {
        panelClass: 'mat-question-answer-dialog',
        data: {
          "urls": urls,
          "restrictSearch": restrictSearch
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result of getUrls: ', result);
      if (result !== undefined) {
        this.form.setValue({
          ...this.form.value,
          urls: result.rows.map((row: any) => row?.url),
          restrict_search: result?.restrict_search
        });

        console.log("results : ", result);

        this.localStorage.setitem('urls', result?.rows);
        this.localStorage.setitem('restrictSearch', result?.restrict_search);
      }
    });
  }

  getSubtopics() {
    let subtopics: any = this.localStorage.getitem('subtopics') || [];
    const dialogRef = this.dialog.open(AddSubtopicComponent, { panelClass: 'mat-question-answer-dialog', data: subtopics });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result of getSubtopics: ', result);
      if (result !== undefined) {
        this.form.setValue({
          ...this.form.value,
          subtopics: result.rows
        });
        this.localStorage.setitem('subtopics', result.rows);
      }
    });
  }

  reset() {
    this.offset = 0;
    this.allReports = [];
  }

  dismissSteps() {
    this.isDismissed = true;
    this.localStorage.setitem('report-steps', this.isDismissed);
  }

  playAudio(report: any) {
    // Emit _id of report whose audio is playing
    this.reportsService.emitAudioReportId(report._id);

    if (this.fileBlob) {
      const blobUrl = URL.createObjectURL(this.fileBlob);
      this.audioPlayer.nativeElement.src = blobUrl;
      this.audioPlayer.nativeElement.load();
      this.audioPlayer.nativeElement.play();
    } else {
      console.error('Blob not available.');
    }
  }

  stopAudio() {
    this.audioPlayerVisible = false;
    this.audioPlayer.nativeElement.pause();
  }

  onAudioDownload(report: any) {
    this.reportsService.downloadReportAudio(report._id).subscribe({
      next: (res) => {
        console.log('Response', URL.createObjectURL(res));
        this.fileBlob = res;
        this.audioPlayerVisible = true;
        this.playAudio(report);
      },
      error: (e) => {
        console.log("Error", e);
        this.commonService.showSnackbar("snackbar-error", e.message, e.status);

      },
      complete: () => {
        console.log("Report audio download complete");
      }
    })
  }

  getAllFailedReports() {
    this.reportsService.getAllFailedReports().subscribe({
      next: (res) => {
        console.log("All failed reports : ", res?.data);
        this.failedReports = res?.data;
      },
      error: (e) => {
        console.log("Error", e);
      },
      complete: () => {
        console.log("Completed fetching failed reports");
      }
    });
  }
}


