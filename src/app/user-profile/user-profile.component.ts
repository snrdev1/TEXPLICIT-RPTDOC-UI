import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { LocalStorageService } from 'src/app/core/local-storage.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  userInfo: any;
  profileInfo: any = [];

  constructor(
    private localStorageService: LocalStorageService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.userInfo = this.localStorageService.getUserInfo();

    console.log("userInfo : ", this.userInfo);

    this.constructProfileInfo();
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
        "fieldName": "Invoices",
        "fieldValue": this.userInfo?.invoices || ""
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
}
