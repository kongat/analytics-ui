import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserModel } from '../../core/models/user.model';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [MatButtonModule,MatDialogModule,MatFormFieldModule,FormsModule,MatInputModule,MatSelectModule ],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent implements OnInit{
  roles: string[] = ["ADMIN","EMPLOYEE","MANAGER"]
  user:UserModel = {
    userId: null,
    role: null,
    createdAt: null,
    username: null,
    employee:null
  };
  title: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data:UserModel){

  }
  ngOnInit(): void {
    this.user = this.data ? Object.assign({}, this.data) : this.user;
    this.title = this.user.userId ? 'Edit User' : 'Add User'
  }

}
