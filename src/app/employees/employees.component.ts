import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { EmployeeModel } from '../core/models/employee.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MetricModel } from '../core/models/metric.model';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [MatPaginatorModule,MatCardModule,CommonModule,MatTableModule,MatChipsModule,MatProgressSpinnerModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit, OnDestroy{
  private unsubscribe$: Subject<void> = new Subject<void>();
  pageSize: number = 10;
  pageIndex: number = 0;
  length: number = 0;
  loading: boolean = false;
  employees$: Observable<EmployeeModel[]>;
  employeeList: EmployeeModel[];
  displayedColumns: string[] = ['firstName','lastName','status','birthDate','gender','lastPhysicalMetric','lastMentalMetric'];

  constructor(private apiService: ApiService){}

  ngOnInit(): void {
    //this.loadEmployees();
    this.loadEmployeesPageable(this.pageIndex,this.pageSize);
  }

  loadEmployees(){
    this.employees$ = this.apiService.getEmployees()
  }

  loadEmployeesPageable(page: number, size: number){
    this.loading = true;
    this.apiService.getEmployeesPageable(page,size)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      res => {
        this.loading = false;
        this.employeeList = res.data;
        this.length = res.totalElements;
      },
      err => {
        this.loading = false;
      }
    )
  }

  findLastMetric(metrics: MetricModel[]): MetricModel {
      let latest = metrics.reduce(function (r, a) {
        return r.date > a.date ? r : a;
      });
      return latest;
  }

  handlePageEvent(e: PageEvent) {
    console.log(e)
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadEmployeesPageable(e.pageIndex, e.pageSize)
  }

  trackByFn(index: number, item: EmployeeModel) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
