import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ChatComponent } from './chat.component';


const routes: Routes = [
  {
    path: '',
    component: ChatComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    SharedModule
  ],
  declarations: [
    ChatComponent
  ]
})
export class ChatModule { }
