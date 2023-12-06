import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { HomeService } from 'src/app/shared/services/home.service';
import { WebSocketService } from 'src/app/shared/services/socketio.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-knowledgeitem-highlight',
  templateUrl: './knowledgeitem-highlight.component.html',
  styleUrls: ['./knowledgeitem-highlight.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KnowledgeitemHighlightComponent {
  items:any=Array(5);
  kiDetails: any[]=[];
  ki_ids: string[]=[];
  highlightsData:any=[];
  constructor(private router:Router,
              public localStorageService: LocalStorageService,
              private homeService: HomeService,
              private websocketService: WebSocketService){}

  ngOnInit(){
    this.kiDetails = this.localStorageService.getitem("kiForSummary");
    this.ki_ids = this.kiDetails.map((ki:any)=>ki.kiId);
    // console.log("kiids in highlights", this.ki_ids);
    this.getHighlightsData();
  }

  getHighlightsData(){
    this.homeService.getHighlights(this.ki_ids).subscribe({
      next: (res)=>{
        console.log("highlights",res);
      },
      error: (e)=>{
        console.log("error",e);
      },
      complete: ()=>{
        console.log("fetched highlights data");
      }
    })
    this.websocketService.listen('server_emit_highlight').subscribe({
      next: (res)=>{
        // console.log("Response highlights",res);
        this.highlightsData.push({
          "kiDetails": this.localStorageService.getitem("kiForSummary").filter((ki:any)=>ki.kiId===res?.data.kiId),
          "highlights": res?.data.highlights
        })
        // console.log("Highlights Data", this.highlightsData);
      },
      error: (e)=>{
        console.log("Error: ",e);
      },
      complete: ()=>{
        console.log("Complete");
      }
    })
  }

  onItemizedSummaryClick(event:any){
    this.router.navigateByUrl('/home/itemized-summary');
  }

  onConsolidatedSummaryClick(event:any){
    this.router.navigateByUrl('/home/consolidated-summary');
  }

  backClick(event: any){
    this.router.navigateByUrl('/home');
  }

  setThumbnail(thumbnail:any, domain:any){
    if(thumbnail){
      return  thumbnail;
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

  goToKiDetailsPage(kiId: string){
    this.router.navigate([`/knowledgeitem/${kiId}`])
  }
  getFormattedSentence(sentence: string, keyPhrases: string) {
    const ignoreCaseRegex = new RegExp(keyPhrases, 'i');
    return sentence.replace(ignoreCaseRegex,
      `<span>&nbsp;${keyPhrases}&nbsp;</span>`
    );
  }
  highlightsPowerpointDownload(){
    // console.log("this.highlightsData",this.highlightsData);
    const data = this.highlightsData.map((e:any, index:number)=>{
      const ki = e?.kiDetails[0].kiData;
      return {
        "seq_number": index,
        "title": ki?.title,
        "highlights": e?.highlights,
        "link": ki?.url,
        "image": ki?.thumbnail
      };
    });
    this.homeService.downloadHighlightsPowerpoint(data).subscribe({
      next: (res: any) => {
        let blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, `highlights_summary_${new Date().toISOString()}.pptx`);
        console.log("PPT download complete");
      },
      error: (e) => console.error("Error : ", e),
      complete: () => {
        console.info('Complete');
      }
    })
  }

  highlightsExcelDownload(){
    // console.log("this.highlightsData",this.highlightsData);
    const data = this.highlightsData.map((e:any, index:number)=>{
      const ki = e?.kiDetails[0].kiData;
      return {
        "seq_number": index,
        "title": ki?.title,
        "highlights": e?.highlights,
        "link": ki?.url
      };
    });
    this.homeService.downloadHighlightsExcel(data).subscribe({
      next: (res: any) => {
        let blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, `highlights_summary_${new Date().toISOString()}.xlsx`);
        console.log("Excel download complete");
      },
      error: (e) => console.error("Error : ", e),
      complete: () => {
        console.info('Complete');
      }
    });
  }
  highlightsDocDownload(){
    const data = this.highlightsData.map((e:any, index:number)=>{
      const ki = e?.kiDetails[0].kiData;
      return {
        "seq_number": index,
        "title": ki?.title,
        "highlights": e?.highlights,
        "image": ki?.thumbnail
      };
    });
    this.homeService.downloadHighlightsDoc(data).subscribe({
      next: (res: any) => {
        let blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, `highlights_summary_${new Date().toISOString()}.docx`);
        console.log("DocS download complete");
      },
      error: (e) => console.error("Error : ", e),
      complete: () => {
        console.info('Complete');
      }
    })
  }
  
  
  
}
