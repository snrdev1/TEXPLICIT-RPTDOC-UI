import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { WebSocketService } from 'src/app/shared/services/socketio.service';
import { CommonService } from '../../shared/services/common.service';
import { ChatService } from '../../shared/components/chat/chat.service';
@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.scss']
})
export class ChatPanelComponent {
  chatForm: FormGroup;
  prompt: string = "";
  chatSelection: string = "External";
  selectedChat: number = 0;
  chatResponses: any = [];
  chatEvent: string = "chat";
  currentUserId: string = "";
  userImage: string = "";
  isLoading: boolean = false;
  userInfo$: Observable<any> = this.localStorage.userInfo$;
  timestamp = new Date().getTime();
  date = new Date(this.timestamp);
  options = {
    day: '2-digit' as const,
    month: '2-digit' as const,
    year: 'numeric' as const,
    hour: '2-digit' as const,
    minute: '2-digit' as const,
    second: '2-digit' as const,
    hour12: false as const,
  };
  formatter = new Intl.DateTimeFormat('en-GB', this.options);
  formattedTime = this.formatter.format(this.date);
  userInfo: any = [];
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;
  @ViewChild('inputElement', { static: false }) inputElement!: ElementRef;

  constructor(private commonService: CommonService,
    private chatService: ChatService,
    private socketService: WebSocketService,
    private localStorage: LocalStorageService,
    private renderer: Renderer2,
    private formBuilder: FormBuilder
  ) {
    this.chatForm = this.formBuilder.group({
      prompt: new FormControl("")
    });
    this.userInfo = this.localStorage.getUserInfo();

  }

  ngOnInit() {

    if (this.userInfo) {
      this.currentUserId = this.userInfo?._id;
    }

    this.getChatHistory();
    if (this.chatResponses) {
      this.chatEvent = this.chatEvent + "_" + this.currentUserId;

      // Setup chat listener
      this.setupChatListener();
    }

  }

  scrollIntoView() {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }

  setupChatListener() {
    this.socketService.listen(this.chatEvent).subscribe({
      next: (res) => {
        const existingIndex = this.chatResponses.findIndex((response: any) => response.role === "system" && response.chatId && response.chatId === res[0].chatId);
        if (existingIndex !== -1) {
          // Append to the existing content
          this.chatResponses[existingIndex].content += res[0]?.response;
        } else {
          // Append new dictionary
          this.chatResponses = [...this.chatResponses, { "content": res[0]?.response, "role": "system", "chatType": res[0].chatType, "timestamp": this.formattedTime, "chatId": res[0].chatId }];
        }

        console.log("Chat response : ", res);

        this.isLoading = false;
      },
      error: (e) => {
        console.log("Error: ", e);
      },
      complete: () => {
        console.log("Chat listen complete");
      }
    })
  }

  getNewTime() {
    this.timestamp = new Date().getTime();
    this.date = new Date(this.timestamp);
    this.formattedTime = this.formatter.format(this.date);
  }

  onChatSelection() {
    this.selectedChat = this.chatSelection === 'External' ? 0 : this.chatSelection === 'My Documents' ? 1 : 0;
    console.log("this.chatSelection", this.selectedChat);
  }

  chatClose() {
    this.commonService.chatOpen = false;
  }

  onPromptSubmit() {
    this.inputElement.nativeElement.focus();

    this.prompt = this.chatForm.controls['prompt'].value;
    if (this.prompt) {
      this.scrollIntoView();
      this.getNewTime();
      let chatId: string = this.currentUserId + this.formattedTime;

      console.log("chatId : ", chatId);

      // Append user chat
      this.chatResponses = [
        ...this.chatResponses,
        {
          "content": this.prompt,
          "role": "user",
          "chatType": this.selectedChat,
          "timestamp": this.formattedTime,
          "chatId": chatId
        }
      ];
      this.isLoading = true;

      console.log("New chat : ", {
        "content": this.prompt,
        "role": "user",
        "chatType": this.selectedChat,
        "timestamp": this.formattedTime,
        "chatId": chatId
      })

      this.chatService.getChatResponses(this.prompt, this.selectedChat, chatId).subscribe({
        next: (res) => {
          console.log("response in chat", res);
        },
        error: (e) => {
          console.log("Error: ", e);
        },
        complete: () => {
          console.log("Complete");
          this.chatForm.setValue({ 'prompt': "" });
        }
      })
    }
  }

  getChatHistory() {
    console.log("Get chat history called");
    this.isLoading = true;
    this.chatService.getChatHistory().subscribe({
      next: (res) => {
        this.chatResponses = res.data[0]?.chat || [];
        this.userImage = res.data[1] || "assets/images/user-icon.png";

      },
      error: (e) => {
        console.log("Error:", e);
      },
      complete: () => {
        console.log("Complete fetching chat history");
        this.isLoading = false;
        this.scrollIntoView();
      }
    })
  }

  copyChat() {
    var copiedText = '';
    for (var i = 0; i < this.chatResponses.length; i++) {
      copiedText += this.chatResponses[i].role.toUpperCase() + ": " + this.chatResponses[i].content + '\n';
    }
    // console.log(text);
    const textarea = this.renderer.createElement('textarea');
    this.renderer.setAttribute(textarea, 'readonly', '');
    this.renderer.setStyle(textarea, 'position', 'absolute');
    this.renderer.setStyle(textarea, 'opacity', '0');
    this.renderer.setProperty(textarea, 'value', copiedText);
    this.renderer.appendChild(document.body, textarea);
    textarea.select();
    document.execCommand('copy');
    this.renderer.removeChild(document.body, textarea);
  }
}
