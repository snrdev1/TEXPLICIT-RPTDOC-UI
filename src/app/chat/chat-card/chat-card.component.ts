import { Component, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { ChatSourcesComponent } from '../chat-sources/chat-sources.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['./chat-card.component.scss']
})
export class ChatCardComponent {
  @Input() chats: any = [];
  @Input() userImage: string = "";

  constructor(
    private clipboard: Clipboard,
    private dialog: MatDialog
  ) { }

  getChatTypeString(chatType: number): string {
    return chatType === 0 ? 'External' : chatType === 1 ? 'My Documents' : '';
  }

  changeIcon(chat: any) {
    chat.showTick = true;
    setTimeout(() => {
      chat.showTick = false;
    }, 2000); // 2000 milliseconds (2 seconds) for example, adjust as needed
  }

  copyChat(chat: any) {
    console.log(chat?.content);
    this.changeIcon(chat);
    this.clipboard.copy(chat?.content);
  }

  openSources(sources: any) {
    this.dialog.open(ChatSourcesComponent, { panelClass: 'mat-ki-add-dialog', data: sources });
  }
}
