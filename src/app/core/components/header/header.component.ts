import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import {MatBadgeModule} from '@angular/material/badge';
import { PassoutEvent } from '../../models/passout-event.model';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { NotificationEvent, SosEvent } from '../../models/sos-event.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule,RouterModule,MatBadgeModule, MatListModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  user: UserModel;

  @Input() notificationEvents: NotificationEvent[]=[];
  @Output() eventToResolve = new EventEmitter<any>();

  constructor(private authService: AuthService){
    this.user = this.authService.user;
  }

  logout() {
    this.authService.logout();
  }

  resolveEvent(event: NotificationEvent){
    this.eventToResolve.emit(event)
  }

}
