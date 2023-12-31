import { Component, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { validateBasis } from '@angular/flex-layout';
import { ChatService } from '../chat.service';
import { WebSocketService } from 'src/app/shared/services/socketio.service';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.scss']
})
export class ChatPanelComponent {
  chatForm: FormGroup;
  prompt: string="";
  chatSelection:string="External";
  selectedChat: number=0;
  chatResponses: any=[];
  chatEvent: string = "chat";
  currentUserId: string="";
  userImage: string="";
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
  userInfo:any=[];

  // @ViewChild('inputElement')  inputElement!: ElementRef;
  // @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;
  @ViewChild('inputElement', { static: false }) inputElement!: ElementRef;

  constructor(private commonService:CommonService,
              private chatService: ChatService,
              private socketService: WebSocketService,
              private localStorage: LocalStorageService,
              private renderer: Renderer2,
              private formBuilder: FormBuilder
            ){
              this.chatForm = this.formBuilder.group({
                prompt:new FormControl("")
              });
              this.userInfo = this.localStorage.getUserInfo();

  }
  ngOnInit(){
    // this.userInfo$.subscribe((res) =>{
    // this.currentUserId = res?._id;
    // });
    
    if(this.userInfo){
      this.currentUserId = this.userInfo?._id;
    }
    this.getChatHistory();
    if(this.chatResponses){
      this.chatEvent = this.chatEvent + "_" + this.currentUserId;
      // console.log("this.chatEvent",this.chatEvent);
      this.socketService.listen(this.chatEvent).subscribe({
        next: (res)=>{
          console.log("response of chat: ",res);
          this.chatResponses = [...this.chatResponses,{"content": res[0]?.response,"role":"system","chatType":res[0].chatType,"timestamp": this.formattedTime}];
          // console.log("this.chatresponses",this.chatResponses);
          this.isLoading = false;
        },
        error: (e)=>{
          console.log("Error: ",e);
        },
        complete: ()=>{
          console.log("Chat listen complete");
        }
      })
    }
    
  }
  ngAfterViewChecked(){
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      // this.inputElement.nativeElement.focus();
  }
  
  onChatSelection(){
    this.selectedChat = this.chatSelection === 'External' ? 0 : this.chatSelection === 'My Documents' ? 1 : this.chatSelection === 'Knowledge Repository' ? 2  : 0;         
    console.log("this.chatSelection",this.selectedChat);
  }

  chatClose(){
    this.commonService.chatOpen=false;
  }

  onPromptSubmit(){
    // console.log('prompt: ', this.chatForm.controls['prompt'].value);
    // console.log('chatSelected', this.selectedChat);
    // console.log('timestamp', this.timestamp);
    this.inputElement.nativeElement.focus();

    this.prompt = this.chatForm.controls['prompt'].value;
    if (this.prompt) {
      this.chatResponses = [...this.chatResponses, 
        {"content": this.prompt, "role": "user", "chatType": this.chatSelection, "timestamp": this.formattedTime}];
        this.isLoading = true;
        this.chatService.getChatResponses(this.prompt, this.selectedChat).subscribe({
        next: (res)=>{
          console.log("response in chat",res);
        },
        error: (e)=>{
          console.log("Error: ",e);
        },
        complete: ()=>{
          console.log("Complete");
          this.chatForm.setValue({'prompt':""});
        }
    })
  }
}

getChatHistory(){
  console.log("Get chat history called");
  this.isLoading = true;
  this.chatService.getChatHistory().subscribe({
    next: (res)=>{
      // console.log("response in chat history",res.data);
      this.chatResponses = res.data[0]?.chat || [];
      this.userImage = res.data[1] || "assets/images/user-icon.png" ; 

    },
    error: (e)=>{
      console.log("Error:",e);
    },
    complete:()=>{
      console.log("Complete fetching chat history");
      this.isLoading = false;
    }
  })
}

copyChat(){
  var copiedText = '';
  for(var i = 0; i < this.chatResponses.length; i++){
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