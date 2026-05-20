import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectronService } from '../../core/services/electron.service';

@Component({
  selector: 'app-backup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">النسخ الاحتياطي</h2>
        <button (click)="createBackup()" [disabled]="isCreating" class="btn-primary flex items-center gap-2">
          <span class="material-icons text-xl" [class.animate-spin]="isCreating">{{ isCreating ? 'refresh' : 'backup' }}</span>
          {{ isCreating ? 'جاري الإنشاء...' : 'إنشاء نسخة احتياطية' }}
        </button>
      </div>

      <!-- Auto Backup Info -->
      <div class="card mb-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
            <span class="material-icons text-2xl text-green-500">schedule</span>
          </div>
          <div>
            <h3 class="font-bold text-white">النسخ الاحتياطي التلقائي</h3>
            <p class="text-dark-400 text-sm">يتم إنشاء نسخة احتياطية تلقائيًا يوميًا الساعة 12:00 صباحًا</p>
          </div>
          <div class="mr-auto">
            <span class="text-xs bg-green-500/10 text-green-500 px-3 py-1 rounded-full">مفعل</span>
          </div>
        </div>
      </div>

      <!-- Backups List -->
      <div class="card">
        <h3 class="text-lg font-bold mb-4">النسخ الاحتياطية المتوفرة</h3>
        <div class="space-y-3">
          <div *ngFor="let backup of backups" class="flex items-center justify-between p-4 bg-dark-700/30 rounded-lg">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" [class]="backup.type === 'auto' ? 'bg-blue-500/10' : 'bg-yellow-500/10'">
                <span class="material-icons" [class]="backup.type === 'auto' ? 'text-blue-500' : 'text-yellow-500'">
                  {{ backup.type === 'auto' ? 'schedule' : 'backup' }}
                </span>
              </div>
              <div>
                <p class="text-white font-medium text-sm">{{ backup.filename }}</p>
                <p class="text-dark-400 text-xs">{{ backup.createdAt | date:'yyyy/MM/dd HH:mm' }} | {{ formatSize(backup.size) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button (click)="restore(backup)" class="text-blue-400 hover:text-blue-300 transition-colors" title="استعادة">
                <span class="material-icons">restore</span>
              </button>
              <button (click)="deleteBackup(backup)" class="text-red-400 hover:text-red-300 transition-colors" title="حذف">
                <span class="material-icons">delete</span>
              </button>
            </div>
          </div>
          <div *ngIf="backups.length === 0" class="text-center py-8 text-dark-400">
            <span class="material-icons text-3xl mb-2">cloud_off</span>
            <p>لا يوجد نسخ احتياطية</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BackupComponent implements OnInit {
  backups: any[] = [];
  isCreating = false;

  constructor(private electronService: ElectronService) {}

  ngOnInit(): void { this.loadBackups(); }

  async loadBackups(): Promise<void> {
    const result = await this.electronService.getBackups();
    if (result?.success) this.backups = result.data;
  }

  async createBackup(): Promise<void> {
    this.isCreating = true;
    await this.electronService.createBackup();
    this.isCreating = false;
    this.loadBackups();
  }

  async restore(backup: any): Promise<void> {
    if (confirm('هل أنت متأكد من استعادة هذه النسخة الاحتياطية؟')) {
      await this.electronService.restoreBackup(backup.filename);
    }
  }

  async deleteBackup(backup: any): Promise<void> {
    if (confirm('هل أنت متأكد من حذف هذه النسخة الاحتياطية؟')) {
      await this.electronService.deleteBackup(backup.id);
      this.loadBackups();
    }
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}
