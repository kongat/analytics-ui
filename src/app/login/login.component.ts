import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatCardModule, MatButtonModule,ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
    ) {}

  loginForm = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });

  onSubmit(){
    if(this.loginForm.valid){
      this.authService
        .login(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value)
        .subscribe((response) => {
          this.router.navigate(['/']);
          this.notificationService.success('User successfully logged in.');
        },
        err =>{
          this.notificationService.error('Login failed.');
        });
    }
  }

}
