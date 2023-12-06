import { Component,EventEmitter,Input,Output } from '@angular/core';
import { LocalStorageService } from 'src/app/core/local-storage.service';

@Component({
  selector: 'app-file-folder-card',
  templateUrl: './file-folder-card.component.html',
  styleUrls: ['./file-folder-card.component.scss']
})
export class FileFolderCardComponent {
  @Input() public checkboxVisible:boolean=true;
  @Input() public bookmarkButtonVisible:boolean=false;
  @Input() public moreButtonVisible:boolean=true;

  @Input() index:string="";
  @Input() item:any="";
  @Input() displayStyle:any="";
  @Input() shared:boolean=false;

  @Output() onCheckChange=new EventEmitter<any>()
  @Output() onDownload=new EventEmitter<any>()
  @Output() onRename=new EventEmitter<any>()
  @Output() onMove=new EventEmitter<any>()
  @Output() onShare=new EventEmitter<any>()
  @Output() onDelete=new EventEmitter<any>()
  @Output() onFolderClick = new EventEmitter<any>()
  @Output() onChecked = new EventEmitter<any>()
  extlist:any = ['pdf','doc','docx','ppt','pptx','xls','xlsx','txt'];
  checkedList: any = [];
  constructor(
    private localstorage:LocalStorageService
  ){}
  ngOnInit(){
    this.checkedList = this.localstorage.getitem("FileIdArray")||[];
  }
  public get ext():string{
    let fileExtension = "";
    if (this.item.originalFileName.lastIndexOf(".") > 0) {
      fileExtension = this.item.originalFileName.substring(this.item.originalFileName.lastIndexOf(".") + 1, this.item.originalFileName.length);
    }
    if(this.extlist.indexOf(fileExtension)<= -1) fileExtension = "unknown";
    return fileExtension;
  }

  onFolderClickEvent(folder:string,type:string,item:any){
    let clickObj = {"name": folder, "type":type,file:item};
    this.onFolderClick.emit(clickObj);
  }
  onChange(event:any){
    this.onCheckChange.emit(event);
  }
  onDownloadClick(item:any){
    this.onDownload.emit(item);
  }
  onRenameClick(item:any){
    this.onRename.emit(item);
  }
  onMoveClick(item:any){
    console.log("ID:",item);
    this.onMove.emit(item);
  }
  onShareClick(id:string){
    console.log("id",id);
    this.onShare.emit(id);
  }
  onDeleteClick(id:string,filetype:string){
    let fileObj = {"id":id,"filetype":filetype};
    this.onDelete.emit(fileObj);
  }
  isChecked(id:string){
    return this.checkedList.includes(id);
  }
  isSummarized(item:any):boolean{
    if(item.itemizedSummary == ""){
      return false;
    }
    else{
      return true;
    }
  }

  SharedwithMeCheck() : boolean {
    // console.log("Shared value : ", this.shared);
    // console.log("Item property : ", this.item)
    if(!this.shared){
      return true;
    }
    else if(this.shared && this.item.type !== 'Folder'){
      return true;
    }
    else{
      return false;
    }
  }
}
