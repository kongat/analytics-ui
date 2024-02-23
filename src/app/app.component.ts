import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ApiService } from './core/services/api.service';
import { environment } from '../environments/environment'
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
    private apiService: ApiService,
    private router: Router){
  }

  ngOnInit(): void {
    console.log(environment)
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
