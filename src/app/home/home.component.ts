import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonService } from '../shared/services/common.service';
import { ElementQueries, ResizeSensor } from 'css-element-queries'
import {MatFabMenu} from '@angular-material-extensions/fab-menu';
import { MatDialog } from '@angular/material/dialog';
import { HomeFilterDialogComponent } from './modal-dialog/home-filter-dialog/home-filter-dialog.component';
import { ActivatedRoute,Params,Router ,ParamMap} from '@angular/router'
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
  @ViewChild('kiContainer') resizableElement: ElementRef;
  selectedTab: any;
  kiOffset: number = 0;
  kiLimit: number = 15;
  public dom: any=[];
  domKis: any= [];
  kiForSummary: any=[];
  tags: any = [];
  kiSummary:  any = [];
  // filteredtags: any=[];
  tagsIndices: any=[];
  kiSelected: boolean = false;
  public fabButtonsRandom: MatFabMenu[]=[];
  public elementSize: string='';
  public domains:any=[];
  public kis:any =[];
  checkId:any[]=[];
  @Input() searchQuery: string = "";

  myGroups:any = [];
  constructor(
    private sharedService:SharedService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService,
    public commonService:CommonService,
    public localStorageService: LocalStorageService,
    public dialog: MatDialog,
    ){
    this.resizableElement=new ElementRef(document.querySelector(".home-ki-container"));
    
  }

  async ngOnInit(){  
    this.homeService.getAllTags().subscribe((res:any)=>{
      this.tags=res.data;
      console.log("getting all tags",this.tags);
      // to get only the indices
       this.tagsIndices = Array.from(this.tags.keys());
      // console.log("getting all indices",this.tagsIndices);
    })
    // const UserSelectedDomains = this.localStorageService.getitem("UserSelectedDomains");
    // if (UserSelectedDomains){
    //   this.domains = UserSelectedDomains;
    // }else{
    //   await this.getUserDomains();
    // } 

    this.selectedTab = this.localStorageService.getitem("selectedHomeTab") || 0;
    // this.getKisByDomain();
  }
  
  isKiSelectedForSummary(){
   this.kiSummary = this.localStorageService.getitem("kiForSummary") || [];
  return this.kiSummary.length>0 ? true : false; 
  }

  // getUserDomains() {
  //   this.homeService.getUserDomains().subscribe({
  //     next: (response: any) => {
  //       // console.log('User domains:',response);
  //       this.domains = response.data;
  //     },
  //     error: (e) => {
  //       console.log("Error : ", e);
  //     },
  //     complete: () => {
  //       console.info('Complete');
  //     }
  //   });
  // }
  

  onTabChanged(event:any){
    console.log('onTabChanged',event.index);  
     this.selectedTab = event.index; 
     this.localStorageService.setitem("selectedHomeTab",this.selectedTab);
     console.log("this.selectedTab ",this.selectedTab );
     
     this.reset();
    //  this.getKisByDomain();
  }

  // getKisByDomain(){
  //     this.dom=this.domains[this.selectedTab];
  //     this.homeService.getKisByDomain(this.dom._id, this.tagsIndices, this.searchQuery, this.kiOffset, this.kiLimit)
  //     .subscribe({
  //       next : (res:any) =>{
  //         this.domKis = [...this.domKis, ...res.data];
  //         // console.log(" this.domKis: ",  this.domKis );
  //       },
  //       error: (e:any) =>{
  //         console.log("error",e);
  //       }
  //     });
  //   }

    onScroll(event:any){
    // console.log('offsetHeight: ',event.target.offsetHeight)
    // console.log('scrollHeight: ',event.target.scrollHeight);
    // console.log('scrollTop: ',event.target.scrollTop);
    // console.log("Difference:",(event.target.scrollHeight-event.target.offsetHeight));
    if (Math.round(event.target.scrollTop)>=(event.target.scrollHeight-event.target.offsetHeight-1)){
     this.kiOffset = this.kiOffset + this.kiLimit;
    //  this.getKisByDomain();
    }
  }

  reset(){
    this.domKis = [];
    this.kiOffset = 0;
  }

  onCheckedChange(event:any){
    // console.log('onCheckedChange: ',event.target.checked)
    console.log('onCheckedChange: ',event)
    this.kiForSummary = this.localStorageService.getitem("kiForSummary") || [];
    if(event.checked){
      this.kiForSummary.push({
        kiId:event.kiDetails._id,
        checked: event.checked,
        kiData: event.kiDetails
      });
    }
    else{
      this.kiForSummary = this.kiForSummary.filter((ki:any)=> ki.kiId!=event.kiDetails._id);
    }
    this.localStorageService.setitem("kiForSummary",this.kiForSummary);

    
  }

  // onKnowledgeItemClick(ki:any){
  //   console.log("ki onKnowledgeItemClick in Home Component",ki);
  //   let id:string = ki._id;
  //   // console.log("ki._id:",id);
  //   this.router.navigateByUrl(`/home/knowledgeitem/${id}`);
  // }

  // onFilterClick(){
  //   console.log('Home Filter Click')
  //   const dialogRef = this.dialog.open(HomeFilterDialogComponent,{panelClass:'mat-filter-dialog',
  //                                                                   data:this.tags});

  //   dialogRef.afterClosed().subscribe(result => {
  //     // console.log('Dialog result: ',result.category);
  //     const filteredtags=result?.category;
  //     if(filteredtags!=this.tagsIndices ){
  //       this.tagsIndices = filteredtags;
  //     }
  //     if(filteredtags === null){
  //       this.tagsIndices=[];
  //     }
  //     this.reset();
  //     // this.getKisByDomain();
  //   });
  // }

  

  onItemizedSummaryClick(event:any){
    this.router.navigateByUrl('/home/itemized-summary');
  }

  onConsolidatedSummaryClick(event:any){
    this.router.navigateByUrl('/home/consolidated-summary');
  }

  onHighlightsClick(event:any){
    this.router.navigateByUrl('/home/highlight');
  }

  ngAfterViewInit() {
    // ElementQueries.listen();
    // ElementQueries.init();

    const resizeSensor = new ResizeSensor(this.resizableElement.nativeElement, () => {
      this.elementSize = 'Width: ' + this.resizableElement.nativeElement.clientWidth +
      ' Height: ' + this.resizableElement.nativeElement.clientHeight;

      console.log(this.elementSize);
    }); 
  }

  executeSearch(event:any){
    console.log("event in executeSearch:",event);
    this.searchQuery = event;
    this.reset();
    // this.getKisByDomain();
  }
  clearSearch(){
    this.searchQuery = "";
    this.reset();
    // this.getKisByDomain();
  }
}
