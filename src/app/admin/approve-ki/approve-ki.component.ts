import { Component,OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,MatDialog } from '@angular/material/dialog';
import { CommonService} from 'src/app/shared/services/common.service';
import { AdminServices } from '../admin.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Inject } from '@angular/core';
import { RejectionReasonsComponent } from '../rejection-reasons/rejection-reasons.component';
@Component({
  selector: 'app-approve-ki',
  templateUrl: './approve-ki.component.html',
  styleUrls: ['./approve-ki.component.scss']
})
export class ApproveKiComponent implements OnInit {
  kiDetails : any;
  allDomains : any = [];
  rejectionReasons:any = [];
  constructor(    
    private dialogRef : MatDialogRef<ApproveKiComponent>,
    private dialog : MatDialog,
    private adminService:AdminServices,
    private commonService:CommonService,
    private sharedService:SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any){
  }
  ngOnInit(){
    this.fetchKiById();
  }
  fetchKiById(){
    this.adminService.getPendingKIbyID(this.data).subscribe({
      next : (res : any) => {
        console.log("Response : ", res);
        this.kiDetails = res.data[0];
        // this.getAllDomains();
      },
      error : (err : any) => {
        console.log("Error : ", err);
        let msg = "Error : " + err.message;
        this.commonService.showSnackbar(msg, "OK", "error");
      },
      complete : () => {
        console.log("Complete");
      }
    })
  }
  // getAllDomains(){
  //   var domainId = this.kiDetails.domainId['$oid'];
  //   var allDomainIDs : any = [];
  //   this.sharedService.getAllDomains().subscribe((res : any) => {
  //     // console.log("ALL domains : ", res);
  //     allDomainIDs.push(...res.data);
  //     console.log(allDomainIDs);
  //     for(let i = 0; i < allDomainIDs.length; i++){
  //       var id = allDomainIDs[i]._id ;
  //       if(domainId == id){
  //         // console.log(`Domain ID ${id} exists in ${domainIds}` );
  //         this.allDomains = {
  //           "id" : allDomainIDs[i]._id,
  //           "title" : allDomainIDs[i].topic
  //         };
  //       }
  //     }
  //     console.log("ALL DOMAINS : ", this.allDomains);
  //   });
  // }
  getKiTypeIcon() {
    // console.log("Tag : ", this.data.tags);
    switch (this.kiDetails.tags) {
      case 'books':
        return 'icon-book';
      case 'podcast':
        return 'icon-podcast';
      case 'youtube':
        return 'icon-youtube';
      case 'tedtalks':
        return 'icon-ted';
      case 'research':
        return 'icon-research';
      default:
        return '';
    }
  }
  approveKi(){
    const params = {
      "kiId" : this.data,
      "status" : 2
    };
    console.log("Params:",params);
    this.adminService.changeKIStatus(params).subscribe({
      next: (res : any) =>{
        console.log(res);
        this.commonService.showSnackbar("snackbar-success", "Knowledge Item Approved","0");
        this.dialogRef.close(true);
      },
      error:(e:any)=>{
        this.commonService.showSnackbar("snackbar-error","Knowledge Item already approved!",e.status);
      }
    })
  }
  rejectKi(){
    var params = {
      "kiId" : this.data,
      "status" : 3,
      "reasons" : [],
      "reasonComment" : ""
    };

    // Get rejection responses
    this.adminService.getRejectionResponse().subscribe((response) => {
      console.log(response);
      this.rejectionReasons = response.data;
      const dialogReference = this.dialog.open(RejectionReasonsComponent, {panelClass:'mat-dialog-panel',
        data : this.rejectionReasons
      });
      dialogReference.afterClosed().subscribe((result: any) => {
        console.log("Rejection reason selected : ", result);
        params.reasons = result.rejectionReason;
        params.reasonComment = result.reasonComment;

        this.adminService.changeKIStatus(params).subscribe({
          next: (res : any) =>{
            console.log(res);
            this.commonService.showSnackbar("snackbar-success", "Ki Rejected", "0");
            this.dialogRef.close(true);
          }
        });
      });
    })
  }
  onCloseClick(){
    this.dialogRef.close(false);
  }
}
