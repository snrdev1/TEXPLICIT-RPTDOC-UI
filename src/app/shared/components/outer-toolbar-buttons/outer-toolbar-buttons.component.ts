import { Component,EventEmitter,Input,Output } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { MatDialog } from '@angular/material/dialog';
// import { KiAddDialogComponent } from '../knowledgeitem/ki-add-dialog/ki-add-dialog.component';

@Component({
  selector: 'app-outer-toolbar-buttons',
  templateUrl: './outer-toolbar-buttons.component.html',
  styleUrls: ['./outer-toolbar-buttons.component.scss']
})
export class OuterToolbarButtonsComponent {
  @Input() public filterButtonVisible:boolean=true;
  @Input() public addKnowledgeItemButtonVisible:boolean=true;
  @Input() public newsButtonVisible:boolean=true;
  @Input() public groupMemberButtonVisible:boolean=true;
  @Input() public noteButtonVisible:boolean=true;

  @Input() public moreButtonVisible:boolean=true;
  @Input() public backToParentButtonVisible:boolean=true;
  @Input() public createFolderButtonVisible:boolean=true;
  @Input() public refreshButtonVisible:boolean=true;
  @Input() public uploadFileButtonVisible:boolean=true;

  @Input() public configurationButtonVisible:boolean=true;
  @Input() public historyButtonVisible:boolean=true;
  
  @Input() public addUserButtonVisible:boolean=true;
  @Input() public addUserEnable:boolean=false;
  @Input() public workspaceButtonVisible:boolean=true;
  @Input() public reportProgressButtonVisible:boolean=true;

  @Output() onFilter = new EventEmitter();
  @Output() onConfigure = new EventEmitter();
  @Output() onCreateFolder = new EventEmitter();
  @Output() onFileUpload = new EventEmitter();
  @Output() onAddUser = new EventEmitter();
  @Output() onBackClick = new EventEmitter();
  @Output() onRefreshClick = new EventEmitter();
  @Output() onReportProgress = new EventEmitter();
  
  constructor(
    public commonService:CommonService,
    public dialog:MatDialog)
    {}
    
  toggleNews(){
    this.commonService.newsOpen=true;
  }

  toggleGroupAndMember(){
    this.commonService.groupAndMemberOpen=true;
  }

  toggleNote(){
    this.commonService.noteOpen=true;
  }

  onFilterClick(){
    this.onFilter.emit();
  }

  // onAddKnowledgeItemClick(){
  //   console.log('onAddKnowledgeItemClick Clicked !!!');
  //   const dialogRef = this.dialog.open(KiAddDialogComponent,{panelClass:'mat-ki-add-dialog',data:{"test":"Test 123 ..."}});
  
  //     dialogRef.afterClosed().subscribe(result => {
  //       console.log(`Dialog result: ${result}`);
  //     });
  // }

  onConfigureClick(){
    this.onConfigure.emit();
  }

  onCreateFolderClick()
  {
    this.onCreateFolder.emit();
  }

  onFileUploadClick()
  {
    this.onFileUpload.emit();
  }

  onAddUserClick(){
    this.onAddUser.emit();
  }

  toggleWorkspace(){
    this.commonService.workspaceOpen=true;
  }

  toggleReportProgress(){
    this.onReportProgress.emit();
  }
  onBack(){
    this.onBackClick.emit();
  }
  onRefresh(){
    this.onRefreshClick.emit();
  }
  
}
