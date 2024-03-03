import { Component, Inject, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import { UserModel } from '../../core/models/user.model';

@Component({
  selector: 'app-user-pass-dialog',
  standalone: true,
  imports: [MatButtonModule,MatDialogModule,MatFormFieldModule,FormsModule,MatInputModule,],
  templateUrl: './user-pass-dialog.component.html',
  styleUrl: './user-pass-dialog.component.scss'
})
export class UserPassDialogComponent  implements OnInit{

  changePassReq = {
    id: '',
    newPassword: '',
    newPasswordRepeat: '',
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data:UserModel){

  }

  ngOnInit(): void {
    this.changePassReq.id = this.data.id;

  }
}
