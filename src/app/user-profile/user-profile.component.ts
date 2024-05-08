import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { PaymentService } from '../shared/services/payment.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  userInfo: any;
  profileInfo: any = [];
  subscriptionInfo: any = [];
  invoices: any = [];

  invoiceDatasource = new MatTableDataSource();
  @ViewChild('paginator') paginator!: MatPaginator;
  displayedColumns: string[] = ['date', 'amount', 'reports', 'documents', 'chats'];

  remainingReports: number = 0;
  remainingChats: number = 0;
  remainingDocuments: number = 0.0;

  isSmallScreen: boolean = false;

  constructor(
    private localStorageService: LocalStorageService,
    private datePipe: DatePipe,
    private paymentService: PaymentService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {

    const layoutChanges = breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Handset
    ]);

    layoutChanges.subscribe(result => {
      if (result.matches) {
        this.isSmallScreen = true;
        this.displayedColumns = ['date', 'amount'];
      } else {
        this.isSmallScreen = false;
        this.displayedColumns = ['date', 'amount', 'reports', 'documents', 'chats'];
      }
    });
  }

  ngOnInit() {
    this.userInfo = this.localStorageService.getUserInfo();
    this.constructProfileInfo();
    this.getUserPaymentHistory();
  }

  ngAfterViewInit(): void {
    this.invoiceDatasource.paginator = this.paginator;
  }

  getFormattedDate(date: any): any {
    try {
      // Parse the string date to a JavaScript Date object
      const parsedDate = new Date(date);

      // Use the DatePipe to format the date
      return this.datePipe.transform(parsedDate, 'dd/MM/yyyy');
    }
    catch (e: any) {
      console.log("Exception : ", e);
      return date;
    }
  }

  constructProfileInfo() {
    this.profileInfo = [
      {
        "fieldName": "Full Name",
        "fieldValue": this.userInfo?.name || ""
      },
      {
        "fieldName": "Email Id",
        "fieldValue": this.userInfo?.email || ""
      },
      {
        "fieldName": "Profile Created",
        "fieldValue": this.getFormattedDate(this.userInfo?.createdOn) || ""
      },
      {
        "fieldName": "Mobile Number",
        "fieldValue": this.userInfo?.mobileNumber || ""
      },
      {
        "fieldName": "Company Name",
        "fieldValue": this.userInfo?.companyName || ""
      }
    ];

    this.remainingReports = (this.userInfo?.permissions?.report?.allowed?.total || 0) - (this.userInfo?.permissions?.report?.used?.total || 0);
    this.remainingChats = (this.userInfo?.permissions?.chat?.allowed?.chat_count || 0) - (this.userInfo?.permissions?.chat?.used?.chat_count || 0);
    this.remainingDocuments = ((this.userInfo?.permissions?.document?.allowed?.document_size || 0) - (this.userInfo?.permissions?.document?.used?.document_size || 0)) / (1024 * 1024);

    this.subscriptionInfo = [
      {
        "fieldName": "Remaining set of reports :",
        "fieldValue": this.remainingReports || "",
        "fieldType": "number"
      },
      {
        "fieldName": "Remaining size of documents (in MB) :",
        "fieldValue": this.remainingDocuments || "",
        "fieldType": "number"
      },
      {
        "fieldName": "Remaining set of chats :",
        "fieldValue": this.remainingChats || "",
        "fieldType": "number"
      },
      {
        "fieldName": "Subscription expires :",
        "fieldValue": this.userInfo?.permissions?.subscription_duration?.end_date || "",
        "fieldType": "date"
      }
    ];
  }

  getUserPaymentHistory() {
    this.paymentService.getUserPaymentHistory().subscribe({
      next: (res: any) => {
        this.invoices = res?.data;

        this.invoiceDatasource = new MatTableDataSource(this.invoices);
        this.invoiceDatasource.paginator = this.paginator;
      },
      error: (e: any) => {
        console.log("Error : ", e);
      },
      complete: () => {
        console.log("complete");
      }
    });
  }

  renewSubscription() {
    this.router.navigate(['/payment']);
  }
}
