import { Injectable } from '@angular/core';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PassoutEvent } from '../models/passout-event.model';
import { NotificationEvent } from '../models/sos-event.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationEventSource = new BehaviorSubject<NotificationEvent>(null);

  // Step 2: Expose the BehaviorSubject as an Observable
  notificationEvent$ = this.notificationEventSource.asObservable();

  constructor(private readonly snackBar: MatSnackBar) { }

  setNotificationEvent(e: NotificationEvent) {
    this.notificationEventSource.next(e);
  }

  success(message: string) {
    this.openSnackBar(message, 'success', 'success-snackbar');
  }

  error(message: string) {
    this.openSnackBar(message, 'error', 'error-snackbar');
  }

  passout(message: string, event: NotificationEvent) {
    this.openSnackBar(message, 'resolve', 'error-snackbar',15000,event);
  }

  sos(message: string,event: NotificationEvent) {
    this.openSnackBar(message, 'resolve', 'warn-snackbar',15000,event);
  }

  openSnackBar(
    message: string,
    action: string,
    className = '',
    duration = 3000,
    event?: any

  ) {
    this.snackBar.openFromComponent(NotificationComponent,{
      duration: duration,
      panelClass: [className],
      data: {message, action, event},
      verticalPosition: 'bottom',
      horizontalPosition: 'end'
    });
  }
}
