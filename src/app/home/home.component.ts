import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonService } from '../shared/services/common.service';
import { ElementQueries, ResizeSensor } from 'css-element-queries'
import { MatFabMenu } from '@angular-material-extensions/fab-menu';
import { MatDialog } from '@angular/material/dialog';
import { HomeFilterDialogComponent } from './modal-dialog/home-filter-dialog/home-filter-dialog.component';
import { ActivatedRoute, Params, Router, ParamMap } from '@angular/router'
import { SharedService } from '../shared/services/shared.service';
import { MatTabGroup } from '@angular/material/tabs';
import { HomeService } from '../shared/services/home.service';
import { LocalStorageService } from '../core/local-storage.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // @ViewChild('kiContainer') resizableElement: ElementRef;

  public fabButtonsRandom: MatFabMenu[] = [];
  public elementSize: string = '';
  public domains: any = [];
  public kis: any = [];
  checkId: any[] = [];
  homeCards: any[] = [
    {
      "title": "Consultancy",
      "description": "As a BPR consultant, you need to be able to talk and write persuasively on a host...",
      "image": "../../assets/images/home-cards/Card_1.png"
    },
    {
      "title": "Marketing",
      "description": "You are preparing a strategy report for the board on how to market your company's latest...",
      "image": "../../assets/images/home-cards/Card_2.png"
    },
    {
      "title": "Corporate Training",
      "description": "You are preparing the training documents for a new line of business for your company...",
      "image": "../../assets/images/home-cards/Card_3.png"
    },
    {
      "title": "Education",
      "description": "You are a professor at a college and you do not want to repeat the same exposition...",
      "image": "../../assets/images/home-cards/Card_4.png"
    },
    {
      "title": "Research",
      "description": "Getting funds for research in non-traditional raw materials is challenging Results...",
      "image": "../../assets/images/home-cards/Card_5.png"
    },
    {
      "title": "Blog Writing",
      "description": "Getting funds for research in non-traditional raw materials is challenging Results...",
      "image": "../../assets/images/home-cards/Card_6.png"
    }
  ];
  @Input() searchQuery: string = "";

  myGroups: any = [];
  constructor(
    private sharedService: SharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService,
    public commonService: CommonService,
    public localStorageService: LocalStorageService,
    public dialog: MatDialog,
  ) {
    // this.resizableElement=new ElementRef(document.querySelector(".home-ki-container"));
  }

  onScroll(event: any) {
    // console.log('offsetHeight: ',event.target.offsetHeight)
    // console.log('scrollHeight: ',event.target.scrollHeight);
    // console.log('scrollTop: ',event.target.scrollTop);
    // console.log("Difference:",(event.target.scrollHeight-event.target.offsetHeight));
    // if (Math.round(event.target.scrollTop)>=(event.target.scrollHeight-event.target.offsetHeight-1)){
    //  this.kiOffset = this.kiOffset + this.kiLimit;
    //  this.getKisByDomain();
    // }
  }

  // ngAfterViewInit() {
  // ElementQueries.listen();
  // ElementQueries.init();

  //   const resizeSensor = new ResizeSensor(this.resizableElement.nativeElement, () => {
  //     this.elementSize = 'Width: ' + this.resizableElement.nativeElement.clientWidth +
  //     ' Height: ' + this.resizableElement.nativeElement.clientHeight;

  //     console.log(this.elementSize);
  //   });
  // }

  executeSearch(event: any) {
    console.log("event in executeSearch:", event);
    this.searchQuery = event;
  }
  clearSearch() {
    this.searchQuery = "";

  }
}
