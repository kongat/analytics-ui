import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(environment.baseUrl + 'signin', { username, password });
  }

  getEmployees() {
    return this.http.get<any>(environment.baseUrl + 'api/employee');
  }
}
