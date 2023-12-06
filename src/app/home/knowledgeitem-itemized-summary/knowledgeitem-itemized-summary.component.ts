import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { HomeService } from 'src/app/shared/services/home.service';
import { WebSocketService } from 'src/app/shared/services/socketio.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-knowledgeitem-itemized-summary',
  templateUrl: './knowledgeitem-itemized-summary.component.html',
  styleUrls: ['./knowledgeitem-itemized-summary.component.scss']
})
export class KnowledgeitemItemizedSummaryComponent {
  items:any=Array(5);
  kiDetails: any[] = [];
  ki_ids: string[] = [];
  summaryData: any = [];
  constructor(private router:Router,
              public localStorageService: LocalStorageService,
              private homeService: HomeService,
              private webSocketService: WebSocketService){}
  
  ngOnInit(){
    this.kiDetails = this.localStorageService.getitem("kiForSummary");
    this.ki_ids = this.kiDetails.map((ki:any) => ki.kiId);
    this.getItemizedSummary();
  }

  getItemizedSummary(){
    this.homeService.getItemizedSummary(this.ki_ids).subscribe({
      next: (res)=>{
        console.log("fetching summary");
      },
      error: (e)=>{
        console.log("Error",e);
      },
      complete: ()=>{
        console.log("Itemized summary done");
      }
    }
    )
    this.webSocketService.listen('server_emit_summary').subscribe({
      next: (res: any) => {
        this.summaryData.push({
          "kiDetails": this.localStorageService.getitem("kiForSummary").filter((ki:any)=> ki.kiId === res?.data?.kiId),
          "summary": res?.data,
        });
        // console.log("SUMMARY DATA", this.summaryData);
      },
      error: (e) => console.log("Error : ", e)
    });
  }

  onConsolidatedSummaryClick(event:any){
    this.router.navigateByUrl('/home/consolidated-summary');
  }

  onHighlightsClick(event:any){
    this.router.navigateByUrl('/home/highlight');
  }

  setThumbnail(thumbnail:any, domain:any){
    if(thumbnail){
      return thumbnail;
    }
    else{
    switch (domain.toLowerCase()) {
      case 'marketing' : return `assets/images/default_ki_images/marketing.png`;
      case 'retail' : return `assets/images/default_ki_images/retail.png`;
      case 'clinical trials' : return `assets/images/default_ki_images/clinical_trial.png`;
      case 'composite materials for auto parts' : return `assets/images/default_ki_images/composite_materials_for_auto_part.png`;
      case 'digital marketing' : return `assets/images/default_ki_images/digital_marketing.png`;
      case 'furnace and heat treatment' : return `assets/images/default_ki_images/furnace_and_heat_treatment.png`;
      case 'electronics' : return `assets/images/default_ki_images/electronics.jpg`;
      case 'hospitality' : return `assets/images/default_ki_images/hospitality.jpg`;
      case 'iron and steel' : return `assets/images/default_ki_images/iron_and_steel.jpg`
      case 'alternative energy' : return `assets/images/default_ki_images/alternative_energy.jpg`
      default : return '';
    }
    }
  }

  getKiTypeIcon(ki_data: any) {
    switch (ki_data.kiDetails[0].kiData.tags) {
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

  goToKiDetailPage(kiId:string){
    this.router.navigate([`/knowledgeitem/${kiId}`])
  }

  backClick(event: any){
    this.router.navigateByUrl('/home');
  }

  itemizedPowerpointDownload(){
    const data = this.summaryData.map((e:any, index:number)=>{
      const ki = e?.kiDetails[0].kiData;
      return {
        "seq_number": index,
        "title": ki?.title,
        "tag": ki?.tags,
        "link": ki?.url,
        "pub_date": ki?.publishedDate,
        "num_min_read": 5,
        "summary": e?.summary.summary,
        "image": ki?.thumbnail
      };
    });
    this.homeService.downloadItemizedPowerpoint(data).subscribe({
      next: (res: any) => {
        let blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, `itemized_summary_${new Date().toISOString()}.pptx`);
        console.log("PPT download complete");
      },
      error: (e) => console.error("Error : ", e),
      complete: () => {
        console.info('Complete');
      }
    });
  }

  itemizedExcelDownload(){
    // console.log("this.summaryData",this.summaryData);
    const data = this.summaryData.map((e:any, index:number)=>{
      const ki = e?.kiDetails[0].kiData;
      // console.log("this.summaryData",ki);
      return {
        "seq_number": index,
        "title": ki?.title,
        "tag": ki?.tags,
        "link": ki?.url,
        "pub_date": ki?.publishedDate,
        "num_min_read": 5,
        "summary": e?.summary.summary
      };
    });
    
    this.homeService.downloadItemizedExcel(data).subscribe({
      next: (res: any) => {
        let blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, `itemized_summary_${new Date().toISOString()}.xlsx`);
        console.log("Excel download complete");
      },
      error: (e) => console.error("Error : ", e),
      complete: () => {
        console.info('Complete');
      }
    })
  }

  itemizedDocDownload(){
    const data = this.summaryData.map((e:any, index:number)=>{
      const ki = e?.kiDetails[0].kiData;
      return {
        "seq_number": index,
        "title": ki?.title,
        "tag": ki?.tags,
        "link": ki?.url,
        "pub_date": ki?.publishedDate,
        "num_min_read": 5,
        "summary": e?.summary.summary,
        "image": ki?.thumbnail
      };
    });
    this.homeService.downloadItemizedDoc(data).subscribe({
      next: (res: any) => {
        let blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, `itemized_summary_${new Date().toISOString()}.docx`);
        console.log("Doc download complete");
      },
      error: (e) => console.error("Error : ", e),
      complete: () => {
        console.info('Complete');
      }
    })
  }
}

















