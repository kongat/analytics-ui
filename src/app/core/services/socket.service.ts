import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  constructor() {
  }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  public getMessage(): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket.on('test', (data: string) => {
        observer.next(data);
      });
    });
  }
}
