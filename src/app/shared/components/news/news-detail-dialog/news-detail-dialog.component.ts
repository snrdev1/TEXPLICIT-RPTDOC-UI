import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { NewsService } from '../news.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { MatDialog} from '@angular/material/dialog';
import { NewsToMyDocComponent } from '../news-to-my-doc/news-to-my-doc.component';
import { AuthService } from 'src/app/core/auth.service';


@Component({
  selector: 'app-news-detail-dialog',
  templateUrl: './news-detail-dialog.component.html',
  styleUrls: ['./news-detail-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewsDetailDialogComponent {
  // items=Array(15)
  constructor(
    public dialogRef: MatDialogRef<NewsDetailDialogComponent>,
    private sanitizer: DomSanitizer,
    public newsService: NewsService,
    public dialog: MatDialog,
    private authService: AuthService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(){
    console.log("this.data",this.data);
  }
  userLoggedIn(){
    if(this.authService.isLoggedIn){
      return true;
  }else{
    return false;
  }
}
  onCloseClick(){
    this.dialogRef.close(false);
  }

  get safeSummary(): SafeHtml {
    const summary = this.data.summary;
    const keywords = this.data.keywords;
    const regex = new RegExp(`\\b(${Array.isArray(keywords) ? keywords.join('|') : keywords})\\b`, 'gi');
    const highlighted = summary.replace(regex, (match: string) => `<span class='text-color-highlight'>${match}</span>`);
    const withLineBreaks = highlighted.replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(withLineBreaks);
  }

  shareNews(){
    console.log('save news to myDocs');
    const dialogRef = this.dialog.open(NewsToMyDocComponent,{panelClass:'mat-dialog-panel',data:{"news":this.data}});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      
    });

    

  }
}
