import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-outer-toolbar-buttons',
  templateUrl: './outer-toolbar-buttons.component.html',
  styleUrls: ['./outer-toolbar-buttons.component.scss']
})
export class OuterToolbarButtonsComponent {
  @Input() public filterButtonVisible: boolean = false;
  @Input() public addKnowledgeItemButtonVisible: boolean = false;
  @Input() public newsButtonVisible: boolean = false;
  @Input() public groupMemberButtonVisible: boolean = false;
  @Input() public noteButtonVisible: boolean = false;
  @Input() public moreButtonVisible: boolean = false;
  @Input() public backToParentButtonVisible: boolean = false;
  @Input() public createFolderButtonVisible: boolean = false;
  @Input() public refreshButtonVisible: boolean = false;
  @Input() public uploadFileButtonVisible: boolean = false;
  @Input() public configurationButtonVisible: boolean = false;
  @Input() public historyButtonVisible: boolean = false;
  @Input() public addUserButtonVisible: boolean = false;
  @Input() public addUserEnable: boolean = false;
  @Input() public workspaceButtonVisible: boolean = false;
  @Input() public reportProgressButtonVisible: boolean = false;
  @Input() public failedReportsButtonVisible: boolean = false;

  @Output() onFilter = new EventEmitter();
  @Output() onConfigure = new EventEmitter();
  @Output() onCreateFolder = new EventEmitter();
  @Output() onFileUpload = new EventEmitter();
  @Output() onAddUser = new EventEmitter();
  @Output() onBackClick = new EventEmitter();
  @Output() onRefreshClick = new EventEmitter();
  @Output() onReportProgress = new EventEmitter();
  @Output() onReportFailed = new EventEmitter();

  constructor(
    public commonService: CommonService,
    public dialog: MatDialog) { }
  ngOnInit() {
    console.log("addUserEnable", this.addUserEnable);
  }

  toggleNews() {
    this.commonService.newsOpen = true;
  }

  onFilterClick() {
    this.onFilter.emit();
  }

  onConfigureClick() {
    this.onConfigure.emit();
  }

  onCreateFolderClick() {
    this.onCreateFolder.emit();
  }

  onFileUploadClick() {
    this.onFileUpload.emit();
  }

  onAddUserClick() {
    this.onAddUser.emit();
  }

  toggleReportProgress() {
    this.onReportProgress.emit();
  }
  onBack() {
    this.onBackClick.emit();
  }
  onRefresh() {
    this.onRefreshClick.emit();
  }

  toggleReportFailed() {
    this.onReportFailed.emit();
  }

}
