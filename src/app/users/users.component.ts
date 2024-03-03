import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserModel } from '../core/models/user.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageEvent,MatPaginatorModule } from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationService } from '../core/services/notification.service';
import { InfoDialogComponent } from '../shared/components/info-dialog/info-dialog.component';
import { UserPassDialogComponent } from './user-pass-dialog/user-pass-dialog.component';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatTooltipModule,MatIconModule,MatChipsModule,MatDialogModule,MatCardModule,MatButtonModule, MatTableModule,CommonModule,MatProgressSpinnerModule,MatPaginatorModule],
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
  rowLoading: {id: string, loading: boolean}[] = []
  displayedColumns: string[] = ['username','role','createdAt','actions','spinner'];

  constructor(private apiService: ApiService,public dialog: MatDialog, private notificationService: NotificationService){}

  ngOnInit(): void {
    //this.loadUsers()
    this.loadUsersPageable(this.pageIndex,this.pageSize,'initial');
  }

  loadUsers(){
    this.users$ = this.apiService.getUsers()
  }

  loadUsersPageable(page: number, size: number, previousAction: 'initial' | 'edit' | 'create' | 'delete',index?: number){
    this.loading = previousAction == 'initial' ? true : false;
    this.apiService.getUsersPageable(page,size)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      res => {
        res.data.map(u => {
          this.rowLoading.push({id: u.id,loading: false})
        })
        this.loading = false;
        this.usersList = res.data;
        this.length = res.totalElements;
        switch(previousAction) {
          case 'create': {
            this.notificationService.success('User was created successfully.')
             break;
          }
          case 'edit': {
            this.rowLoading[index].loading = false;
            this.notificationService.success('User was updated successfully.')
             break;
          }
          case 'delete': {
            this.rowLoading[index].loading = false;
            this.notificationService.success('User was deleted successfully.')
            break;
         }
          default: {
             //statements;
             break;
          }
       }
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
    this.loadUsersPageable(e.pageIndex, e.pageSize,'initial')
  }

  trackByFn(index: number, item: UserModel) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openUserDialog(user?: UserModel,index?: number){
    console.log(user)
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: user
    });

    dialogRef.afterClosed().subscribe((result:UserModel) => {
      if(result){
        result.id ? this.updateUser(result,index) : this.createUser(result);
      }
    });

  }

  updateUser(user: UserModel, index: number){
    this.rowLoading[index].loading = true;
    this.apiService.updateUser(user).subscribe(
      res => {
        this.loadUsersPageable(this.pageIndex, this.pageSize,'edit',index)
      },
      err => {
        this.rowLoading[index].loading = false;
        this.notificationService.error('User update failed.')
      }
    )
  }

  createUser(user: UserModel){
    this.apiService.createUser(user)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      res => {
        this.loadUsersPageable(this.pageIndex, this.pageSize,'create')

      },
      err => {
        this.notificationService.success('User creation failed.')
      }
    )
  }

  changeUserPass(req:{id: string, newPassword: string, newPaswordRepeat: string},index:number){
    this.rowLoading[index].loading = true;
    this.apiService.changeUserPass(req)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      res => {
        this.loadUsersPageable(this.pageIndex, this.pageSize,'edit')

      },
      err => {
        this.notificationService.error('User password update failed.')
      }
    )
  }

  deleteUser(id: number,index: number) {
    this.rowLoading[index].loading = true;
    this.apiService.deleteUser(id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      res => {
        if(index == 0 && this.usersList.length == 1 && this.pageIndex > 0){
          this.pageIndex -= 1;
        }
        this.loadUsersPageable(this.pageIndex, this.pageSize,'delete',index)

      },
      err => {
        this.rowLoading[index].loading = false;
        this.notificationService.error('User deletion failed.')
      }
    )
  }

  openDeleteDialog(id:number,index: number){
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      data: {
        title:'Delete User',
        description:'Are you sure you want to delete the selected User?'

      },
      width: '500px'
    });
    dialogRef.afterClosed().subscribe( result => {
      if(result){
        this.deleteUser(id,index)
      }
    })
  }

  openUserPassDialog(user: UserModel,index:number){
    console.log(user)
    const dialogRef = this.dialog.open(UserPassDialogComponent, {
        width: '500px',
        data: user
    });
    dialogRef.afterClosed().subscribe( (result: {id: string, newPassword: string, newPaswordRepeat: string}) => {
      if(result){
        this.changeUserPass(result,index)
      }
    })
  }
}
