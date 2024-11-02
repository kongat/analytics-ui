import { Injectable } from '@angular/core';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private readonly snackBar: MatSnackBar) { }

  success(message: string) {
    this.openSnackBar(message, '', 'success-snackbar');
  }

  error(message: string) {
    this.openSnackBar(message, '', 'error-snackbar');
  }

  warn(message: string) {
    this.openSnackBar(message, '', 'warn-snackbar');
  }

  openSnackBar(
    message: string,
    action: string,
    className = '',
    duration = 10000
  ) {
    this.snackBar.openFromComponent(NotificationComponent,{
      duration: duration,
      panelClass: [className],
      data: message,
      verticalPosition: 'bottom',
      horizontalPosition: 'end'
    });
  }
}
