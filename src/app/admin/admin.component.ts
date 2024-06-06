import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStorageService } from './../core/local-storage.service';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { AdminServices } from './admin.service';
import { UserDetailsComponent } from './user-details/user-details.component';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {
  addUserEnable: boolean = true;
  addUserButtonVisible: boolean = true;
  searchValue: string = "";
  selectedTab: number = 0;
  userTable = new MatTableDataSource();
  isLoading = false;
  users: any = [];
  kis: any = [];
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  pageIndex = 0;
  pageSize = 5;
  totalPageSize = 0;
  displayedUserColumns: string[] = ['name', 'email', 'details', 'action', 'status'];

  @ViewChild('paginatorUser') paginatorUser!: MatPaginator;
  @ViewChild('sortUser') sortUser: MatSort = new MatSort();

  constructor(
    private dialog: MatDialog,
    private adminService: AdminServices,
    private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit() {
    this.getAllUsers();
    this.localStorageService.observeUserInfo();
  }
  ngAfterViewInit(): void {
    this.userTable.paginator = this.paginatorUser;
    this.userTable.sort = this.sortUser;
  }
  onFilterClick() { }

  onAddEditUserClick(user: any = "") {
    const dialogRef = this.dialog.open(AddEditUserComponent, { panelClass: 'mat-dialog-panel', data: { user: user } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUsers();
      }
      console.log("closed");
    });

  }

  tabChange(event: any) {
    this.selectedTab = event.index;
    console.log("SelectedTab:", this.selectedTab);
  }

  searchUser(event: any) {
    console.log("searchUser:", event);
    this.searchValue = event.trim().toLowerCase();
    if (this.selectedTab === 0) {
      this.userTable.filter = this.searchValue;
    }
  }

  clearSearchUser() {
    this.searchValue = "";
    if (this.selectedTab === 0) {
      this.userTable.filter = this.searchValue;
    }
  }

  toggleStatus(event: any) {
    this.adminService.toggleUserStatus(event).subscribe({
      next: (res: any) => {
        this.users = this.users.map((user: any) => {
          if (user._id === event) {
            return { ...user, isActive: !user?.isActive };
          }
          return user;
        });
        this.userTable = new MatTableDataSource(this.users);
        this.userTable.paginator = this.paginatorUser;
        this.userTable.sort = this.sortUser;
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        console.log("Complete!");
      }
    })
  }

  getAllUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.data;
        console.log("Users:", this.users);
        this.userTable = new MatTableDataSource(this.users);
        this.totalPageSize = this.users.length;
        this.userTable.paginator = this.paginatorUser;
        this.userTable.sort = this.sortUser;
      },
      error: (e: any) => {
        console.log("Error:", e);
      },
      complete: () => {
        console.info("Complete!!");
      }
    })
  }

  onViewUserDetails(user: any) {
    this.dialog.open(UserDetailsComponent, { panelClass: 'mat-dialog-panel', data: { user: user } });
  }

}
