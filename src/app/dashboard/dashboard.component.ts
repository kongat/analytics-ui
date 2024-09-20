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
  displayedColumns: string[] = ['firstName','lastName','status','healthStatus','room','emergency','view'];
  employeeList: EmployeeModel[];
  employeeListWarning: EmployeeModel[] =[];
  employeeListCritical: EmployeeModel[]=[];
  dataChart: ChartData[] = [];
  avgPhysicalChart: Data[] = [{
    name:"Avg. Physical Data",
    value:0
  }];
  avgMentalChart: Data[] = [{
    name:"Avg. Mental Data",
    value:0
  }];
  loading: boolean;
  below = LegendPosition.Below;
  mentalScoreSum: number = 0;
  physicalScoreSum: number = 0;
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
    this.loadEmployees()
  }


  loadEmployees(){
    this.loading = true;
    this.apiService.getEmployees().subscribe(
      res => {
        this.loading = false;
        this.employeeList = res;
        this.dataChart = res.map(
          e =>{

            let data: ChartData = {
              name: e.firstName + ' ' + e.lastName,
              series: [
                {
                  name: "Physical",
                  value:0
                },
                {
                  name: "Mental",
                  value:0
                }
              ],
              id: e.employeeId
            };
            if (e.metrics.length > 0){
              let latest = e.metrics.reduce(function (r, a) {
                return r.date > a.date ? r : a;
              });
              if ((latest.mentalScore + latest.physicalScore)/2 < 60){
                this.employeeListCritical.push(e)
              }else{
                this.employeeListWarning.push(e)
              }
              data.series[0].value= latest.physicalScore
              data.series[1].value= latest.mentalScore
            }
            this.physicalScoreSum += data.series[0].value;
            this.mentalScoreSum += data.series[1].value;
            this.avgPhysicalChart[0].value = Math.round(this.physicalScoreSum/res.length);
            this.avgMentalChart[0].value = Math.round(this.mentalScoreSum/res.length);
            return data
          }
        )
        this.employeeListWarning[0].emergency = 'Alert'
        this.employeeListWarning[1].emergency = '-'
        this.employeeListWarning[2].emergency = '-'
        this.employeeListCritical[0].emergency = 'Passed Out'
        this.dataChart.sort((firstEmployee, secondEmployee) =>
          (firstEmployee.series[0].value + firstEmployee.series[1].value)/2 - (secondEmployee.series[0].value + secondEmployee.series[1].value)/2
        )
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

  loadEmployeesPageable(page: number, size: number){
    this.apiService.getEmployeesPageable(page,size)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      res => {
        this.loading = false;
        this.employeeList = res.data;
       },
      err => {
        this.loading = false;
      }
    )
  }

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
    let test = this.dataChart
    test[0].series[0].value =10;
    this.dataChart = [...test]
  }

  findLastMetricAvg(metrics: MetricModel[]): number {
    let latest = metrics.reduce(function (r, a) {
      return r.date > a.date ? r : a;
    });
    return Math.round(latest.mentalScore + latest.physicalScore)/2;
  }

  findLastMetric(metrics: MetricModel[]): MetricModel {
    let latest = metrics.reduce(function (r, a) {
      return r.date > a.date ? r : a;
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
