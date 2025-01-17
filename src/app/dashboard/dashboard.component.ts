import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { Overall } from '../core/models/overall.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatButtonModule,NgxChartsModule,MatProgressSpinnerModule,MatCardModule,MatTabsModule,MatTableModule,MatChipsModule,MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  displayedColumns: string[] = ['firstName','lastName','status','healthStatus','metricDate',];
  employeeList: EmployeeModel[];
  employeeListWarning: EmployeeModel[] =[];
  employeeListCritical: EmployeeModel[]=[];
  employeeListNormal: EmployeeModel[]=[];
  // dataChart: ChartData[] = [];
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
  intervalId: any;
  avgResponse: Overall;

  constructor(private apiService: ApiService,public dialog: MatDialog) {
  }

  ngOnDestroy(): void {
      // Clear the interval when the component is destroyed
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadAverage();

    this.intervalId = setInterval(() => {
      this.employeeListCritical = [];
      this.employeeListNormal = [];
      this.employeeListWarning = [];
      this.loadEmployees();
      this.loadAverage();

    }, 600000); // 60000ms = 1 minute
    console.log('refresh')
  }


  loadEmployees(){
    this.loading = true;
    this.apiService.getEmployees().subscribe(
      res => {
        console.log(res)
        this.loading = false;
        this.employeeList = res;
        res.map(
          e =>{
            if (e.metrics.length > 0){

              let latest = this.findLastMetric(e.metrics);
              if (latest.physicalScore <= 6){
                this.employeeListNormal.push(e)
              }else if (latest.physicalScore <= 8){
                this.employeeListWarning.push(e)
              }else{
                this.employeeListCritical.push(e)
              }

              // let metricWithValues = e.metrics.filter(m => m.physicalScore !== null)

              // if (metricWithValues.length > 0){
              //   let latest = metricWithValues.reduce(function (r, a) {
              //     return r.createdAt > a.createdAt ? r : a;
              //   });
              //   if (latest.physicalScore <= 6){
              //     console.log(latest.physicalScore)
              //     this.employeeListNormal.push(e)
              //   }else if (latest.physicalScore <= 8){
              //     this.employeeListWarning.push(e)
              //   }else{
              //     this.employeeListCritical.push(e)
              //   }
              // }

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

  loadAverage(){
    this.apiService.getOverall().subscribe(
      res => {
        this.avgResponse = res
        if(res.avgMentalScore && res.avgMentalScore){
          this.avgMentalChart[0].value = (10 - res.avgMentalScore) *10;
          this.avgPhysicalChart[0].value = (10-res.avgPhysicalScore) * 10;
        }else{
          this.avgMentalChart[0].value = 0;
          this.avgPhysicalChart[0].value = 0;
        }

      },
      err => {

      }
    )
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

  findLastMetric(metrics: MetricModel[]): MetricModel {
    let latest = metrics[0];
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
