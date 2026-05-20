import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-dark-900 p-4">
      <div class="w-full max-w-md">
        <!-- Logo & Title -->
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="material-icons text-4xl text-white">fitness_center</span>
          </div>
          <h1 class="text-3xl font-bold text-white">نظام إدارة النادي</h1>
          <p class="text-dark-400 mt-2">قم بتسجيل الدخول للمتابعة</p>
        </div>

        <!-- Login Form -->
        <div class="bg-dark-800 rounded-2xl border border-dark-700 p-8">
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Username -->
            <div>
              <label class="block text-sm font-medium text-dark-300 mb-2">اسم المستخدم</label>
              <div class="relative">
                <span class="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">person</span>
                <input
                  type="text"
                  [(ngModel)]="username"
                  name="username"
                  class="w-full bg-dark-700 border border-dark-600 rounded-lg py-3 pr-12 pl-4 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="أدخل اسم المستخدم"
                  required
                  autofocus
                >
              </div>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-dark-300 mb-2">كلمة المرور</label>
              <div class="relative">
                <span class="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">lock</span>
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="password"
                  name="password"
                  class="w-full bg-dark-700 border border-dark-600 rounded-lg py-3 pr-12 pl-12 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="أدخل كلمة المرور"
                  required
                >
                <button
                  type="button"
                  (click)="showPassword = !showPassword"
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                >
                  <span class="material-icons text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div *ngIf="error" class="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-400 text-sm text-center">
              {{ error }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="isLoading"
              class="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span class="material-icons text-xl" *ngIf="!isLoading">login</span>
              <span *ngIf="isLoading" class="animate-spin material-icons text-xl">refresh</span>
              {{ isLoading ? 'جاري الدخول...' : 'تسجيل الدخول' }}
            </button>
          </form>

          <!-- Default Credentials Hint -->
          <div class="mt-6 pt-6 border-t border-dark-700 text-center">
            <p class="text-dark-400 text-xs">البيانات الافتراضية: Admin / Admin</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  isLoading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.username || !this.password) {
      this.error = 'يرجى إدخال اسم المستخدم وكلمة المرور';
      return;
    }

    this.isLoading = true;
    this.error = '';

    const result = await this.authService.login(this.username, this.password);

    if (result.success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.error = result.error || 'حدث خطأ غير متوقع';
    }

    this.isLoading = false;
  }
}
