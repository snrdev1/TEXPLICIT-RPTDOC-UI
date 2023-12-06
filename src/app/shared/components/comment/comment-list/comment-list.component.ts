import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent {
@Input() comments: any[] = [];
@Output() onCommentLike: EventEmitter<any> = new EventEmitter<any>;
@Output() onCommentDelete: EventEmitter<any> = new EventEmitter<any>;
@Output() onCommentDeleteEmit: EventEmitter<any> = new EventEmitter<any>;
@Output() onCommentReply: EventEmitter<any> = new EventEmitter<any>;
@Output() onCommentEdit: EventEmitter<any> = new EventEmitter<any>;

 ngOnInit(){
  // console.log("Comments in comment-list",this.comments);
 }

 commentLike(event: any){
  this.onCommentLike.emit(event);
 }

 commentDelete(event:any){
  this.onCommentDelete.emit(event);
  this.onCommentDeleteEmit.emit(event);
 }
 onReplyToComment(event:any){
  this.onCommentReply.emit(event);
 }
 commentEdit(event:any){
  this.onCommentEdit.emit(event);
 }
}
