import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-subtopic',
  templateUrl: './subtopic.component.html',
  styleUrls: ['./subtopic.component.scss']
})
export class SubtopicComponent {
  @ViewChild('chipContent', { read: ElementRef }) widgetsContent: ElementRef<any>;
  @Input() Subtopics:any;

  constructor(){
    this.widgetsContent=new ElementRef(document.querySelector("#chipContent"));
  }
  public scrollRight(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }

}
