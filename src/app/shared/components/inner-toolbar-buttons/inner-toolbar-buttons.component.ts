import { Component,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-inner-toolbar-buttons',
  templateUrl: './inner-toolbar-buttons.component.html',
  styleUrls: ['./inner-toolbar-buttons.component.scss']
})
export class InnerToolbarButtonsComponent {
  @Input() public sizeDropdownVisible:boolean=false;
  @Output() onback = new EventEmitter<any>()
  @Output() powerpointtDownload = new EventEmitter<any>()
  @Output() exceltDownload = new EventEmitter<any>()
  @Output() docDownload = new EventEmitter<any>()

  Onback(event:any){
    this.onback.emit(event);
  }
  PptDownload(event:any){
    this.powerpointtDownload.emit(event);
  }
  ExcelDownload(event:any){
    this.exceltDownload.emit(event);
  }
  DocDownload(event:any){
    this.docDownload.emit(event);
  }
}
