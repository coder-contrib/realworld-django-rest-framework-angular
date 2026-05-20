import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectronService } from '../../core/services/electron.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">المدفوعات</h2>
        <button (click)="showAddModal = true" class="btn-primary flex items-center gap-2">
          <span class="material-icons text-xl">add</span>
          تسجيل دفعة
        </button>
      </div>

      <!-- Payment Methods Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="card flex items-center gap-4">
          <div class="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
            <span class="material-icons text-xl text-green-500">payments</span>
          </div>
          <div>
            <p class="text-dark-400 text-sm">نقدي</p>
            <p class="text-white font-bold text-lg">{{ getTotalByMethod('cash') | number }} ر.س</p>
          </div>
        </div>
        <div class="card flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <span class="material-icons text-xl text-blue-500">account_balance</span>
          </div>
          <div>
            <p class="text-dark-400 text-sm">تحويل بنكي</p>
            <p class="text-white font-bold text-lg">{{ getTotalByMethod('bank_transfer') | number }} ر.س</p>
          </div>
        </div>
        <div class="card flex items-center gap-4">
          <div class="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <span class="material-icons text-xl text-purple-500">account_balance_wallet</span>
          </div>
          <div>
            <p class="text-dark-400 text-sm">محفظة</p>
            <p class="text-white font-bold text-lg">{{ getTotalByMethod('wallet') | number }} ر.س</p>
          </div>
        </div>
      </div>

      <!-- Payments Table -->
      <div class="card overflow-hidden p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>رقم الفاتورة</th>
              <th>العضو</th>
              <th>المبلغ</th>
              <th>طريقة الدفع</th>
              <th>التاريخ</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let payment of payments">
              <td class="font-mono text-xs">{{ payment.invoiceNumber }}</td>
              <td class="font-medium text-white">{{ payment.member?.fullName }}</td>
              <td class="text-green-400 font-bold">{{ payment.amount | number }} ر.س</td>
              <td>{{ getMethodLabel(payment.paymentMethod) }}</td>
              <td class="text-dark-300">{{ payment.createdAt | date:'yyyy/MM/dd' }}</td>
              <td>
                <button class="text-dark-400 hover:text-white transition-colors" title="طباعة">
                  <span class="material-icons text-lg">print</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="payments.length === 0" class="text-center py-12 text-dark-400">
          <span class="material-icons text-4xl mb-2">payments</span>
          <p>لا يوجد مدفوعات</p>
        </div>
      </div>

      <!-- Add Payment Modal -->
      <div *ngIf="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-lg p-6">
          <h3 class="text-xl font-bold mb-6">تسجيل دفعة جديدة</h3>
          <div class="space-y-4">
            <p class="text-dark-400 text-sm">قريبًا...</p>
          </div>
          <button (click)="showAddModal = false" class="btn-secondary mt-4">إغلاق</button>
        </div>
      </div>
    </div>
  `,
})
export class PaymentsComponent implements OnInit {
  payments: any[] = [];
  showAddModal = false;

  constructor(private electronService: ElectronService) {}

  ngOnInit(): void { this.loadPayments(); }

  async loadPayments(): Promise<void> {
    const result = await this.electronService.getPayments();
    if (result?.success) this.payments = result.data.payments;
  }

  getTotalByMethod(method: string): number {
    return this.payments.filter(p => p.paymentMethod === method).reduce((sum, p) => sum + p.amount, 0);
  }

  getMethodLabel(method: string): string {
    const labels: Record<string, string> = { cash: 'نقدي', bank_transfer: 'تحويل بنكي', wallet: 'محفظة' };
    return labels[method] || method;
  }
}
