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

  copyChat(text: string) {
    this.clipboard.copy(text);
  }
}
