import {Injectable, OnDestroy} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs';
import { environment} from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {

  socket: any;
  socketName: string = environment.socketName;

  constructor() {
    this.connectSocket();
  }

  connectSocket() {
    this.socket = io.connect(this.socketName);
  }

  disconnectSocket(): void {
    this.socket.close();
  }

  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }

  removeAllListeners(eventName: string){
    this.socket.removeAllListeners(eventName);
  }

  emit(eventname: string, data: any) {
    this.socket.emit(eventname, data);
  }

  ngOnDestroy(): void {
    this.disconnectSocket();
    // console.log("disconnected");
  }
}
