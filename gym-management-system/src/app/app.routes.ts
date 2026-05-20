import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'members',
        loadComponent: () => import('./pages/members/members.component').then(m => m.MembersComponent),
      },
      {
        path: 'members/:id',
        loadComponent: () => import('./pages/members/member-detail/member-detail.component').then(m => m.MemberDetailComponent),
      },
      {
        path: 'subscriptions',
        loadComponent: () => import('./pages/subscriptions/subscriptions.component').then(m => m.SubscriptionsComponent),
      },
      {
        path: 'attendance',
        loadComponent: () => import('./pages/attendance/attendance.component').then(m => m.AttendanceComponent),
      },
      {
        path: 'trainers',
        loadComponent: () => import('./pages/trainers/trainers.component').then(m => m.TrainersComponent),
      },
      {
        path: 'nutrition',
        loadComponent: () => import('./pages/nutrition/nutrition.component').then(m => m.NutritionComponent),
      },
      {
        path: 'store',
        loadComponent: () => import('./pages/store/store.component').then(m => m.StoreComponent),
      },
      {
        path: 'payments',
        loadComponent: () => import('./pages/payments/payments.component').then(m => m.PaymentsComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
      },
      {
        path: 'backup',
        loadComponent: () => import('./pages/backup/backup.component').then(m => m.BackupComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
