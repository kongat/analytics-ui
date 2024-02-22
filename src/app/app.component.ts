import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router){
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(res => {
      if(!res){
        this.router.navigate(['/login']);
      }else{
        this.router.navigate(['/']);
      }
    })
  }

}
