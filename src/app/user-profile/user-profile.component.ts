import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
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
  invoices: any = [];
  displayedColumns: string[] = ['date', 'amount'];

  constructor(
    private localStorageService: LocalStorageService,
    private datePipe: DatePipe,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.userInfo = this.localStorageService.getUserInfo();

    console.log("userInfo : ", this.userInfo);

    this.constructProfileInfo();
    this.getUserPaymentHistory();
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
      },
      {
        "fieldName": "Remaining Balance",
        "fieldValue": this.userInfo?.balance || 0 + " /-"
      }
    ];
  }

  getUserPaymentHistory() {
    this.paymentService.getUserPaymentHistory().subscribe({
      next: (res: any) => {
        this.invoices = res?.data;
      },
      error: (e: any) => {
        console.log("Error : ", e);
      },
      complete: () => {
        console.log("complete");
      }
    });
  }
}
