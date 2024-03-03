import { Component, Inject, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  snackBarRef = inject(MatSnackBarRef);
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    console.log(data)
   }

}
