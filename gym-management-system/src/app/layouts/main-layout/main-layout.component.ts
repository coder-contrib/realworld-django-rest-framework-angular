import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="h-screen flex overflow-hidden bg-dark-900">
      <!-- Sidebar -->
      <aside class="w-64 bg-dark-800 border-l border-dark-700 flex flex-col">
        <!-- Logo -->
        <div class="p-4 border-b border-dark-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span class="material-icons text-white">fitness_center</span>
            </div>
            <div>
              <h1 class="font-bold text-white text-sm">إدارة النادي</h1>
              <p class="text-dark-400 text-xs">نظام احترافي</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <a
            *ngFor="let item of navItems"
            [routerLink]="item.route"
            routerLinkActive="bg-primary-600/10 text-primary-500 border-primary-500"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-dark-300 hover:text-white hover:bg-dark-700 transition-colors border border-transparent"
          >
            <span class="material-icons text-xl">{{ item.icon }}</span>
            <span class="text-sm font-medium">{{ item.label }}</span>
          </a>
        </nav>

        <!-- User Info -->
        <div class="p-4 border-t border-dark-700">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-dark-600 rounded-full flex items-center justify-center">
              <span class="material-icons text-dark-300 text-lg">person</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white text-sm font-medium truncate">{{ currentUser?.fullName }}</p>
              <p class="text-dark-400 text-xs">{{ getRoleLabel(currentUser?.role) }}</p>
            </div>
            <button
              (click)="logout()"
              class="text-dark-400 hover:text-red-500 transition-colors"
              title="تسجيل الخروج"
            >
              <span class="material-icons text-xl">logout</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-hidden">
        <!-- Top Bar -->
        <header class="h-16 bg-dark-800 border-b border-dark-700 flex items-center justify-between px-6">
          <div class="flex items-center gap-4">
            <h2 class="text-lg font-bold text-white">{{ getPageTitle() }}</h2>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-dark-400 text-sm">{{ currentDate }}</span>
            <button class="w-9 h-9 bg-dark-700 rounded-lg flex items-center justify-center text-dark-300 hover:text-white transition-colors">
              <span class="material-icons text-xl">notifications</span>
            </button>
          </div>
        </header>

        <!-- Page Content -->
        <div class="h-[calc(100vh-4rem)] overflow-y-auto">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
})
export class MainLayoutComponent {
  navItems: NavItem[] = [
    { icon: 'dashboard', label: 'لوحة التحكم', route: '/dashboard' },
    { icon: 'people', label: 'الأعضاء', route: '/members' },
    { icon: 'card_membership', label: 'الاشتراكات', route: '/subscriptions' },
    { icon: 'qr_code_scanner', label: 'الحضور', route: '/attendance' },
    { icon: 'sports_martial_arts', label: 'المدربين', route: '/trainers' },
    { icon: 'restaurant', label: 'التغذية والتدريب', route: '/nutrition' },
    { icon: 'store', label: 'المتجر', route: '/store' },
    { icon: 'payments', label: 'المدفوعات', route: '/payments' },
    { icon: 'backup', label: 'النسخ الاحتياطي', route: '/backup' },
    { icon: 'settings', label: 'الإعدادات', route: '/settings' },
  ];

  currentDate = new Date().toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  get currentUser() {
    return this.authService.currentUser;
  }

  constructor(private authService: AuthService, private router: Router) {}

  getRoleLabel(role?: string): string {
    const roles: Record<string, string> = {
      admin: 'مدير النظام',
      reception: 'استقبال',
      trainer: 'مدرب',
      accountant: 'محاسب',
    };
    return roles[role || ''] || role || '';
  }

  getPageTitle(): string {
    const url = this.router.url;
    const titles: Record<string, string> = {
      '/dashboard': 'لوحة التحكم',
      '/members': 'إدارة الأعضاء',
      '/subscriptions': 'إدارة الاشتراكات',
      '/attendance': 'تسجيل الحضور',
      '/trainers': 'إدارة المدربين',
      '/nutrition': 'التغذية والتدريب',
      '/store': 'المتجر',
      '/payments': 'المدفوعات',
      '/backup': 'النسخ الاحتياطي',
      '/settings': 'الإعدادات',
    };
    return titles[url] || 'لوحة التحكم';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
