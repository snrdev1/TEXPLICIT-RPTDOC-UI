import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStorageService } from '../core/local-storage.service';
import { ConfirmDialogComponent } from '../shared/components/modal-dialog/confirm-dialog/confirm-dialog.component';
import { CommonService } from '../shared/services/common.service';
import { ManageUserService } from './manage-user.service';
import { AddEditUserDialogComponent } from './modal-dialog/add-edit-user-dialog/add-edit-user-dialog.component';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent {
  constructor(private dialog: MatDialog,
              private manageUserService: ManageUserService,
              private commonService: CommonService,
              private localStorage: LocalStorageService){}

  displayedColumns: string[] = ['name', 'email', 'action'];
  isLoading = false;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  pageIndex = 0;
  pageSize = 5;
  totalPageSize = 0;
  usersData: any[]=[];
  dataSource = new MatTableDataSource();
  currentUser: any;
  subscriptions: number = 0;
  addUserEnable: boolean = true;
  filterValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit(){
    // this.dataSource=new MatTableDataSource<any>(this.usersData);
    this.currentUser = this.localStorage.getitem("userInfo");
    // console.log("this.currentUser",this.currentUser);
    this.subscriptions = this.currentUser.subscription;
    if(this.subscriptions > 1){
      this.addUserEnable = true;
    }
    console.log("addUserEnable in manage user component:",this.addUserEnable);

    // console.log("this.subscriptions",this.subscriptions);

    this.getAllChildUsers();
  }

  onAddUserClick(){
    const dialogRef = this.dialog.open(AddEditUserDialogComponent,{panelClass:'mat-dialog-panel'});

    dialogRef.afterClosed().subscribe(data => {
      // console.log(`Dialog result in onAddUserClick : `,data);
      if(data){
        this.manageUserService.addNewUser(data).subscribe({
          next: (res)=>{
            // console.log("res of onAddUserClick",res);
            this.commonService.showSnackbar("snackbar-success",res.message,"0");
            this.getAllChildUsers();
          },
          error: (e)=>{
            console.log("Error: ",e);
            this.commonService.showSnackbar("snackbar-error",e.error.message, e.status);
          },
          complete: ()=>{
            console.log("Complete");
          }
        })
      }else{
        this.getAllChildUsers();
      }
      
    });
  }

  getAllChildUsers(){
    // console.log("Page Index:",this.pageIndex);
    // console.log("Page Size:",this.pageSize);
    this.manageUserService.getAllChildUsers(this.pageIndex+1,this.pageSize).subscribe({
      next: (res)=>{
        console.log("getAllChildUsers: ",res);
        // if(res.data.length == 0 && this.subscriptions > 1){
        //   this.addUserEnable = true;
        // }
        if(res.data){
          this.usersData = res.data.users;
          // console.log(" this.usersData", this.usersData);
          this.dataSource = new MatTableDataSource<any>(this.usersData);
          // console.log("this.dataSource",this.dataSource);
          this.totalPageSize = res.data.totalRecs;
            // console.log("this.usersData.length ",this.usersData.length );
          // this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          
          if((res.data.totalRecs || 0)< this.subscriptions){
              this.addUserEnable = true;
          }else{
              this.addUserEnable = false;
              // this.commonService.showSnackbar("snackbar-error","Subscription limit reached","0");
          }
          
        }
      },
      error: (e)=>{
        console.log("Error: ",e);
      },
      complete: ()=>{
        console.log("Complete");
      }
    })
  }

  getNextData(event: PageEvent){
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAllChildUsers();
  }

  viewUser(event:any){}
  editUser(userDetails:any){
    console.log("EditUser Event: ",userDetails);
    let userId = userDetails._id["$oid"];
    const dialogRef = this.dialog.open(AddEditUserDialogComponent,{panelClass:'mat-dialog-panel', data:userId});

    dialogRef.afterClosed().subscribe(data => {
      // console.log(`Dialog result in editUser: `,data);
      if(data){
        this.manageUserService.editUserData(data, userId ).subscribe({
          next: (res)=>{
            // console.log("res of onEditUserClick",res);
            this.commonService.showSnackbar("snackbar-success",res.message,"0");
            this.getAllChildUsers();
          },
          error: (e)=>{
            console.log("Error: ",e);
            this.commonService.showSnackbar("snackbar-error",e.error.message, e.status);
          },
          complete: ()=>{
            console.log("Complete");
          }
        })
      }else{
        this.getAllChildUsers();
      }
      
    });
  }

  deleteUser(event:any){
    console.log("deleteUser event", event);
    let id = event?._id["$oid"];
    console.log("delete user with id: ",id); 
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{panelClass:'mat-dialog-panel',data:{"modalTitle":"Delete User","modalMessage":"Are you sure you want to delete this user?"}});

    dialogRef.afterClosed().subscribe((result:any) => {
     if(result){
      this.manageUserService.deleteUserData(id).subscribe({
        next: (res)=>{
          console.log("res",res);
          this.commonService.showSnackbar("snackbar-success", res.message, "0");
          // this.pageIndex = 0;
          this.getAllChildUsers();
        },
        error: (e)=>{
          console.log("Error: ",e);
          this.commonService.showSnackbar("snackbar-error", e.error.message, e.status);
        },
        complete: ()=>{
          console.log("Complete");
        }
      })
    }
   })
  }

  onFilterClick(){}
  resendEmail(event: any){}

  
  searchUser(filterValue: any){
    console.log("searchUser:",filterValue);
    this.filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.filterValue;
  }
  
  clearSearchUser(){
    console.log("clearSearchUser called");
    this.getAllChildUsers();
  }
}
