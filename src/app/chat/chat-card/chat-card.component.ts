import { Component, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['./chat-card.component.scss']
})
export class ChatCardComponent {
  @Input() chats: any = [];
  @Input() userImage: string = "";

  constructor(
    private clipboard: Clipboard
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
}
