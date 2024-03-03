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
      map(res => res.data)
    );
  }

  getEmployeesPageable(page: number, size: number) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', size.toString());
    return this.http.get<ResultPageable<EmployeeModel[]>>(environment.baseUrl + 'api/employee-pageable',{params}).pipe(
      // map(res => res.data)
    );
  }

  getUsers() {
    return this.http.get<Result<UserModel[]>>(environment.baseUrl + 'api/user').pipe(
      map(res => res.data)
    );
  }

  getUsersWithEmployeeRole() {
    return this.http.get<Result<UserModel[]>>(environment.baseUrl + 'api/user/employee').pipe(
      map(res => res.data)
    );
  }

  createUser(dto: UserModel) {
    return this.http.post<Result<UserModel>>(environment.baseUrl + 'api/user',dto).pipe(
      map(res => res.data)
    );
  }

  createEmployee(dto: EmployeeModel) {
    return this.http.post<Result<EmployeeModel>>(environment.baseUrl + 'api/employee',dto).pipe(
      map(res => res.data)
    );
  }

  updateUser(dto: UserModel) {
    return this.http.put<Result<UserModel>>(environment.baseUrl + 'api/user',dto).pipe(
      map(res => res.data)
    );
  }

  updateEmployee(dto: EmployeeModel) {
    return this.http.put<Result<EmployeeModel>>(environment.baseUrl + 'api/employee',dto).pipe(
      map(res => res.data)
    );
  }

  deleteUser(id: number) {
    return this.http.delete<Result<UserModel>>(environment.baseUrl + 'api/user/'+id ).pipe(
      map(res => res.data)
    );
  }

  deleteEmployee(id: number) {
    return this.http.delete<Result<EmployeeModel>>(environment.baseUrl + 'api/employee/'+id ).pipe(
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

  changeMyPass(oldPassword: string, newPassword: string, newPasswordRepeat:string,) {
    return this.http.put<any>(environment.baseUrl + 'api/change-my-pass' , {oldPassword,newPassword,newPasswordRepeat});
  }

  changeUserPass(req:{id: string, newPassword: string, newPaswordRepeat: string}) {
    return this.http.put<any>(environment.baseUrl + 'api/change-user-pass' , req);
  }
}

export interface Result<T>{
  data: T
}

export interface ResultPageable<T>{
  data: T,
  totalElements: number;
}
