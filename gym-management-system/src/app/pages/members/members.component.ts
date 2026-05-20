import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ElectronService } from '../../core/services/electron.service';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <h2 class="page-title">إدارة الأعضاء</h2>
        <button (click)="showAddModal = true" class="btn-primary flex items-center gap-2">
          <span class="material-icons text-xl">person_add</span>
          إضافة عضو
        </button>
      </div>

      <!-- Search & Filters -->
      <div class="flex items-center gap-4 mb-6">
        <div class="relative flex-1 max-w-md">
          <span class="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">search</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch()"
            class="w-full bg-dark-800 border border-dark-700 rounded-lg py-2.5 pr-12 pl-4 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
            placeholder="بحث بالاسم أو رقم الهاتف..."
          >
        </div>
        <select
          [(ngModel)]="statusFilter"
          (ngModelChange)="loadMembers()"
          class="bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-white"
        >
          <option value="all">جميع الأعضاء</option>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
        </select>
      </div>

      <!-- Members Table -->
      <div class="card overflow-hidden p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>العضو</th>
              <th>رقم الهاتف</th>
              <th>رمز QR</th>
              <th>الاشتراك</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let member of members">
              <td>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-dark-600 rounded-full flex items-center justify-center">
                    <span class="material-icons text-dark-300">person</span>
                  </div>
                  <div>
                    <p class="font-medium text-white">{{ member.fullName }}</p>
                    <p class="text-xs text-dark-400">{{ member.createdAt | date:'yyyy/MM/dd' }}</p>
                  </div>
                </div>
              </td>
              <td class="text-dark-300">{{ member.phone }}</td>
              <td>
                <span class="text-xs bg-dark-700 px-2 py-1 rounded font-mono">{{ member.qrCode }}</span>
              </td>
              <td>
                <span
                  *ngIf="member.subscriptions?.length"
                  class="text-xs px-2 py-1 rounded-full"
                  [class]="getSubscriptionClass(member.subscriptions[0]?.status)"
                >
                  {{ getSubscriptionLabel(member.subscriptions[0]?.status) }}
                </span>
                <span *ngIf="!member.subscriptions?.length" class="text-dark-400 text-xs">بدون اشتراك</span>
              </td>
              <td>
                <span
                  class="w-2.5 h-2.5 rounded-full inline-block"
                  [class.bg-green-500]="member.isActive"
                  [class.bg-red-500]="!member.isActive"
                ></span>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <button (click)="viewMember(member)" class="text-dark-400 hover:text-white transition-colors">
                    <span class="material-icons text-lg">visibility</span>
                  </button>
                  <button (click)="editMember(member)" class="text-dark-400 hover:text-blue-400 transition-colors">
                    <span class="material-icons text-lg">edit</span>
                  </button>
                  <button (click)="confirmDelete(member)" class="text-dark-400 hover:text-red-400 transition-colors">
                    <span class="material-icons text-lg">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="members.length === 0" class="text-center py-12 text-dark-400">
          <span class="material-icons text-4xl mb-2">people_outline</span>
          <p>لا يوجد أعضاء</p>
        </div>
      </div>

      <!-- Add/Edit Member Modal -->
      <div *ngIf="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-dark-700 flex items-center justify-between">
            <h3 class="text-xl font-bold">{{ editingMember ? 'تعديل عضو' : 'إضافة عضو جديد' }}</h3>
            <button (click)="closeModal()" class="text-dark-400 hover:text-white">
              <span class="material-icons">close</span>
            </button>
          </div>
          <form (ngSubmit)="saveMember()" class="p-6 space-y-4">
            <div>
              <label class="block text-sm text-dark-300 mb-1">الاسم الكامل *</label>
              <input
                [(ngModel)]="memberForm.fullName"
                name="fullName"
                class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary-500"
                required
              >
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-dark-300 mb-1">رقم الهاتف *</label>
                <input
                  [(ngModel)]="memberForm.phone"
                  name="phone"
                  class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary-500"
                  required
                >
              </div>
              <div>
                <label class="block text-sm text-dark-300 mb-1">هاتف الطوارئ</label>
                <input
                  [(ngModel)]="memberForm.emergencyPhone"
                  name="emergencyPhone"
                  class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary-500"
                >
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-dark-300 mb-1">الجنس</label>
                <select
                  [(ngModel)]="memberForm.gender"
                  name="gender"
                  class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-dark-300 mb-1">البريد الإلكتروني</label>
                <input
                  [(ngModel)]="memberForm.email"
                  name="email"
                  type="email"
                  class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary-500"
                >
              </div>
            </div>
            <div>
              <label class="block text-sm text-dark-300 mb-1">ملاحظات</label>
              <textarea
                [(ngModel)]="memberForm.notes"
                name="notes"
                rows="3"
                class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary-500 resize-none"
              ></textarea>
            </div>
            <div class="flex items-center gap-3 pt-4">
              <button type="submit" class="btn-primary flex-1">
                {{ editingMember ? 'حفظ التعديلات' : 'إضافة العضو' }}
              </button>
              <button type="button" (click)="closeModal()" class="btn-secondary">إلغاء</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation -->
      <div *ngIf="showDeleteConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-sm p-6 text-center">
          <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="material-icons text-3xl text-red-500">warning</span>
          </div>
          <h3 class="text-xl font-bold mb-2">هل أنت متأكد من عملية الحذف؟</h3>
          <p class="text-dark-400 text-sm mb-6">لا يمكن التراجع بعد الحذف.</p>
          <div class="flex items-center gap-3">
            <button (click)="deleteMember()" class="btn-danger flex-1">حذف</button>
            <button (click)="showDeleteConfirm = false" class="btn-secondary flex-1">إلغاء</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MembersComponent implements OnInit {
  members: any[] = [];
  searchQuery = '';
  statusFilter = 'all';
  showAddModal = false;
  showDeleteConfirm = false;
  editingMember: any = null;
  deletingMember: any = null;
  memberForm: any = { fullName: '', phone: '', emergencyPhone: '', gender: 'male', email: '', notes: '' };

  constructor(private electronService: ElectronService, private router: Router) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  async loadMembers(): Promise<void> {
    const result = await this.electronService.getMembers({ search: this.searchQuery, status: this.statusFilter });
    if (result?.success) {
      this.members = result.data.members;
    }
  }

  onSearch(): void {
    this.loadMembers();
  }

  viewMember(member: any): void {
    this.router.navigate(['/members', member.id]);
  }

  editMember(member: any): void {
    this.editingMember = member;
    this.memberForm = { ...member };
    this.showAddModal = true;
  }

  confirmDelete(member: any): void {
    this.deletingMember = member;
    this.showDeleteConfirm = true;
  }

  async deleteMember(): Promise<void> {
    if (this.deletingMember) {
      await this.electronService.deleteMember(this.deletingMember.id);
      this.showDeleteConfirm = false;
      this.loadMembers();
    }
  }

  async saveMember(): Promise<void> {
    if (this.editingMember) {
      await this.electronService.updateMember(this.editingMember.id, this.memberForm);
    } else {
      await this.electronService.createMember(this.memberForm);
    }
    this.closeModal();
    this.loadMembers();
  }

  closeModal(): void {
    this.showAddModal = false;
    this.editingMember = null;
    this.memberForm = { fullName: '', phone: '', emergencyPhone: '', gender: 'male', email: '', notes: '' };
  }

  getSubscriptionClass(status: string): string {
    const classes: Record<string, string> = {
      active: 'bg-green-500/10 text-green-500',
      frozen: 'bg-blue-500/10 text-blue-500',
      expired: 'bg-red-500/10 text-red-500',
      cancelled: 'bg-dark-500/10 text-dark-400',
    };
    return classes[status] || 'bg-dark-500/10 text-dark-400';
  }

  getSubscriptionLabel(status: string): string {
    const labels: Record<string, string> = {
      active: 'فعال',
      frozen: 'مجمد',
      expired: 'منتهي',
      cancelled: 'ملغي',
    };
    return labels[status] || status;
  }
}
