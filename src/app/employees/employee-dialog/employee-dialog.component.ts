import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EmployeeModel } from '../../core/models/employee.model';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { UserModel } from '../../core/models/user.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [MatDatepickerModule,MatButtonModule,MatDialogModule,MatFormFieldModule,FormsModule,MatInputModule,MatSelectModule, CommonModule],
  templateUrl: './employee-dialog.component.html',
  styleUrl: './employee-dialog.component.scss',
  providers:[provideNativeDateAdapter()]
})
export class EmployeeDialogComponent implements OnInit{
  title: string;
  employee: EmployeeModel = {
    firstName: null,
    id: null,
    lastName: null,
    birthDate: null,
    status: null,
    gender: null,
    metrics: [],
    userId: null
  };
  genders: string[] = ['MALE','FEMALE','OTHER'];
  availableUsers: UserModel[]

  constructor(@Inject(MAT_DIALOG_DATA) public data:{employee: EmployeeModel,usersEmployeeRole: UserModel[]}, private dialogRef: MatDialogRef<EmployeeDialogComponent >){}



  ngOnInit(): void {
    this.employee = this.data.employee ? Object.assign({}, this.data.employee) : this.employee;
    this.title = this.employee.id ? 'Edit Employee' : 'Add Employee';
    this.availableUsers = this.data.usersEmployeeRole.filter(u => u.employee == null || u.id == this.employee.userId)
  }



closeDialog() {
  console.log(this.employee.birthDate)
  const d = new Date(this.employee.birthDate)
  this.employee.birthDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString();
  console.log(this.employee.birthDate)
  this.dialogRef.close(this.employee)
}



}
