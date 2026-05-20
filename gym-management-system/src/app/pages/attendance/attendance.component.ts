import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectronService } from '../../core/services/electron.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">تسجيل الحضور</h2>
        <div class="flex items-center gap-3">
          <div class="bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 flex items-center gap-2">
            <span class="material-icons text-green-500">groups</span>
            <span class="text-white font-bold">{{ todayCount }}</span>
            <span class="text-dark-400 text-sm">حاضر اليوم</span>
          </div>
        </div>
      </div>

      <!-- QR Scanner Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="card text-center">
          <div class="w-20 h-20 bg-primary-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="material-icons text-4xl text-primary-500">qr_code_scanner</span>
          </div>
          <h3 class="text-xl font-bold mb-2">مسح QR Code</h3>
          <p class="text-dark-400 text-sm mb-4">وجّه الكاميرا نحو رمز QR الخاص بالعضو</p>
          <button (click)="startScanner()" class="btn-primary">
            <span class="material-icons ml-2">camera_alt</span>
            تشغيل الماسح
          </button>

          <!-- Scanner Result -->
          <div *ngIf="scanResult" class="mt-4 p-4 rounded-xl" [class]="scanResult.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'">
            <span class="material-icons text-3xl mb-2" [class]="scanResult.success ? 'text-green-500' : 'text-red-500'">
              {{ scanResult.success ? 'check_circle' : 'error' }}
            </span>
            <p class="font-bold" [class]="scanResult.success ? 'text-green-400' : 'text-red-400'">{{ scanResult.message }}</p>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="card">
          <h3 class="text-lg font-bold mb-4">إحصائيات اليوم</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
              <span class="text-dark-300">إجمالي الحضور</span>
              <span class="text-white font-bold text-lg">{{ todayCount }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
              <span class="text-dark-300">آخر تسجيل</span>
              <span class="text-white text-sm">{{ lastCheckIn }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Attendance List -->
      <div class="card">
        <h3 class="text-lg font-bold mb-4">سجل حضور اليوم</h3>
        <div class="space-y-2">
          <div *ngFor="let record of todayAttendance" class="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-dark-600 rounded-full flex items-center justify-center">
                <span class="material-icons text-dark-300">person</span>
              </div>
              <div>
                <p class="font-medium text-white">{{ record.member?.fullName }}</p>
                <p class="text-xs text-dark-400">{{ record.member?.phone }}</p>
              </div>
            </div>
            <span class="text-sm text-dark-300">{{ record.checkIn | date:'HH:mm' }}</span>
          </div>
          <div *ngIf="todayAttendance.length === 0" class="text-center py-8 text-dark-400">
            <span class="material-icons text-3xl mb-2">event_busy</span>
            <p>لا يوجد تسجيلات حضور اليوم</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AttendanceComponent implements OnInit {
  todayAttendance: any[] = [];
  todayCount = 0;
  lastCheckIn = '--:--';
  scanResult: { success: boolean; message: string } | null = null;

  constructor(private electronService: ElectronService) {}

  ngOnInit(): void { this.loadToday(); }

  async loadToday(): Promise<void> {
    const result = await this.electronService.getAttendanceToday();
    if (result?.success) {
      this.todayAttendance = result.data;
      this.todayCount = result.data.length;
      if (result.data.length > 0) {
        this.lastCheckIn = new Date(result.data[0].checkIn).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
      }
    }
  }

  startScanner(): void {
    // In Electron, this would use html5-qrcode library
    // For demo, simulate a scan
    this.scanResult = { success: true, message: 'تم تسجيل حضور: أحمد محمد' };
    setTimeout(() => this.scanResult = null, 3000);
  }
}
