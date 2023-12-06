import { Component, Input } from '@angular/core';
import { NewsDetailDialogComponent } from '../news-detail-dialog/news-detail-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss']
})
export class NewsCardComponent {
  @Input() news: any = [];
  constructor(public dialog: MatDialog) {}
  
  // ngOnInit(){
  //   console.log("news in news card component:",this.news);
  // }
  onNewsDetailClick(event:any){
    event.preventDefault();
    console.log('News Detail Click',event);
    const dialogRef = this.dialog.open(NewsDetailDialogComponent,{panelClass:'mat-news-detail-dialog',data:this.news});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  getDate(data: any) {
    return new Date(JSON.parse(data.pub_date));
  }
  
}
