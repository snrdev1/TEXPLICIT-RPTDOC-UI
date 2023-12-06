import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog-base',
  templateUrl: './dialog-base.component.html',
  styleUrls: ['./dialog-base.component.scss']
})
export class DialogBaseComponent {
@Input() modalTitle:string=""
@Output() onClose = new EventEmitter();

onCloseClick(){
  this.onClose.emit();
}
}
