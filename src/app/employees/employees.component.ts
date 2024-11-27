import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { EmployeeModel } from '../core/models/employee.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MetricModel } from '../core/models/metric.model';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../core/services/notification.service';
import { InfoDialogComponent } from '../shared/components/info-dialog/info-dialog.component';
import { UserModel } from '../core/models/user.model';


@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [MatTooltipModule,MatPaginatorModule,MatCardModule,CommonModule,MatTableModule,MatChipsModule,MatProgressSpinnerModule, MatIconModule,MatButtonModule,],
  providers:[DatePipe],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit, OnDestroy{
  private unsubscribe$: Subject<void> = new Subject<void>();
  pageSize: number = 10;
  pageIndex: number = 0;
  length: number = 0;
  loading: boolean = false;
  usersEmployeeRole: UserModel[];
  employeeList: EmployeeModel[];
  displayedColumns: string[] = ['firstName','lastName','status','birthDate','gender','lastPhysicalMetric','lastMentalMetric','actions','spinner'];
  rowLoading: {id: string, loading: boolean}[] = []

  constructor(private apiService: ApiService,public dialog: MatDialog, private notificationService: NotificationService,private datePipe: DatePipe,){}

  ngOnInit(): void {
    //this.loadEmployees();
    this.loadEmployeesPageable(this.pageIndex,this.pageSize,'initial');
    this.getUserEmployeeRole()
  }


  loadEmployeesPageable(page: number, size: number, previousAction: 'initial' | 'edit' | 'create' | 'delete',index?: number){
    this.loading = previousAction == 'initial' ? true : false;
    this.apiService.getEmployeesPageable(page,size)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      res => {
        res.data.map(u => {
          this.rowLoading.push({id: u.employeeId,loading: false})
        })
        this.loading = false;
        this.employeeList = res.data;
        this.length = res.totalElements;
        switch(previousAction) {
          case 'create': {
            this.notificationService.success('Employee was created successfully.')
             break;
          }
          case 'edit': {
            this.rowLoading[index].loading = false;
            this.notificationService.success('Employee was updated successfully.')
             break;
          }
          case 'delete': {
            this.rowLoading[index].loading = false;
            this.notificationService.success('Employee was deleted successfully.')
            break;
         }
          default: {
             //statements;
             break;
          }
      }},
      err => {
        this.loading = false;
      }
    )
  }

  findLastMetric(metrics: MetricModel[]): MetricModel {
      let metricWithValues = metrics.filter(m => m.physicalScore !== null)
      let latest = metricWithValues.reduce(function (r, a) {
        return r.createdAt > a.createdAt ? r : a;
      });
      console.log(latest)
      return latest;
  }

  handlePageEvent(e: PageEvent) {
    console.log(e)
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadEmployeesPageable(e.pageIndex, e.pageSize,'initial')
  }

  trackByFn(index: number, item: EmployeeModel) {
    return item.employeeId;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  openEmployeeDialog(employee?: EmployeeModel,index?: number){

    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '500px',
      data: {employee: employee, usersEmployeeRole: this.usersEmployeeRole}
    });

    dialogRef.afterClosed().subscribe((result:EmployeeModel) => {
      if(result){
        result.employeeId ? this.updateEmployee(result,index) : this.createEmployee(result);
      }
    });

  }


  updateEmployee(employee: EmployeeModel, index: number){
    this.rowLoading[index].loading = true;
    this.apiService.updateEmployee(employee).subscribe(
      res => {
        this.loadEmployeesPageable(this.pageIndex, this.pageSize,'edit',index)
      },
      err => {
        this.rowLoading[index].loading = false;
        this.notificationService.error('Employee update failed.')
      }
    )
  }


  createEmployee(employee: EmployeeModel){
    this.apiService.createEmployee(employee)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      res => {
        this.loadEmployeesPageable(this.pageIndex, this.pageSize,'create')

      },
      err => {
        this.notificationService.error('Employee creation failed.')
      }
    )
  }

  openDeleteDialog(id:number,index: number){
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      data: {
        title:'Delete Employee',
        description:'Are you sure you want to delete the selected Employee?'

      },
      width: '500px'
    });
    dialogRef.afterClosed().subscribe( result => {
      if(result){
        this.deleteEmployee(id,index)
      }
    })
  }

  deleteEmployee(id: number,index: number) {
    this.rowLoading[index].loading = true;
    this.apiService.deleteEmployee(id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      res => {
        if(index == 0 && this.employeeList.length == 1 && this.pageIndex > 0){
          this.pageIndex -= 1;
        }
        this.loadEmployeesPageable(this.pageIndex, this.pageSize,'delete',index)
      },
      err => {
        this.rowLoading[index].loading = false;
        this.notificationService.error('Employee deletion failed.')
      }
    )
  }

  getUserEmployeeRole() {
    this.apiService.getUsersWithEmployeeRole()
      .subscribe(
        res => {
          this.usersEmployeeRole = res
        }
      )
  }




}
