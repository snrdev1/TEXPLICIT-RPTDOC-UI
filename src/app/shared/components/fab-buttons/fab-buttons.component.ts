import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-fab-buttons',
  templateUrl: './fab-buttons.component.html',
  styleUrls: ['./fab-buttons.component.scss']
})
export class FabButtonsComponent {
  @Input() public summaryButtonVisible:boolean=true;
  @Input() public itemizedSummaryButtonVisible:boolean=true;
  @Input() public consolidatedSummaryButtonVisible:boolean=true;
  @Input() public highlightsButtonVisible:boolean=true;

  @Output() onItemizedSummary=new EventEmitter<any>()
  @Output() onConsolidatedSummary=new EventEmitter<any>()
  @Output() onHighlights=new EventEmitter<any>()

  constructor(public commonService:CommonService){}
  chatOpen(){
    this.commonService.chatOpen=true;
  }

  onItemizedSummaryClick(event:any){
    this.onItemizedSummary.emit(event);
  }

  onConsolidatedSummaryClick(event:any){
    this.onConsolidatedSummary.emit(event);
  }

  onHighlightsClick(event:any){
    this.onHighlights.emit(event);
  }
}
