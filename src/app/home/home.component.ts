import { MatFabMenu } from '@angular-material-extensions/fab-menu';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../core/local-storage.service';
import { CommonService } from '../shared/services/common.service';
import { HomeService } from '../shared/services/home.service';
import { SharedService } from '../shared/services/shared.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

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
      "description": "Don't lose hours in creating content for your next presentation. Key in your topic and sub-topics and get your report in minutes",
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
  }

}
