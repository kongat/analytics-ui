import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { EmployeeModel } from '../models/employee.model';

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

  public getSosMessage(): Observable<EmployeeModel> {
    console.log("reeees")
    return new Observable<EmployeeModel>((observer) => {
      this.socket.on('sos', (data) => {
        console.log(data)
        observer.next(data.data);
      });
    });
  }

  public getPassoutMessage(): Observable<EmployeeModel> {
    return new Observable<EmployeeModel>((observer) => {
      this.socket.on('passout', (data) => {
        console.log(data.data)
        observer.next(data.data);
      });
    });
  }
}
