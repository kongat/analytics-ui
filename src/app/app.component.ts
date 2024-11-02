import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ApiService } from './core/services/api.service';
import { HeaderComponent } from './core/components/header/header.component';
import { CommonModule } from '@angular/common';
import { SocketService } from './core/services/socket.service';
import { NotificationService } from './core/services/notification.service';
import { EmployeeModel } from './core/models/employee.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,CommonModule ],
  providers:[],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  messages: string[] = [];

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    private socketService: SocketService,
    private notificationService: NotificationService,
    private router: Router){
      this.socketService.setupSocketConnection()
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(res => {
      if(!res){
        this.router.navigate(['/login']);
      }else{
        this.router.navigate(['/']);
      }
    })

    this.socketService.getSosMessage().subscribe((employee: EmployeeModel) => {
      this.notificationService.warn(employee.firstName + " "+ employee.lastName +' '+'needs help.');
      //this.messages.push(message);
    });

    this.socketService.getPassoutMessage().subscribe((employee: EmployeeModel) => {
      this.notificationService.error(employee.firstName + " "+ employee.lastName +' '+'has passed out.');
      //this.messages.push(message);
    });
  }

}
