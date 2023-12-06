import { Component, ViewChild , Input} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginDialogComponent } from 'src/app/shared/components/modal-dialog/login-dialog/login-dialog.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { HomeService } from 'src/app/shared/services/home.service';
@Component({
  selector: 'app-anonymous',
  templateUrl: './anonymous.component.html',
  styleUrls: ['./anonymous.component.scss']
})
export class AnonymousComponent {
  public domains:any=[];
  newsData: any;
  selectedTab: number = 1;
  kiOffset: number = 0;
  kiLimit: number = 15;
  public dom: any=[];
  domKis: any= [];

  @Input() tags: any = [];
  @Input() searchQuery: string = "";

  constructor(
    private router:Router,
    public commonService: CommonService,
    private sharedService:SharedService,
    private homeService: HomeService,
    private dialog:MatDialog){}
  
  ngOnInit(){
    // Redirect user to home if user is not logged in
    // if (this.authService.isLoggedIn())
    //   this.sharedService.redirectToHome();
    
  }
  
  
  onScroll(event:any){
    console.log('offsetHeight: ',event.target.offsetHeight)
    console.log('scrollHeight: ',event.target.scrollHeight);
    console.log('scrollTop: ',Math.round(event.target.scrollTop));
    console.log('difference: ',(event.target.scrollHeight - event.target.offsetHeight - 1));
    if(Math.round(event.target.scrollTop)>=(event.target.scrollHeight - event.target.offsetHeight - 1)){
      this.kiOffset = this.kiOffset + this.kiLimit;
      
    }
  }

  onRegistrationClick(){
    this.router.navigateByUrl('/registration');
  }

  onLoginClick(){
    const dialogRef = this.dialog.open(LoginDialogComponent,{panelClass:'mat-dialog-panel'});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  newsOpen(){
    this.commonService.newsOpen=true;
  }
  onTabChanged(event:any){
    // console.log('onTabChanged',event.index); 
  }
}

