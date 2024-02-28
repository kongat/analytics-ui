import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserModel } from '../core/models/user.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageEvent,MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatCardModule, MatTableModule,CommonModule,MatProgressSpinnerModule,MatPaginatorModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, OnDestroy{
  private unsubscribe$: Subject<void> = new Subject<void>();
  pageSize: number = 10;
  pageIndex: number = 0;
  length: number = 0;
  loading: boolean = false;
  users$: Observable<UserModel[]>;
  usersList: UserModel[];
  displayedColumns: string[] = ['username','createdAt','roles'];

  constructor(private apiService: ApiService){}

  ngOnInit(): void {
    //this.loadUsers()
    this.loadUsersPageable(this.pageIndex,this.pageSize);
  }

  loadUsers(){
    this.users$ = this.apiService.getUsers()
  }

  loadUsersPageable(page: number, size: number){
    this.loading = true;
    this.apiService.getUsersPageable(page,size)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      res => {
        this.loading = false;
        this.usersList = res.data;
        this.length = res.totalElements;
      },
      err => {
        this.loading = false;
      }
    )
  }

  handlePageEvent(e: PageEvent) {
    console.log(e)
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadUsersPageable(e.pageIndex, e.pageSize)
  }

  trackByFn(index: number, item: UserModel) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
