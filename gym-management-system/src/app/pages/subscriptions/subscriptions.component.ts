import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElectronService } from '../../core/services/electron.service';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">إدارة الاشتراكات</h2>
        <button (click)="showAddModal = true" class="btn-primary flex items-center gap-2">
          <span class="material-icons text-xl">add_card</span>
          اشتراك جديد
        </button>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-4 mb-6">
        <select
          [(ngModel)]="statusFilter"
          (ngModelChange)="loadSubscriptions()"
          class="bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-white"
        >
          <option value="all">جميع الاشتراكات</option>
          <option value="active">فعال</option>
          <option value="frozen">مجمد</option>
          <option value="expired">منتهي</option>
          <option value="cancelled">ملغي</option>
        </select>
      </div>

      <!-- Subscriptions Table -->
      <div class="card overflow-hidden p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>العضو</th>
              <th>نوع الاشتراك</th>
              <th>السعر</th>
              <th>تاريخ البدء</th>
              <th>تاريخ الانتهاء</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let sub of subscriptions">
              <td class="font-medium text-white">{{ sub.member?.fullName }}</td>
              <td>{{ getTypeLabel(sub.type) }}</td>
              <td>{{ sub.price | number }} ر.س</td>
              <td>{{ sub.startDate | date:'yyyy/MM/dd' }}</td>
              <td>{{ sub.endDate | date:'yyyy/MM/dd' }}</td>
              <td>
                <span class="text-xs px-2 py-1 rounded-full" [class]="getStatusClass(sub.status)">
                  {{ getStatusLabel(sub.status) }}
                </span>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <button *ngIf="sub.status === 'active'" (click)="freeze(sub)" class="text-blue-400 hover:text-blue-300 text-xs" title="تجميد">
                    <span class="material-icons text-lg">ac_unit</span>
                  </button>
                  <button *ngIf="sub.status === 'frozen'" (click)="unfreeze(sub)" class="text-green-400 hover:text-green-300 text-xs" title="إلغاء التجميد">
                    <span class="material-icons text-lg">play_arrow</span>
                  </button>
                  <button (click)="renew(sub)" class="text-yellow-400 hover:text-yellow-300" title="تجديد">
                    <span class="material-icons text-lg">autorenew</span>
                  </button>
                  <button *ngIf="sub.status === 'active'" (click)="cancel(sub)" class="text-red-400 hover:text-red-300" title="إلغاء">
                    <span class="material-icons text-lg">cancel</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="subscriptions.length === 0" class="text-center py-12 text-dark-400">
          <span class="material-icons text-4xl mb-2">card_membership</span>
          <p>لا يوجد اشتراكات</p>
        </div>
      </div>

      <!-- Add Subscription Modal -->
      <div *ngIf="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-lg">
          <div class="p-6 border-b border-dark-700 flex items-center justify-between">
            <h3 class="text-xl font-bold">اشتراك جديد</h3>
            <button (click)="showAddModal = false" class="text-dark-400 hover:text-white">
              <span class="material-icons">close</span>
            </button>
          </div>
          <form (ngSubmit)="saveSubscription()" class="p-6 space-y-4">
            <div>
              <label class="block text-sm text-dark-300 mb-1">نوع الاشتراك *</label>
              <select [(ngModel)]="subForm.type" name="type" (ngModelChange)="updatePrice()" class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white">
                <option value="monthly">شهري</option>
                <option value="quarterly">3 أشهر</option>
                <option value="semi_annual">6 أشهر</option>
                <option value="annual">سنوي</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-dark-300 mb-1">السعر (ر.س)</label>
              <input [(ngModel)]="subForm.price" name="price" type="number" class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white">
            </div>
            <div class="flex gap-3 pt-4">
              <button type="submit" class="btn-primary flex-1">إنشاء الاشتراك</button>
              <button type="button" (click)="showAddModal = false" class="btn-secondary">إلغاء</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class SubscriptionsComponent implements OnInit {
  subscriptions: any[] = [];
  statusFilter = 'all';
  showAddModal = false;
  subForm = { type: 'monthly', price: 300 };

  constructor(private electronService: ElectronService) {}

  ngOnInit(): void { this.loadSubscriptions(); }

  async loadSubscriptions(): Promise<void> {
    const result = await this.electronService.getSubscriptions({ status: this.statusFilter });
    if (result?.success) this.subscriptions = result.data.subscriptions;
  }

  async freeze(sub: any): Promise<void> { await this.electronService.freezeSubscription(sub.id); this.loadSubscriptions(); }
  async unfreeze(sub: any): Promise<void> { await this.electronService.unfreezeSubscription(sub.id); this.loadSubscriptions(); }
  async cancel(sub: any): Promise<void> { await this.electronService.cancelSubscription(sub.id); this.loadSubscriptions(); }
  async renew(sub: any): Promise<void> { /* Open renew dialog */ }

  async saveSubscription(): Promise<void> {
    this.showAddModal = false;
    this.loadSubscriptions();
  }

  updatePrice(): void {
    const prices: Record<string, number> = { monthly: 300, quarterly: 800, semi_annual: 1400, annual: 2500 };
    this.subForm.price = prices[this.subForm.type] || 300;
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = { monthly: 'شهري', quarterly: '3 أشهر', semi_annual: '6 أشهر', annual: 'سنوي' };
    return labels[type] || type;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = { active: 'bg-green-500/10 text-green-500', frozen: 'bg-blue-500/10 text-blue-500', expired: 'bg-red-500/10 text-red-500', cancelled: 'bg-dark-500/10 text-dark-400' };
    return classes[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = { active: 'فعال', frozen: 'مجمد', expired: 'منتهي', cancelled: 'ملغي' };
    return labels[status] || status;
  }
}
