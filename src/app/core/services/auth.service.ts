import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private readonly TOKEN_NAME = 'auth_token';
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  user: UserModel | null;

  get token(): any {
    return localStorage.getItem(this.TOKEN_NAME);
  }

  constructor(
    private apiService: ApiService,
    private router:Router
  ) {
    this._isLoggedIn$.next(!!this.token);
    this.user = this.getUser(this.token)
   }

  login(username: string, password: string) {
    return this.apiService.login(username, password).pipe(
      tap((response: any) => {
        this._isLoggedIn$.next(true);
        localStorage.setItem(this.TOKEN_NAME, response.token);
        this.user = this.getUser(response.token)
        console.log(this.user)
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    this._isLoggedIn$.next(false);
    this.router.navigate(["/login"]);
  }

  private getUser(token: string): UserModel | null {
    if (!token) {
      return null
    }
    console.log(JSON.parse(atob(token.split('.')[1])))
    return JSON.parse(atob(token.split('.')[1])) as UserModel;
  }
}
