import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ApiService } from './core/services/api.service';
import { HeaderComponent } from './core/components/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
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

    this.apiService.getRoot().subscribe(
      res => {
        console.log(res)
        console.log(res)
      }
    )
  }

}
