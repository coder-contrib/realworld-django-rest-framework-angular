import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElectronService } from '../../core/services/electron.service';

@Component({
  selector: 'app-trainers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">إدارة المدربين</h2>
        <button (click)="showAddModal = true" class="btn-primary flex items-center gap-2">
          <span class="material-icons text-xl">person_add</span>
          إضافة مدرب
        </button>
      </div>

      <!-- Trainers Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let trainer of trainers" class="card">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 bg-primary-600/10 rounded-xl flex items-center justify-center">
              <span class="material-icons text-2xl text-primary-500">sports_martial_arts</span>
            </div>
            <div>
              <h3 class="font-bold text-white">{{ trainer.fullName }}</h3>
              <p class="text-dark-400 text-sm">{{ trainer.specialization }}</p>
            </div>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2 text-dark-300">
              <span class="material-icons text-base">phone</span>
              {{ trainer.phone }}
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full" [class.bg-green-500]="trainer.isActive" [class.bg-red-500]="!trainer.isActive"></span>
              <span [class.text-green-400]="trainer.isActive" [class.text-red-400]="!trainer.isActive">
                {{ trainer.isActive ? 'نشط' : 'غير نشط' }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 mt-4 pt-4 border-t border-dark-700">
            <button class="text-dark-400 hover:text-blue-400 transition-colors">
              <span class="material-icons text-lg">edit</span>
            </button>
            <button class="text-dark-400 hover:text-red-400 transition-colors">
              <span class="material-icons text-lg">delete</span>
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="trainers.length === 0" class="text-center py-12 text-dark-400">
        <span class="material-icons text-4xl mb-2">sports_martial_arts</span>
        <p>لا يوجد مدربين</p>
      </div>

      <!-- Add Trainer Modal -->
      <div *ngIf="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-lg">
          <div class="p-6 border-b border-dark-700 flex items-center justify-between">
            <h3 class="text-xl font-bold">إضافة مدرب جديد</h3>
            <button (click)="showAddModal = false" class="text-dark-400 hover:text-white">
              <span class="material-icons">close</span>
            </button>
          </div>
          <form (ngSubmit)="saveTrainer()" class="p-6 space-y-4">
            <div>
              <label class="block text-sm text-dark-300 mb-1">الاسم الكامل *</label>
              <input [(ngModel)]="trainerForm.fullName" name="fullName" class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary-500" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-dark-300 mb-1">رقم الهاتف *</label>
                <input [(ngModel)]="trainerForm.phone" name="phone" class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary-500" required>
              </div>
              <div>
                <label class="block text-sm text-dark-300 mb-1">التخصص *</label>
                <input [(ngModel)]="trainerForm.specialization" name="specialization" class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary-500" required>
              </div>
            </div>
            <div>
              <label class="block text-sm text-dark-300 mb-1">الراتب</label>
              <input [(ngModel)]="trainerForm.salary" name="salary" type="number" class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary-500">
            </div>
            <div class="flex gap-3 pt-4">
              <button type="submit" class="btn-primary flex-1">إضافة المدرب</button>
              <button type="button" (click)="showAddModal = false" class="btn-secondary">إلغاء</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class TrainersComponent implements OnInit {
  trainers: any[] = [];
  showAddModal = false;
  trainerForm = { fullName: '', phone: '', specialization: '', salary: null };

  constructor(private electronService: ElectronService) {}

  ngOnInit(): void { this.loadTrainers(); }

  async loadTrainers(): Promise<void> {
    const result = await this.electronService.getTrainers();
    if (result?.success) this.trainers = result.data.trainers;
  }

  async saveTrainer(): Promise<void> {
    await this.electronService.createTrainer(this.trainerForm);
    this.showAddModal = false;
    this.trainerForm = { fullName: '', phone: '', specialization: '', salary: null };
    this.loadTrainers();
  }
}
