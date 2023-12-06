import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { HomeService } from 'src/app/shared/services/home.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-knowledgeitem-consolidated-summary',
  templateUrl: './knowledgeitem-consolidated-summary.component.html',
  styleUrls: ['./knowledgeitem-consolidated-summary.component.scss']
})
export class KnowledgeitemConsolidatedSummaryComponent {
  ki_ids: string[]=[];
  kiDetails: any[]=[];
  consolidatedSummary: any=[];
  referralLinks: any[]=[];
  constructor(private router:Router,
              private homeService:HomeService,
              public localStorageService:LocalStorageService){}
  
  ngOnInit(){
    this.kiDetails = this.localStorageService.getitem("kiForSummary");
    this.ki_ids = this.kiDetails.map((ki:any)=>ki.kiId);
    this.getConsolidatedSummary()
  }

  getConsolidatedSummary(){
    this.homeService.getConsolidatedSummary(this.ki_ids).subscribe({
      next: (res)=>{
        this.consolidatedSummary = res?.data;
        // console.log("ConsolidatedSummary",this.consolidatedSummary);
        this.referralLinks = this.kiDetails.map((ki:any)=>{
          const tag: string = this.getKiTypeIcon(ki?.kiData);
          const url: string = ki?.kiData.url;
          return{tag,url};
        });
        // console.log(" this.referrelLinks ", this.referralLinks );
      },
      error: (e)=>{
        console.log("Error",e);
      },
      complete: ()=>{
        console.log('Complete');
      }
    })
  }

  onItemizedSummaryClick(event:any){
    this.router.navigateByUrl('/home/itemized-summary');
  }

  onHighlightsClick(event:any){
    this.router.navigateByUrl('/home/highlight');
  }

  getKiTypeIcon(ki_data: any) {
    switch (ki_data.tags) {
      case 'books':
        return `../../../../assets/svg/tags-icon/google-books.svg`;
      case 'podcast':
        return `../../../../assets/svg/tags-icon/google-podcast.svg`;
      case 'youtube':
        return `../../../../assets/svg/tags-icon/youtube.svg`;
      case 'tedtalks':
        return `../../../../assets/svg/tags-icon/tedtalks.svg`;
      case 'research':
        return `../../../../assets/svg/tags-icon/research.svg`;
      default:
        return '';
    }
  }

  goToExternalLink(link: string) {
    window.open(link, "_blank");
  }
  backClick(event: any){
    this.router.navigateByUrl('/home');
  }
  consolidatedPowerpointDownload(){
    this.homeService.downloadConsolidatedPowerpoint( this.consolidatedSummary).subscribe({
      next:(res)=>{
        let blob:any = new Blob([res],{type: 'text/json; charset=utf-8'});
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, `consolidated_summary_${new Date().toISOString()}.pptx`);
        console.log("PPT download complete");
      },
      error:(e)=>
        console.error("Error:",e),
      complete: ()=>{
        console.log("Complete");
      }
    });
  }
  consolidatedDocDownload(){
    this.homeService.downloadConsolidatedDoc(this.consolidatedSummary).subscribe({
      next: (res: any) => {
        let blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, `consolidated_summary_${new Date().toISOString()}.docx`);
        console.log("Doc download complete");
      },
      error: (e) => console.error("Error : ", e),
      complete: () => {
        console.info('Complete');
      }
    });
  }
  
  consolidatedExcelDownload(){
    // console.log("this.consolidatedSummary",this.consolidatedSummary);
    const data = [{
      "title": this.consolidatedSummary.titleOptions[0],
      "gen_date": this.consolidatedSummary.generatedDate,
      "num_min_read": 5,
      "summary": this.consolidatedSummary.paragraphs[0]      ,
      "ref_links": this.referralLinks.map((e) => e.url).join(",")
    }];
    
    this.homeService.downloadConsolidatedExcel(data).subscribe({
      next: (res: any) => {
        let blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, `consolidated_summary_${new Date().toISOString()}.xlsx`);
        console.log("Excel download complete");
      },
      error: (e) => console.error("Error : ", e),
      complete: () => {
        console.info('Complete');
      }
    });
  }


}

