import { LocalStorageService } from 'src/app/core/local-storage.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  userInfo: any;
  profileInfo: any = [];

  constructor(private localStorageService: LocalStorageService){}

  ngOnInit(){
    this.userInfo = this.localStorageService.getUserInfo();

    console.log("userInfo : ", this.userInfo);

    this.constructProfileInfo();
  }

  constructProfileInfo(){
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
        "fieldValue": this.userInfo?.createdOn || ""
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
