import { Component, OnInit } from '@angular/core';
import { UserModel } from '../core/models/user.model';
import { AuthService } from '../core/services/auth.service';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { ApiService } from '../core/services/api.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule,NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  user: UserModel;
  dataForChart: ChartData[] = [];

  constructor(
    private authService: AuthService,
    private apiService: ApiService
    ) {
    }

  ngOnInit(): void {
    this.user = this.authService.user;
    this.loadProducts()
  }

  logout() {
    this.authService.logout();
  }

  loadProducts(){
    this.apiService.getEmployees().subscribe(
      res => {
        this.dataForChart = res.data.map(
          e =>{
            let data: ChartData = {
              name: e.firstName + ' ' + e.lastName,
              value: 0,
              id: e.id
            };
            if (e.metrics.length > 0){
              let latest = e.metrics.reduce(function (r, a) {
                return r.date > a.date ? r : a;
              });
              data.value = latest.score
            }
            return data
          }
        )
      },
      err =>{
        console.log(err)
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
}

export interface ChartData {
  name: string,
  value: number,
  id: string
}

