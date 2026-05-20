import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectronService } from '../../core/services/electron.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Attendance Today -->
        <div class="stat-card">
          <div class="stat-icon bg-blue-500/10 text-blue-500">
            <span class="material-icons">groups</span>
          </div>
          <div>
            <div class="stat-value">{{ stats.attendanceToday }}</div>
            <div class="stat-label">الحضور اليوم</div>
          </div>
        </div>

        <!-- Expired Subscriptions -->
        <div class="stat-card">
          <div class="stat-icon bg-red-500/10 text-red-500">
            <span class="material-icons">event_busy</span>
          </div>
          <div>
            <div class="stat-value">{{ stats.expiredSubscriptions }}</div>
            <div class="stat-label">اشتراكات منتهية</div>
          </div>
        </div>

        <!-- Daily Revenue -->
        <div class="stat-card">
          <div class="stat-icon bg-green-500/10 text-green-500">
            <span class="material-icons">attach_money</span>
          </div>
          <div>
            <div class="stat-value">{{ stats.dailyRevenue | number }}</div>
            <div class="stat-label">إيرادات اليوم (ر.س)</div>
          </div>
        </div>

        <!-- Total Members -->
        <div class="stat-card">
          <div class="stat-icon bg-purple-500/10 text-purple-500">
            <span class="material-icons">person</span>
          </div>
          <div>
            <div class="stat-value">{{ stats.totalMembers }}</div>
            <div class="stat-label">إجمالي الأعضاء</div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Monthly Subscriptions Chart -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-white">المشتركين حسب الشهر</h3>
            <select
              class="bg-dark-700 border border-dark-600 rounded-lg px-3 py-1.5 text-sm text-white"
              (change)="onSubYearChange($event)"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
          <div class="h-64 flex items-end gap-2">
            <div
              *ngFor="let value of monthlySubscriptions; let i = index"
              class="flex-1 flex flex-col items-center gap-1"
            >
              <span class="text-xs text-dark-400">{{ value }}</span>
              <div
                class="w-full bg-primary-600 rounded-t-md transition-all duration-500"
                [style.height.%]="getBarHeight(value, monthlySubscriptions)"
              ></div>
              <span class="text-xs text-dark-400">{{ months[i] }}</span>
            </div>
          </div>
        </div>

        <!-- Monthly Revenue Chart -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-white">الإيرادات حسب الشهر</h3>
            <select
              class="bg-dark-700 border border-dark-600 rounded-lg px-3 py-1.5 text-sm text-white"
              (change)="onRevYearChange($event)"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
          <div class="h-64 flex items-end gap-2">
            <div
              *ngFor="let value of monthlyRevenue; let i = index"
              class="flex-1 flex flex-col items-center gap-1"
            >
              <span class="text-xs text-dark-400">{{ (value / 1000) | number:'1.0-0' }}k</span>
              <div
                class="w-full bg-green-500 rounded-t-md transition-all duration-500"
                [style.height.%]="getBarHeight(value, monthlyRevenue)"
              ></div>
              <span class="text-xs text-dark-400">{{ months[i] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  stats = { totalMembers: 0, attendanceToday: 0, expiredSubscriptions: 0, dailyRevenue: 0 };
  monthlySubscriptions: number[] = new Array(12).fill(0);
  monthlyRevenue: number[] = new Array(12).fill(0);
  months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

  constructor(private electronService: ElectronService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadMonthlyData(new Date().getFullYear());
  }

  async loadStats(): Promise<void> {
    const result = await this.electronService.getDashboardStats();
    if (result?.success) {
      this.stats = result.data;
    }
  }

  async loadMonthlyData(year: number): Promise<void> {
    const [subsResult, revResult] = await Promise.all([
      this.electronService.getMonthlySubscriptions(year),
      this.electronService.getMonthlyRevenue(year),
    ]);

    if (subsResult?.success) this.monthlySubscriptions = subsResult.data;
    if (revResult?.success) this.monthlyRevenue = revResult.data;
  }

  getBarHeight(value: number, data: number[]): number {
    const max = Math.max(...data, 1);
    return (value / max) * 100;
  }

  onSubYearChange(event: Event): void {
    const year = parseInt((event.target as HTMLSelectElement).value);
    this.electronService.getMonthlySubscriptions(year).then(r => {
      if (r?.success) this.monthlySubscriptions = r.data;
    });
  }

  onRevYearChange(event: Event): void {
    const year = parseInt((event.target as HTMLSelectElement).value);
    this.electronService.getMonthlyRevenue(year).then(r => {
      if (r?.success) this.monthlyRevenue = r.data;
    });
  }
}
