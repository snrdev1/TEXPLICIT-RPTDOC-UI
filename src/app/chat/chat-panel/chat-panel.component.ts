import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/modal-dialog/confirm-dialog/confirm-dialog.component';
import { WebSocketService } from 'src/app/shared/services/socketio.service';
import { CommonService } from '../../shared/services/common.service';
import { ChatService } from '../chat.service';

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
  chatLoading: boolean = false;
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
  limit: number = 10;
  offset: number = 0;
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;
  @ViewChild('inputElement', { static: false }) inputElement!: ElementRef;

  constructor(private commonService: CommonService,
    private chatService: ChatService,
    private socketService: WebSocketService,
    private localStorage: LocalStorageService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
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

        // Find index of dictionary with the response chatId
        const index = Object.values(this.chatResponses).findIndex(
          (dict: any) =>
            dict.chatId === res[0]?.chatId &&
            dict.role === "system"
        );

        // Using that index append the response to the content of the dictionary
        this.chatResponses[index].content += res[0]?.response;
        this.chatResponses[index].loading = false;
        this.chatResponses[index].sources = res[0]?.sources;
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

      // Append user chat
      this.chatResponses = [
        ...this.chatResponses,
        {
          "content": this.prompt,
          "role": "user",
          "chatType": this.selectedChat,
          "timestamp": this.formattedTime,
          "chatId": chatId,
          "loading": false
        }
      ];

      console.log("Chat : ", {
        "content": this.prompt,
        "role": "user",
        "chatType": this.selectedChat,
        "timestamp": this.formattedTime,
        "chatId": chatId,
        "loading": false
      });

      // Append new response dictionary
      this.chatResponses = [
        ...this.chatResponses,
        {
          "content": "",
          "role": "system",
          "chatType": this.selectedChat,
          "chatId": chatId,
          "loading": true
        }
      ];

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
    this.chatLoading = true;
    this.chatService.getChatHistory(this.limit, this.offset).subscribe({
      next: (res) => {
        const chat = res.data[0]?.chat || [];
        this.chatResponses = [...chat, ...this.chatResponses];
        this.userImage = res.data[1] || "assets/images/user-icon.png";
      },
      error: (e) => {
        console.log("Error:", e);
      },
      complete: () => {
        console.log("Complete fetching chat history");

        if (this.offset === 0) {
          // Only scroll to bottom if this is the first call
          this.scrollIntoView();
        }

        this.chatLoading = false;
      }
    })
  }

  deleteChat() {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'mat-dialog-panel',
      data: { "modalTitle": "Delete Chat", "modalMessage": "Are you sure you want to delete chat?" }
    });

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        this.chatService.deleteChat().subscribe({
          next: (res) => {
            this.chatResponses = [];
            this.chatLoading = false;
          },
          error: (e) => {
            console.log("Error:", e);
          },
          complete: () => {
            console.log("Complete deleting chat history");
          }
        })
      }
    });
  }

  onScrollUp(){
    console.log("Scroll up!");
    this.offset = this.offset + 10;
    this.getChatHistory();
  }
}
