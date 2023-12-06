import { Component } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { NewsService } from '../news.service';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { WebSocketService } from 'src/app/shared/services/socketio.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-news-panel',
  templateUrl: './news-panel.component.html',
  styleUrls: ['./news-panel.component.scss']
})
export class NewsPanelComponent {
 user: any = [];
 newsData: any = [];
 newsEvent: string = "news";
 loading: boolean = false;
 start: number = 0;
 engine: number = 0;
 count: number = 15;
 query: string = "";
 randomId: string = "";
 userId: string="";
 userInfo: any=[];
 userInfo$: Observable<any> = this.localStorage.userInfo$;
  constructor(public commonService:CommonService,
              public newsService: NewsService,
              private localStorage: LocalStorageService,
              private socketService: WebSocketService){
              this.userInfo = this.localStorage.getUserInfo();
  }
  
  ngOnInit(){
    
    // this.userInfo$.subscribe((res) =>{
    // this.userId = res?._id;
    // });
    if(this.userInfo){
      this.userId = this.userInfo?._id;
    }
  }

  newsClose(){
    this.commonService.newsOpen=false;
  }

  newsSearch(query: string){
    this.socketService.removeAllListeners(this.newsEvent);

    if (this.userId)
      this.randomId = this.userId;
    else
      this.randomId = (Math.random() * 100000).toString();

    this.query = query;
    this.newsEvent = this.randomId + "_" + this.query + "_news";
    this.newsData = [];
    this.start = 0;

    this.startListening();
    this.search(true);
  }

  startListening() {
    console.log("Started listening for event : ", this.newsEvent);

    this.socketService.listen(this.newsEvent).subscribe({
      next: (response: any) => {
        this.newsData.push(response);
        // console.log(" this.newsData", this.newsData);
        console.log("Length of news data : ", this.newsData.length);
        if (this.newsData.length % this.count == 0) {
          this.loading = false;
        }
      },
      error: (e) => console.log("Error : ", e),
      complete: () => {
        console.info('Complete');
      }
    });
  }

  
  search(loading = false): void {
    console.log("News Search!");
    if (loading) {
      this.loading = true;
    }

    this.newsService.getNews(this.query, this.engine, this.count, this.start, this.randomId).subscribe({
      next: (response: any) => {
        console.log("News response from /get-news: ", response);
      },
      error: (e) => {
        console.log("Error : ", e);
        this.loading = false;
      },
      complete: () => {
        console.info('Complete');
        this.loading = false;

      }
    });
  }
loadNews(){
    this.start += this.count + 10;
    console.log("start : ", this.start);
    this.search(true);
}

onClearNews(){
  this.newsData = [];
  // this.loading = false;
}
}
