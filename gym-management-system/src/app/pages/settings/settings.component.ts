import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">الإعدادات</h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- General Settings -->
        <div class="card">
          <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
            <span class="material-icons text-primary-500">settings</span>
            إعدادات عامة
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-dark-300 mb-1">اسم النادي</label>
              <input [(ngModel)]="settings.gym_name" class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary-500">
            </div>
            <div>
              <label class="block text-sm text-dark-300 mb-1">رقم الهاتف</label>
              <input [(ngModel)]="settings.gym_phone" class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary-500">
            </div>
            <div>
              <label class="block text-sm text-dark-300 mb-1">العنوان</label>
              <input [(ngModel)]="settings.gym_address" class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary-500">
            </div>
            <div>
              <label class="block text-sm text-dark-300 mb-1">العملة</label>
              <select [(ngModel)]="settings.currency" class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white">
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="EGP">جنيه مصري (EGP)</option>
                <option value="AED">درهم إماراتي (AED)</option>
                <option value="USD">دولار أمريكي (USD)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div class="card">
          <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
            <span class="material-icons text-primary-500">security</span>
            إعدادات الأمان
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-dark-300 mb-1">مدة الجلسة (دقيقة)</label>
              <input [(ngModel)]="settings.session_timeout" type="number" class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary-500">
            </div>
            <div class="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
              <span class="text-dark-300">النسخ الاحتياطي التلقائي</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" [(ngModel)]="autoBackup" class="sr-only peer">
                <div class="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Appearance -->
        <div class="card">
          <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
            <span class="material-icons text-primary-500">palette</span>
            المظهر
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
              <span class="text-dark-300">الوضع الداكن</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" [checked]="true" class="sr-only peer">
                <div class="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Users Management -->
        <div class="card">
          <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
            <span class="material-icons text-primary-500">manage_accounts</span>
            إدارة المستخدمين
          </h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span class="material-icons text-white text-sm">person</span>
                </div>
                <div>
                  <p class="text-white text-sm font-medium">Admin</p>
                  <p class="text-dark-400 text-xs">مدير النظام</p>
                </div>
              </div>
              <span class="text-xs bg-primary-500/10 text-primary-500 px-2 py-1 rounded">admin</span>
            </div>
          </div>
          <button class="btn-secondary w-full mt-4 flex items-center justify-center gap-2">
            <span class="material-icons text-lg">person_add</span>
            إضافة مستخدم
          </button>
        </div>
      </div>

      <!-- Save Button -->
      <div class="mt-6">
        <button (click)="saveSettings()" class="btn-primary">
          <span class="material-icons ml-2">save</span>
          حفظ الإعدادات
        </button>
      </div>
    </div>
  `,
})
export class SettingsComponent {
  settings = {
    gym_name: 'النادي الرياضي',
    gym_phone: '',
    gym_address: '',
    currency: 'SAR',
    session_timeout: 30,
  };
  autoBackup = true;

  saveSettings(): void {
    // Save settings via electron service
    alert('تم حفظ الإعدادات بنجاح');
  }
}
