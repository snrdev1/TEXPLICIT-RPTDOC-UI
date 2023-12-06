import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent {
  toggleEditDiv : boolean = false;
  curr_id:any;
  @Input() parentAuthorName = "";
  @Input() comment: any = [];
  @Output() likeComment: EventEmitter<any> = new EventEmitter<any>;
  @Output() deleteComment: EventEmitter<any> = new EventEmitter<any>;
  @Output() replyToComment: EventEmitter<any> = new EventEmitter<any>;
  @Output() editComment: EventEmitter<any> = new EventEmitter<any>;
  @ViewChild('msgInput') msgInput!: ElementRef;
  user$: Observable<any> = this.localstorage.userInfo$;
  constructor(private localstorage:LocalStorageService){}

  commentCreatedOn : string = "";
  ngOnInit(){
    // console.log("Comment in comment-card",this.comment);
    this.commentCreatedOn  = this.comment['created']['$date'];

    //get current user
    this.user$.subscribe((data) => {
      this.curr_id = data?._id;
    });
   }

   getReplyTo(comment: any): string {
    if (comment.replyTo) {
      const userTag = comment['authorName'];
      let commentStr = "Replying to " + userTag  ;
      //  console.log("commentStr",commentStr);
       return commentStr;
    }
    return "";
  }

  onlikeComment(){
    this.likeComment.emit(this.comment);
  }

  onDeleteComment(){
    this.deleteComment.emit(this.comment);
  }
  onReplyClick(){
    this.replyToComment.emit(this.comment);
  }
  onEditToggle(){
    this.toggleEditDiv = !this.toggleEditDiv;
    console.log("this.toggleEditDiv",this.toggleEditDiv);
  }
  onEditComment(){
    const textareaValue = this.msgInput.nativeElement.value;
    console.log("SelectedComment45454:",this.comment);
    this.comment.comment = textareaValue;
    this.editComment.emit(this.comment);
    this.toggleEditDiv = false;
  }
  Authorized(){
    return (this.comment.user.type.$oid == this.curr_id)
  }
}
