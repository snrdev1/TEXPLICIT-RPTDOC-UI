// reports.component.ts

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
import { ReportFilterComponent } from './report-filter/report-filter.component';
import { ReportUpdateComponent } from './report-update/report-update.component';
import { ReportsService } from './reports.service';

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
  completedReports: any = [];
  topic: any = "";
  sortBy: string = "task";
  sortDirection: string = "asc;"
  onProgressStatus: boolean = false;
  reportGenerationData: any[] = [];
  offset: number = 0;
  limit: number = 30;
  userInfo: any = [];
  displayStyle: string = 'list';
  isLoading: boolean = true;
  isDismissed: boolean = false;
  pendingReports: any = [];
  allReports: any = [];
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
      websearch: new FormControl(true),
      subtopics: new FormControl([]),
      report_generation_id: new FormControl(''),
      start_time: new FormControl('')
    });
    this.userInfo = this.localStorage.getUserInfo();
  }

  ngOnInit() {
    if (this.userInfo) {
      this.userId = this.userInfo?._id;
    }

    this.reportEvent = this.userId + "_report";
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
    this.setupReportsListener();
    // this.setupReportsAudioListener();
  }

  setupReportsListener() {
    this.socketService.listen(this.reportEvent).subscribe({
      next: (res) => {
        console.log("res from socket", res.data);
        if (res.success) {
          this.commonService.showSnackbar('snackbar-success', res.message, res.status);
          this.allReports = [res.data, ...this.allReports];
        }
        else {
          this.commonService.showSnackbar('snackbar-error', res.message, res.status);
        }

        this.reportsService._allReportsSubject$.next(this.allReports);
      },
      error: (e) => {
        console.log("Error", e);
        this.commonService.showSnackbar('snackbar-error', e.message, e.status);
      },
      complete: () => {
        this.getPendingReports();
        console.log("Completed listenting. Report generated ");
      }
    })
  }

  getPendingReports() {
    this.reportsService.pendingReports(this.limit, this.offset, this.filteredSource, this.filteredFormat, this.filteredReportType).subscribe({
      next: (res: any) => {
        // console.log("Res of PENDING REPORTS:", res);
        this.pendingReports = res;
        console.log("PENDING REPORTS:", this.pendingReports);

      },
      error: (e: any) => {
        console.log("Error:", e);
      },
      complete: () => {
        console.log("Complete fetching pending reports");
      }
    })
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
      console.log(this.form.value);

      const submitReport = this.form.value;

      this.reportsService.generateReport(this.form.value).subscribe({
        next: (res) => {
          console.log("On submitting topic: ", res);
          this.form.controls['task'].setValue('');
          this.form.controls['subtopics'].setValue([]);
          this.localStorage.setitem('subtopics', null);

          this.searchInput.nativeElement.value = "";
          this.commonService.showSnackbar("snackbar-info", "Report creation takes a few minutes time. Truly appreciate your patience. Thank You!", "0")
          this.onProgressStatus = true;
        },
        error: (e) => {
          console.log("Error: ", e);
          this.onProgressStatus = false;
        },
        complete: () => {
          this.getPendingReports();
          console.log("Report generation in progress");
        }
      })
    }
  }

  getAllReports() {
    console.log("getAllReports called");
    this.reportsService.getAllreports(this.limit, this.offset, this.filteredSource, this.filteredFormat, this.filteredReportType).subscribe({
      next: (res) => {
        this.isLoading = false;
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
    })
  }

  onScroll(event: any) {
    console.log('offsetHeight: ', event.target.offsetHeight)
    console.log('scrollHeight: ', event.target.scrollHeight);
    console.log('scrollTop: ', event.target.scrollTop);
    console.log("Difference:", (event.target.scrollHeight - event.target.offsetHeight));
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
    console.log('report progress dialog clicked');
    const dialogRef = this.dialog.open(ReportUpdateComponent, { panelClass: 'mat-ki-add-dialog', data: this.pendingReports });

    dialogRef.afterClosed().subscribe(result => {
      console.log('report progress dialog closed');
    });
  }

  getSubtopics() {
    console.log('Add subtopic Click');
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
}


