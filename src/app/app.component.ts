import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ApiService } from './core/services/api.service';
import { HeaderComponent } from './core/components/header/header.component';
import { CommonModule } from '@angular/common';
import { SocketService } from './core/services/socket.service';
import { NotificationService } from './core/services/notification.service';
import { EmployeeModel } from './core/models/employee.model';
import { NotificationEvent, SosEvent } from './core/models/sos-event.model';
import { InfoDialogComponent } from './shared/components/info-dialog/info-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PassoutEvent } from './core/models/passout-event.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,CommonModule ],
  providers:[],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  messages: string[] = [];
  passoutEvents: PassoutEvent[] = [];
  sosEvents: SosEvent[] = [];
  notificationEvents: NotificationEvent[] = [];

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    private socketService: SocketService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private router: Router){
      this.socketService.setupSocketConnection()
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  ngOnInit(): void {
    this.fetchUnresolvedEvents();
    this.authService.isLoggedIn$.subscribe(res => {
      if(!res){
        this.router.navigate(['/login']);
      }else{
        this.router.navigate(['/']);
      }
    })

    this.notificationService.notificationEvent$.subscribe(
      res => {
        console.log(res)
        if(res){
          this.openNotificationModal(res)
        }
      }
    )

    this.socketService.getSosMessage().subscribe((sosEvent: SosEvent) => {
      const notificationEvent: NotificationEvent = {
        data: sosEvent,
        type: 'sos'
      }
      this.notificationService.sos(sosEvent.Employee.firstName + " "+ sosEvent.Employee.lastName +' '+'needs help.', notificationEvent);
      this.notificationEvents.unshift(notificationEvent);
    });

    this.socketService.getPassoutMessage().subscribe((passoutEvent: PassoutEvent) => {
      const notificationEvent: NotificationEvent = {
        data: passoutEvent,
        type: 'passout'
      }
      this.notificationService.passout(passoutEvent.Employee.firstName + " "+ passoutEvent.Employee.lastName +' '+'has passed out.',notificationEvent);
      this.notificationEvents.unshift(notificationEvent);
    });
  }

  fetchUnresolvedEvents() {
    const passoutEvents$ = this.apiService.getUnresolvedPassoutEvents();
    const sosEvents$ = this.apiService.getUnresolvedSosEvents();

    // Use forkJoin to wait for all requests to complete
    forkJoin([passoutEvents$, sosEvents$]).subscribe(
      ([passoutEvents, sosEvents]) => {

       passoutEvents.forEach(p => {
          const notificationEvent: NotificationEvent = {
            data: p,
            type: 'passout'
          }
          this.notificationEvents.push(notificationEvent)
        })

        sosEvents.forEach(s => {
          const notificationEvent: NotificationEvent = {
            data: s,
            type: 'sos'
          }
          this.notificationEvents.push(notificationEvent)
        })

        this.notificationEvents.sort((a, b) => {
          const dateA = new Date(a.data.createdAt).getTime();
          const dateB = new Date(b.data.createdAt).getTime();
          return dateB - dateA; // Descending order
        });
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }


  openNotificationModal(eventToResolve: NotificationEvent){
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      data: {
        title:'Resolve Issue',
        description:'Are you sure you want to resolve this Issue?'

      },
      width: '500px'
    });
    dialogRef.afterClosed().subscribe( result => {
      if(result){
        if(eventToResolve.type == 'passout'){
          this.resolvePassoutEvent(eventToResolve.data)
        }else if (eventToResolve.type == 'sos'){
          this.resolveSosEvent(eventToResolve.data)
        }

      }
    })
  }

  resolvePassoutEvent(data: PassoutEvent){
    data.value = false;
    this.apiService.updatePassoutEvent(data).subscribe(
      res => {
        this.notificationService.success('The issue was resolved successfully.');
        this.notificationEvents = this.notificationEvents.filter(e => !(e.data.employeeId === data.employeeId && e.data.createdAt === data.createdAt))
      },
      err => {
      }
    )
  }

  resolveSosEvent(data: PassoutEvent){
    data.value = false;
    this.apiService.updateSosEvent(data).subscribe(
      res => {
        this.notificationService.success('The issue was resolved successfully.');
        this.notificationEvents = this.notificationEvents.filter(e => !(e.data.employeeId === data.employeeId && e.data.createdAt === data.createdAt))
      },
      err => {
      }
    )
  }


}
