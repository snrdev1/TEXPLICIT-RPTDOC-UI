import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ChatPanelComponent } from './chat-panel/chat-panel.component';
import { ChatSourcesComponent } from './chat-sources/chat-sources.component';
import { ChatCardComponent } from './chat-card/chat-card.component';
import { MarkdownModule } from 'ngx-markdown';


const routes: Routes = [
  {
    path: '',
    component: ChatPanelComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    SharedModule,
    MarkdownModule.forChild()
  ],
  declarations: [
    ChatCardComponent,
    ChatPanelComponent,
    ChatSourcesComponent
  ]
})
export class ChatModule { }
