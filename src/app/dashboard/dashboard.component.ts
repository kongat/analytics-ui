import { Component, OnInit } from '@angular/core';
import { UserModel } from '../core/models/user.model';
import { AuthService } from '../core/services/auth.service';
import { ApiService } from '../core/services/api.service';
import { Color, LegendPosition, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import { Subject, takeUntil } from 'rxjs';
import { EmployeeModel } from '../core/models/employee.model';
import { MatTableModule } from '@angular/material/table';
import { MetricModel } from '../core/models/metric.model';
import { MatChipsModule } from '@angular/material/chips';
import { DashboardDialogComponent } from './dashboard-dialog/dashboard-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatButtonModule,NgxChartsModule,MatProgressSpinnerModule,MatCardModule,MatTabsModule,MatTableModule,MatChipsModule,MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject<void>();
  displayedColumns: string[] = ['firstName','lastName','status','healthStatus','metricDate',];
  employeeList: EmployeeModel[];
  employeeListWarning: EmployeeModel[] =[];
  employeeListCritical: EmployeeModel[]=[];
  employeeListNormal: EmployeeModel[]=[];
  // dataChart: ChartData[] = [];
  // avgPhysicalChart: Data[] = [{
  //   name:"Avg. Physical Data",
  //   value:0
  // }];
  // avgMentalChart: Data[] = [{
  //   name:"Avg. Mental Data",
  //   value:0
  // }];
  loading: boolean;
  below = LegendPosition.Below;
  //mentalScoreSum: number = 0;
  //physicalScoreSum: number = 0;
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Linear,
    domain: ['#7aa3e5'],
  };

  colorScheme1: Color = {
    domain: ['#5AA454'],
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Linear,
  };

  constructor(private apiService: ApiService,public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loadEmployees();
  }


  loadEmployees(){
    this.loading = true;
    this.apiService.getEmployees().subscribe(
      res => {
        this.loading = false;
        this.employeeList = res;
        res.map(
          e =>{
            if (e.metrics.length > 0){
              let metricWithValues = e.metrics.filter(m => m.physicalScore !== null)
              console.log(metricWithValues)
              if (metricWithValues.length > 0){
                let latest = metricWithValues.reduce(function (r, a) {
                  return r.createdAt > a.createdAt ? r : a;
                });
                if (latest.physicalScore <= 6){
                  this.employeeListNormal.push(e)
                }else if (latest.physicalScore <= 8){
                  this.employeeListWarning.push(e)
                }else{
                  this.employeeListCritical.push(e)
                }
              }

            }
          }
        )
        // this.employeeListWarning[0].emergency = 'Alert'
        // this.employeeListWarning[1].emergency = '-'
        // this.employeeListWarning[2].emergency = '-'
        //this.employeeListCritical[0].emergency = 'Passed Out'

      },
      err =>{
        this.loading = false;
      }
    );
  }

  openDashboardDialog(employee: EmployeeModel,latestMetric: MetricModel){
    const dialogRef = this.dialog.open(DashboardDialogComponent, {
      width: '1500px',
      data: {employee: employee,latest: latestMetric}
    });
  }

  // loadEmployeesPageable(page: number, size: number){
  //   this.apiService.getEmployeesPageable(page,size)
  //   .pipe(takeUntil(this.unsubscribe$))
  //   .subscribe(
  //     res => {
  //       this.loading = false;
  //       this.employeeList = res.data;
  //      },
  //     err => {
  //       this.loading = false;
  //     }
  //   )
  // }

   // options
   showXAxis: boolean = true;
   showYAxis: boolean = true;
   gradient: boolean = false;
   showLegend: boolean = true;
   showXAxisLabel: boolean = true;
   yAxisLabel: string = 'Employee';
   showYAxisLabel: boolean = true;
   xAxisLabel: string = 'Health Score';

   onSelect(data): void {

   }

   formatPercent(val) {
    if (val <= 100) {
      return val + '%';
    } else {
      return val
    }
  }

  test(){
    //let test = this.dataChart
    //test[0].series[0].value =10;
    //this.dataChart = [...test]
  }

  findLastMetricAvg(metrics: MetricModel[]): number {
    let metricWithValues = metrics.filter(m =>  m.physicalScore !== null)
    let latest = metricWithValues.reduce(function (r, a) {
      return r.createdAt > a.createdAt ? r : a;
    });
    return Math.round(latest.mentalScore + latest.physicalScore)/2;
  }

  findLastMetric(metrics: MetricModel[]): MetricModel {
    let metricWithValues = metrics.filter(m => m.physicalScore !== null)
    let latest = metricWithValues.reduce(function (r, a) {
      return r.createdAt > a.createdAt ? r : a;
    });
    return latest;
  }
}

export interface ChartData {
  name: string,
  series: Data[]
  id: string
}

export interface Data {
  name: string,
  value: number
}
