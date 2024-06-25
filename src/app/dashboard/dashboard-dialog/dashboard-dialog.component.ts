import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EmployeeModel } from '../../core/models/employee.model';
import { MetricModel } from '../../core/models/metric.model';

@Component({
  selector: 'app-dashboard-dialog',
  standalone: true,
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './dashboard-dialog.component.html',
  styleUrl: './dashboard-dialog.component.scss'
})
export class DashboardDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data:{employee: EmployeeModel, metric: MetricModel}, private dialogRef: MatDialogRef<DashboardDialogComponent >){}
}
