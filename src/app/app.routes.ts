import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component')
      .then(c => c.LoginComponent)
  },
  {
    path: 'change-pass',
    loadComponent: () => import('./change-pass/change-pass.component')
      .then(c => c.ChangePassComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users.component')
      .then(c => c.UsersComponent)
  },
  {
    path: 'employees',
    loadComponent: () => import('./employees/employees.component')
      .then(c => c.EmployeesComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component')
      .then(c => c.DashboardComponent)
  },
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: '**', redirectTo: 'dashboard', pathMatch: 'full'},
];
