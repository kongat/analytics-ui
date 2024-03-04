import { Component, OnInit } from '@angular/core';
import { UserModel } from '../core/models/user.model';
import { AuthService } from '../core/services/auth.service';
import { ApiService } from '../core/services/api.service';
import { Color, LegendPosition, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxChartsModule,MatProgressSpinnerModule,MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
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

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.loadEmployees()
  }


  loadEmployees(){
    this.loading = true;
    this.apiService.getEmployees().subscribe(
      res => {
        this.loading = false;
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
              id: e.id
            };
            if (e.metrics.length > 0){
              let latest = e.metrics.reduce(function (r, a) {
                return r.date > a.date ? r : a;
              });
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
        this.dataChart.sort((firstEmployee, secondEmployee) =>
          (firstEmployee.series[0].value + firstEmployee.series[1].value)/2 - (secondEmployee.series[0].value + secondEmployee.series[1].value)/2
        )
      },
      err =>{
        console.log(err)
        this.loading = false;
      }
    );
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
     console.log('Item clicked', JSON.parse(JSON.stringify(data)));
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
    console.log(this.dataChart)
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
