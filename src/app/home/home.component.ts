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
      "description": "No more searching the web for hours to compile knowledge to create your reports. Key in your topic and sub-topics and get your report in minutes",
      "image": "../../assets/images/home-cards/Card_1.png"
    },
    {
      "title": "Marketing",
      "description": "Don’t lose hours in creating content for your next presentation. Key in your topic and sub-topics and get your report in minutes",
      "image": "../../assets/images/home-cards/Card_2.png"
    },
    {
      "title": "Corporate Training",
      "description": "No more hours of research required to create content for your training program. Key in your topic and sub-topics and get your training material in minutes",
      "image": "../../assets/images/home-cards/Card_3.png"
    },
    {
      "title": "Education",
      "description": "Looking to prepare course material for your students? Key in your topic and sub-topics and get your course material in minutes",
      "image": "../../assets/images/home-cards/Card_4.png"
    },
    {
      "title": "Research",
      "description": "Speed up your research. Key in your topic and sub-topics and get your research material in minutes",
      "image": "../../assets/images/home-cards/Card_5.png"
    },
    {
      "title": "Blog Writing",
      "description": "You have a lot of material on the subject you want to discuss in your next blog.There is also a lot of information and opinions expressed by other bloggers...",
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
