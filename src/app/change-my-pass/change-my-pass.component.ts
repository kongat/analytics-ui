import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { ApiService } from '../core/services/api.service';
import { UserModel } from '../core/models/user.model';

@Component({
  selector: 'app-my-change-pass',
  standalone: true,
  imports: [MatInputModule, MatCardModule, MatButtonModule,ReactiveFormsModule],
  templateUrl: './change-my-pass.component.html',
  styleUrl: './change-my-pass.component.scss'
})
export class ChangeMyPassComponent {
  user: UserModel;
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,

  ){

  }

  changePassForm = new FormGroup({
    oldPassword: new FormControl(null, Validators.required),
    newPassword: new FormControl(null, Validators.required),
    newPasswordRepeat: new FormControl(null, Validators.required),
  });

  onSubmit(){
    if (this.changePassForm.controls['oldPassword'].value && this.changePassForm.controls['newPassword'].value && this.changePassForm.controls['newPasswordRepeat'].value){
      this.apiService
        .changeMyPass(this.changePassForm.controls['oldPassword'].value, this.changePassForm.controls['newPassword'].value, this.changePassForm.controls['newPasswordRepeat'].value)
        .subscribe((response) => {
          this.notificationService.success('Password was updated successfully.');
        },
        err =>{
          this.notificationService.error('Password update failed.');
        }
        );
    }
  }

}
