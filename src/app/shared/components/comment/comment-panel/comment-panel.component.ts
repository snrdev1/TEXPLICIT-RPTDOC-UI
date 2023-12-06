import { Component, Input,ViewChild, ElementRef, Output, EventEmitter,Renderer2  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-panel',
  templateUrl: './comment-panel.component.html',
  styleUrls: ['./comment-panel.component.scss']
})
export class CommentPanelComponent {
  @Input() ki_id : string = "";
  @Input() comments: any[] = [];
  @Input() totalCount: any = 0;
  sortBy: number = 1;
  inputValue: any;
  selectedComment: any;
  selectedSort: string ='Top Comments';
  @Output() commentEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() totalCountEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onaddComment: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLike: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDelComment: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditComment: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSort: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('inputElement', { static: false }) inputElement! : ElementRef;
  
  constructor(
             public dialog:MatDialog,
             private renderer: Renderer2 ){}


  onSortChange(){
    console.log('onSortChange clicked');
    this.sortBy = this.selectedSort === 'Top Comments' ? 1: this.selectedSort === 'Latest Comments' ? 2 : this.selectedSort === 'Oldest Comments' ? 3 : 0 ;
    this.onSort.emit(this.sortBy);
  }

 clickReplyComment(event:any){
   this.selectedComment = event;
   this.renderer.selectRootElement(this.inputElement.nativeElement).focus();
 }  


 addComment(){
   let query: any;
    this.inputValue = this.inputElement.nativeElement.value;
     console.log("inputValue:",this.inputValue);
     console.log("SELECTED COMMENT:",this.selectedComment);
     if (this.selectedComment){
       query ={
         parent: this.selectedComment._id,
         mainParent: this.selectedComment.mainParent ? this.selectedComment.mainParent.type : this.selectedComment._id,
         comment: this.inputValue,
         replyTo:{
           '_id': this.selectedComment.user.type,
           'name': this.selectedComment.authorName
         } 
       };
     }
     else{
       query = {
         parent: null,
         mainParent: null,
         comment: this.inputValue
     };
   }
     this.inputElement.nativeElement.value = null;
     this.selectedComment= "";
     this.onaddComment.emit(query);
 }

 clickLikeComment(event:any){
 const commentId: string = event?._id["$oid"];
 this.onLike.emit(commentId);
}

 clickDeleteComment(event:any){
   const commentId: string  = event?._id["$oid"];
   this.onDelComment.emit(commentId);
 }

 clearSelectedComment(){
   this.selectedComment= "";
 }
 clickEditComment(event:any){
   this.onEditComment.emit(event);
 }
  
}
