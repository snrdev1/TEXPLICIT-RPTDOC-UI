import { Component, Output, EventEmitter } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-report-steps',
  templateUrl: './report-steps.component.html',
  styleUrls: ['./report-steps.component.scss']
})
export class ReportStepsComponent {
  @Output() dismissStep = new EventEmitter<any>();

  dismissSteps(){
    this.dismissStep.emit();
  }
}
