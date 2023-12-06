import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-report-update-cards',
  templateUrl: './report-update-cards.component.html',
  styleUrls: ['./report-update-cards.component.scss']
})
export class ReportUpdateCardsComponent {
  @Input() report:any=[];
  @Input() displayStyle:any="";
}
