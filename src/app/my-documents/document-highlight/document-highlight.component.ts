import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { WebSocketService } from 'src/app/shared/services/socketio.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-document-highlight',
  templateUrl: './document-highlight.component.html',
  styleUrls: ['./document-highlight.component.scss']
})
export class DocumentHighlightComponent implements OnInit{
  items:any = [];
  fileIds:any = [];
  constructor(public router:Router,
    private localstorage:LocalStorageService,
    private http:HttpClient,
    private webSocketService: WebSocketService){}
  
  ngOnInit(){
    this.fileIds = this.localstorage.getitem("FileIdArray")||[];
    console.log("FIleID:",this.fileIds);
    if(this.fileIds.length == 0){
      this.router.navigate(['/my-documents']);
    }
    this.getHighlightsData();
  }
  onItemizedSummaryClick(event:any){
    this.router.navigateByUrl('/my-documents/itemized-summary');
  }
  getHighlightsData(){
    const url = `${environment.hostName}/my-documents/summary/highlights`;
    const params = {
      fileIds : this.fileIds
    }
    this.http.post(url, params).subscribe({
      next: (res: any) => {
        console.log("Fetching complete. Response : ", res);
        // this.items = res.data;
      },
      error: (e) => console.error("Error : ", e),
      complete: () => {
        console.info('Complete!');
        console.log(this.items);
      }
    });
    this.webSocketService.listen('server_emit_highlight').subscribe({
      next: (response: any) => {
        console.log("response : ", response);
        this.items.push({
          ...response?.data,
        });
        console.log(this.items);
      },
      error: (e) => console.log("Error : ", e),
      complete: () => {
        console.info('Complete!');
      }
    });
  }
  getFormattedSentence(sentence: string, keyPhrases: string) {
    const ignoreCaseRegex = new RegExp(keyPhrases, 'i');
    const replacedSentence = sentence.replace(ignoreCaseRegex,
      `<span class="blue">&nbsp;${keyPhrases}&nbsp;</span>`
    );

    return replacedSentence;
  }
  backClick(event:any){
    this.router.navigateByUrl('/my-documents');
  }
  PowerpointDownload(event:any){
    const data = this.items.map((elem: any, index: number) => {
      const row = {
        "seq_number": index,
        "title": elem?.title,
        "highlights": elem?.highlights
      }
      return row;
    });
    // console.log("Data to ppt : ", data);
    const url = `${environment.hostName}/my-documents/summary/highlights/downloadppt?itemizedSentenceCount=5`;
    this.http.post(url, data, {responseType: 'blob'}).subscribe({
      next: (res: any) => {
        let blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, `highlights_summary_${new Date().toISOString()}.pptx`);
        console.log("PPT download complete");
        // console.log(res);
      },
      error: (e) => console.error("Error : ", e),
      complete: () => {
        console.info('Complete!');
      }
    });
  }
  ExcelDownload(event:any){
    const data = this.items.map((elem: any, index: number) => {
      const row = {
        "seq_number": index,
        "title": elem?.title,
        "highlights": elem?.highlights
      }
      return row;
    });
    // console.log("Data to ppt : ", data);
    const url = `${environment.hostName}/my-documents/summary/highlights/downloadexcel?itemizedSentenceCount=5`;
    this.http.post(url, data, {responseType: 'blob'}).subscribe({
      next: (res: any) => {
        let blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, `highlights_summary_${new Date().toISOString()}.xlsx`);
        console.log("Excel download complete");
        // console.log(res);
      },
      error: (e) => console.error("Error : ", e),
      complete: () => {
        console.info('Complete!');
      }
    });
  }
}
