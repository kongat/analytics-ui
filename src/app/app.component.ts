import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ApiService } from './core/services/api.service';
import { HeaderComponent } from './core/components/header/header.component';
import { CommonModule } from '@angular/common';
import { SocketService } from './core/services/socket.service';

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

    this.apiService.getRoot().subscribe(
      res => {

      }
    )

    this.socketService.getMessage().subscribe((message: string) => {
      this.messages.push(message);
    });
  }

}
