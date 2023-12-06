import { Component, OnInit, ViewChild,AfterViewInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator,PageEvent} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStorageService } from './../core/local-storage.service';
import { AdminServices } from './admin.service';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { ApproveKiComponent } from './approve-ki/approve-ki.component';
// import { CreateEditUserComponent } from '../shared/create-edit-user/create-edit-user.component';
// import { ApproveKIComponent } from './approve-ki/approve-ki.component';
// import { UserApprovalComponent } from './user-approval/user-approval.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit,AfterViewInit{
  addUserEnable:boolean = true;
  searchValue:string = "";
  selectedTab:number = 0;
  usertable = new MatTableDataSource();
  kitable = new MatTableDataSource();
  isLoading = false;
  users:any = [];
  kis:any = [];
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  pageIndex = 0;
  pageSize = 5;
  totalPageSize = 0;
  displayedUserColumns: string[] = ['name', 'email', 'mobile','type','action','status'];
  displayedKiColumns:string[] = ['title','author','postedOn','action'];

  @ViewChild('paginatorUser') paginatorUser!: MatPaginator;
  @ViewChild('sortUser') sortUser: MatSort = new MatSort();
  @ViewChild('sortKI') sortKI: MatSort = new MatSort();
  @ViewChild('paginatorKi') paginatorKi!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private adminService: AdminServices,
    private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit() {
    this.getAllUSers();
    this.getAllKis();
    this.localStorageService.observeUserInfo();
  }
  ngAfterViewInit(): void {
    this.usertable.paginator = this.paginatorUser;
    this.usertable.sort = this.sortUser;
    this.kitable.paginator = this.paginatorKi;
    this.kitable.sort = this.sortKI;
  }
  onFilterClick(){}

  onAddEditUserClick(user:any=""){
    const dialogRef = this.dialog.open(AddEditUserComponent,{panelClass:'mat-dialog-panel', data:{user:user}});

    dialogRef.afterClosed().subscribe(result=>{
      if(result){
        this.getAllUSers();
      }
      console.log("closed");
    });

  }
  tabChange(event:any){
    this.selectedTab = event.index;
    console.log("SelectedTab:",this.selectedTab);
  }
  searchUser(event:any){
    console.log("searchUser:",event);
    this.searchValue= event.trim().toLowerCase();
    if(this.selectedTab === 0){
      this.usertable.filter = this.searchValue;
    }
    else if(this.selectedTab === 1){
      this.kitable.filter = this.searchValue;
    }
  }
  clearSearchUser(){
    this.searchValue = "";
    if(this.selectedTab === 0){
      this.usertable.filter = this.searchValue;
    }
    else if(this.selectedTab === 1){
      this.kitable.filter = this.searchValue;
    }
  }
  
  toggleStatus(event:any){
    this.adminService.toggleUserStatus(event).subscribe({
      next:(res:any)=>{
        this.users = this.users.map((user: any) => {
          if (user._id === event) {
            return { ...user, isActive: !user?.isActive };
          }
          return user;
        });
        this.usertable = new MatTableDataSource(this.users);
        this.usertable.paginator = this.paginatorUser;
        this.usertable.sort = this.sortUser;
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        console.log("Complete!");
      }
    })
  }
  
  getAllUSers(){
    this.adminService.getAllUsers().subscribe({
      next: (res:any)=>{
        this.users = res.data;
        console.log("Users:",this.users);
        this.usertable = new MatTableDataSource(this.users);
        this.totalPageSize = this.users.length;
        this.usertable.paginator = this.paginatorUser;
        this.usertable.sort = this.sortUser;
      },
      error:(e:any)=>{
        console.log("Error:",e);
      },
      complete: ()=>{
        console.info("Complete!!");
      }
    })
  }
  getAllKis(){
    this.adminService.getPendingKIs().subscribe({
      next:(res:any)=>{
        console.log("PendingKis:",res.data);
        this.kis = res.data;
        this.kitable = new MatTableDataSource(this.kis);
        this.kitable.sort = this.sortKI;
        this.kitable.paginator = this.paginatorKi;
      },
      error:(e:any)=>{
        console.log("Error:",e);
      },
      complete:()=>{
        console.info("Complete!!");
      }
    })
  }
  editKi(KiId:string){
    const dialogRef = this.dialog.open(ApproveKiComponent,{panelClass:'mat-news-detail-dialog',
      data : KiId
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log("Approve KI dialog closed!");
      if (result == true) {
        this.getAllKis();
      }
    });
  }
}