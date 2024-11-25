import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { EmployeeModel } from '../models/employee.model';
import { PassoutEvent } from '../models/passout-event.model';
import { SosEvent } from '../models/sos-event.model';

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

  public getSosMessage(): Observable<SosEvent> {
    console.log("reeees")
    return new Observable<SosEvent>((observer) => {
      this.socket.on('sos', (data) => {
        console.log(data)
        observer.next(data.data);
      });
    });
  }

  public getPassoutMessage(): Observable<PassoutEvent> {
    return new Observable<PassoutEvent>((observer) => {
      this.socket.on('passout', (data) => {
        console.log(data.data)
        observer.next(data.data);
      });
    });
  }
}
