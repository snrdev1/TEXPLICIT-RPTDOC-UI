import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['./chat-card.component.scss']
})
export class ChatCardComponent {
  @Input() chats: any = [];
  @Input() userImage: string = "";

  getChatTypeString(chatType: number): string {
    return chatType === 0 ? 'External' : chatType === 1 ? 'My Documents' : '';
  }
}
