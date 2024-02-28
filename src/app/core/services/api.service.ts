import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { EmployeeModel } from '../models/employee.model';
import { UserModel } from '../models/user.model';
import {  map } from 'rxjs';
import {  delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(environment.baseUrl + 'signin', { username, password });
  }

  getEmployees() {
    return this.http.get<Result<EmployeeModel[]>>(environment.baseUrl + 'api/employee').pipe(
      delay(1000),
      map(res => res.data)
    );
  }

  getEmployeesPageable(page: number, size: number) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', size.toString());
    return this.http.get<ResultPageable<EmployeeModel[]>>(environment.baseUrl + 'api/employee-pageable',{params}).pipe(
      delay(1000),
      // map(res => res.data)
    );
  }

  getUsers() {
    return this.http.get<Result<UserModel[]>>(environment.baseUrl + 'api/user').pipe(
      delay(1000),
      map(res => res.data)
    );
  }

  getUsersPageable(page: number, size: number) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', size.toString());
    return this.http.get<ResultPageable<UserModel[]>>(environment.baseUrl + 'api/user-pageable',{params}).pipe(
      delay(1000),
    );
  }

  getRoot() {
    return this.http.get<any>(environment.baseUrl);
  }

  changePass(oldPassword: string, newPassword: string, newPasswordRepeat:string) {
    return this.http.post<any>(environment.baseUrl + 'api/change-pass' , {oldPassword,newPassword,newPasswordRepeat});
  }
}

export interface Result<T>{
  data: T
}

export interface ResultPageable<T>{
  data: T,
  totalElements: number;
}
