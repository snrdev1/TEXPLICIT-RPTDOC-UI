// reports.component.ts

import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../core/local-storage.service';
import { WebSocketService } from '../shared/services/socketio.service';
import { ReportsService } from './reports.service';
import { CommonService } from '../shared/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { ReportFilterComponent } from './report-filter/report-filter.component';
import { v4 as uuidv4 } from 'uuid';
import { ReportUpdateComponent } from './report-update/report-update.component';
import { AddSubtopicComponent } from './add-subtopic/add-subtopic.component';
import { AuthService } from '../core/auth.service';

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
  userId: string="";
  reportEvent: string="";
  allReports: any=[];
  completedReports:any=[];
  topic: any="";
  sortBy: string = "task";
  sortDirection: string = "asc;"
  onProgressStatus:boolean=false;
  reportGenerationData:any[] = [];
  offset:number=0;
  limit:number=15;
  userInfo:any=[];
  // isLoading:boolean=false;
  userInfo$: Observable<any> = this.localStorage.userInfo$;
  @ViewChild('searchinput') searchInput!: ElementRef;

  constructor(private localStorage: LocalStorageService,
    private reportsService: ReportsService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private authService: AuthService,
    private socketService: WebSocketService,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      task: new FormControl('', Validators.required),
      source: new FormControl('external'), 
      report_type: new FormControl('research_report'),
      format: new FormControl('pdf'),
      websearch:new FormControl(false),
      subtopics: new FormControl([]),
      report_generation_id: new FormControl(''),
      start_time:new FormControl('')
    });
    this.userInfo = this.localStorage.getUserInfo();
  }

  
  ngOnInit(){
    // this.userInfo$.subscribe((res) =>{
    // this.userId = res?._id;
    // });
    if(this.userInfo){
      this.userId = this.userInfo?._id;
      }
    this.reportEvent =  this.userId + "_report";
    let filterValues = this.localStorage.getitem('reportFilter')||[];
    if(filterValues){
      this.filteredSource = filterValues?.source || "";
      this.filteredFormat = filterValues?.format || "";
      this.filteredReportType = filterValues?.report_type || "";
    }
    this.reportGenerationData = this.localStorage.getitem('reportDataArrayString')||[];
    
    if(this.authService.isLoggedIn){
    this.getAllReports();
    }

    this.socketService.listen(this.reportEvent).subscribe({
      next: (res)=>{
        console.log("res from socket",res.data);
        this.reportGenerationData = this.localStorage.getitem('reportDataArrayString')||[];
        const index = this.reportGenerationData.findIndex((report:any)=>report.report_generation_id === res.data.report_generation_id);
        if(index != -1){
          this.reportGenerationData.splice(index,1);
          this.localStorage.setitem('reportDataArrayString', this.reportGenerationData);
        }
        if(res.success){
        this.commonService.showSnackbar('snackbar-success',res.message,res.status);
        this.reset();
        this.getAllReports();
        }
        else{
        this.commonService.showSnackbar('snackbar-error',res.message,res.status);
        }

      },
      error: (e)=>{
        console.log("Error",e);
        this.commonService.showSnackbar('snackbar-error',e.message,e.status);
      },
      complete: ()=> {console.log("Completed listenting. Report generated ");
        }
    })

  }

  onSubmit() {
    if (!this.form.invalid) {
      // console.log(this.form.value);
      // this.topic = this.form.controls["task"].value;
      const uniqueID: any = uuidv4();
      // const timestamp:any = new Date().getTime();

      const timestamp:any = new Date().toLocaleTimeString();
      const combinedID : any= `${uniqueID}-${timestamp}`;
      this.form.patchValue({
        report_generation_id: combinedID,
        start_time: timestamp
      });
      console.log(this.form.value);

      const submitReport = this.form.value;
      this.reportGenerationData.push(submitReport);
      // const reportDataArrayString = JSON.stringify(this.reportGenerationData);
      this.localStorage.setitem('reportDataArrayString', this.reportGenerationData);

      this.reportsService.generateReport(this.form.value).subscribe({
        next:(res)=>{
          console.log("On submitting topic: ",res);
          this.form.controls['subtopics'].setValue([]);
          this.localStorage.setitem('subtopics',null);

          this.searchInput.nativeElement.value = "";
          this.commonService.showSnackbar("snackbar-info","Report creation takes a few minutes time. Truly appreciate your patience. Thank You!","0")
          this.onProgressStatus = true;
          },
        error:(e)=>{
          console.log("Error: ",e);
          this.onProgressStatus = false;
        },
        complete:()=>{
          console.log("Report generation in progress");
        }
      })
    }
  }

  getAllReports(){
    console.log("getAllReports called");
    this.reportsService.getAllreports(this.limit,this.offset,this.filteredSource,this.filteredFormat,this.filteredReportType).subscribe({
      next:(res)=>{
        // console.log("this.filteredSource",this.filteredSource);
        // if(this.filteredSource && this.filteredSource.length>0){
        //   this.allReports = res?.data.filter((report:any)=>report.source == this.filteredSource);
        //   console.log("on filter",this.allReports);
        // }
        // else{
          this.allReports =[...this.allReports,...res?.data] ;
          console.log("Res in getAllReports",this.allReports);
        // }
        // this.onProgressStatus = false;
      },
      error:(e)=>{
        console.log("Error",e);
      },
      complete:()=>{
        console.log("Completed fetching reports");
      }
    })
  } 

  sortReports(criteria: string) {
   if(criteria === this.sortBy){
    this.sortDirection = this.sortDirection === 'asc'?'desc':'asc';
   } else{
    this.sortBy = criteria;
    this.sortDirection = 'asc';
   }

   this.allReports.sort((report1:any,report2:any)=>{
    if(this.sortDirection === 'asc'){
      return report1[this.sortBy]>report2[this.sortBy] ? 1 : -1;
    }else{
      return report2[this.sortBy]>report1[this.sortBy] ? 1 : -1;

    }
   });
  }

  onFilterClick(){
    console.log('Home Filter Click')
    const dialogRef = this.dialog.open(ReportFilterComponent,{panelClass:'mat-filter-dialog'});

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ',result);
      if(result!==undefined){
      this.filteredSource = result?.source || "" ;
      this.filteredFormat = result?.format || "";
      this.filteredReportType = result?.report_type || "";
      this.reset();
      this.getAllReports();
      // if(this.filteredSource!=null){
      //   this.getAllReports();
      // }
    }
  });
}

showLoadingReports(){
  console.log('report progress dialog clicked')
    const dialogRef = this.dialog.open(ReportUpdateComponent,{panelClass:'mat-filter-dialog',data: this.reportGenerationData});

    dialogRef.afterClosed().subscribe(result => {
      console.log('report progress dialog closed');
    });
}
getSubtopics(){
  console.log('Add subtopic Click');
  let subtopics: any = this.localStorage.getitem('subtopics') || [];
  // console.log("Subtopics from local storage",subtopics);
  const dialogRef = this.dialog.open(AddSubtopicComponent,{panelClass:'mat-question-answer-dialog',data:subtopics});

  dialogRef.afterClosed().subscribe(result => {
    console.log('Dialog result of getSubtopics: ',result);
    if (result!==undefined) {
      this.form.setValue({
        ...this.form.value, 
        subtopics: result.rows
      // });
      });
      this.localStorage.setitem('subtopics',result.rows);
    }
  });
}
onScroll(event:any){
  console.log('offsetHeight: ',event.target.offsetHeight)
  console.log('scrollHeight: ',event.target.scrollHeight);
  console.log('scrollTop: ',event.target.scrollTop);
  console.log("Difference:",(event.target.scrollHeight-event.target.offsetHeight));
  if (Math.round(event.target.scrollTop)>=(event.target.scrollHeight-event.target.offsetHeight-1)){
   this.offset = this.offset + this.limit;
   this.getAllReports();
  }
}
reset(){
  this.offset=0;
  this.allReports=[];
}
}


