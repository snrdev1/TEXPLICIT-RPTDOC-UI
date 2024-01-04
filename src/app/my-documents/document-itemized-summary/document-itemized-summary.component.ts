import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-document-itemized-summary',
  templateUrl: './document-itemized-summary.component.html',
  styleUrls: ['./document-itemized-summary.component.scss']
})
export class DocumentItemizedSummaryComponent implements OnInit {
  items:any = [];
  fileIds:any = [];
  constructor(private router:Router,
    private localstorage:LocalStorageService,
    private http:HttpClient){}

  ngOnInit(){
    this.fileIds = this.localstorage.getitem("FileIdArray")||[];
    console.log("FIleID:",this.fileIds);
    if(this.fileIds.length == 0){
      this.router.navigate(['/my-documents']);
    }
    this.getSummaryData();
  }
  onHighlightsClick(event:any){
    this.router.navigateByUrl('/my-documents/highlight')
  }
  getSummaryData(){
    const url = `${environment.hostName}/my-documents/summary/itemized`;
    const params = {
      documentIds : this.fileIds
    }
    this.http.post(url, params).subscribe({
      next: (res: any) => {
        console.log("Fetching complete. Response : ", res);
        this.items = res.data;
      },
      error: (e) => console.error("Error : ", e),
      complete: () => {
        console.info('Complete!');
        console.log(this.items);
      }
    });
  }
  backClick(event:any){
    this.router.navigateByUrl('/my-documents');
  }
  pptDownload(event:any){
    console.log("Summary data : ", this.items);
    const data = this.items.map((elem: any, index: number) => {
      // const ki = elem?.ki;
      const row = {
        "seq_number": index,
        "title": elem?.title,
        "summary": elem?.itemizedSummary,
      }
      return row;
    });
    console.log("Data to ppt : ", data);
    const url = `${environment.hostName}/my-documents/summary/itemized/downloadppt?itemizedSentenceCount=5`;
    this.http.post(url, data, {responseType: 'blob'}).subscribe({
      next: (res: any) => {
        let blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, `itemized_summary_${new Date().toISOString()}.pptx`);
        console.log("PPT download complete");
      },
      error: (e) => console.error("Error : ", e),
      complete: () => {
        console.info('Complete!');
      }
    });
  }
  ExcelDownload(event:any){
    console.log("Summary data : ", this.items);
    const data = this.items.map((elem: any, index: number) => {
      const row = {
        "seq_number": index,
        "title": elem?.title,
        "summary": elem?.itemizedSummary,
      }
      return row;
    });
    // console.log("Data to ppt : ", data);

    // this.exportService.exportExcel(data, 'summary');
    const url = `${environment.hostName}/my-documents/summary/itemized/downloadexcel?itemizedSentenceCount=5`;
    this.http.post(url, data, {responseType: 'blob'}).subscribe({
      next: (res: any) => {
        let blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, `itemized_summary_${new Date().toISOString()}.xlsx`);
        console.log("Excel download complete");
      },
      error: (e) => console.error("Error : ", e),
      complete: () => {
        console.info('Complete!');
      }
    });
  }
}
