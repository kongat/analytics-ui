import { Component, Inject, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { PassoutEvent } from '../../../core/models/passout-event.model';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { ApiService } from '../../../core/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationEvent, SosEvent } from '../../../core/models/sos-event.model';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarModule, CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  snackBarRef = inject(MatSnackBarRef);


  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, private apiService: ApiService, private dialog: MatDialog, private notificationService: NotificationService) {
    console.log(data.message)
    this.snackBarRef.afterDismissed().subscribe(res => {
      if(res.dismissedByAction){
        this.notificationService.setNotificationEvent(data.event)
      }
    })
   }
}
