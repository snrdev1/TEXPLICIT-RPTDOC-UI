import { Component,Input,Output,EventEmitter } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent {
  @Input() public placeHolder:string='Search ...' 
  @Output() onSearch = new EventEmitter<string>();
  @Output() onClear = new EventEmitter();
  @Output() onCharSearch = new EventEmitter<string>();
  @Input() searchValue="";
  clearVisible:boolean=false;
  @Input() selectedDatasource:string="";

  constructor(private commonService: CommonService){}
  ngOnInit(){
    
  }
  onSearchKeyup(event:any){
    console.log("key=",event.key);
    this.clearVisible=(event.target.value.length>0);
    console.log("Value:",event.target.value);

    if (event.key ==='Enter'){
      this.onSearch.emit(event.target.value);
    }
    else if (event.target.value.trim().length>0 && event.key!='Enter'){
      this.onCharSearch.emit(event.target.value);
    }
    else if (event.target.value.trim().length==0 && (event.key=='Enter'|| event.key=='Backspace')){
      this.onClear.emit();
      this.onCharSearch.emit(event.target.value);
    }
  }

  onClearClick(targetElement:any){
    targetElement.value='';
    this.clearVisible=(targetElement.value.length>0);
    this.onClear.emit();
  }
  
}
