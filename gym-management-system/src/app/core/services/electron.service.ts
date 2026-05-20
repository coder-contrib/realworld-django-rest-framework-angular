import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ElectronService {
  private api: any;

  constructor() {
    this.api = (window as any).electronAPI;
  }

  get isElectron(): boolean {
    return !!this.api;
  }

  // Members
  getMembers(params?: any) { return this.invoke('getMembers', params); }
  getMember(id: string) { return this.invoke('getMember', id); }
  createMember(data: any) { return this.invoke('createMember', data); }
  updateMember(id: string, data: any) { return this.invoke('updateMember', id, data); }
  deleteMember(id: string) { return this.invoke('deleteMember', id); }
  searchMembers(query: string) { return this.invoke('searchMembers', query); }

  // Subscriptions
  getSubscriptions(params?: any) { return this.invoke('getSubscriptions', params); }
  createSubscription(data: any) { return this.invoke('createSubscription', data); }
  freezeSubscription(id: string) { return this.invoke('freezeSubscription', id); }
  unfreezeSubscription(id: string) { return this.invoke('unfreezeSubscription', id); }
  renewSubscription(id: string, data: any) { return this.invoke('renewSubscription', id, data); }
  cancelSubscription(id: string) { return this.invoke('cancelSubscription', id); }
  getExpiringSoon() { return this.invoke('getExpiringSoon'); }

  // Attendance
  checkIn(memberId: string) { return this.invoke('checkIn', memberId); }
  checkInByQR(qrCode: string) { return this.invoke('checkInByQR', qrCode); }
  getAttendanceToday() { return this.invoke('getAttendanceToday'); }
  getAttendanceHistory(params?: any) { return this.invoke('getAttendanceHistory', params); }
  getCurrentAttendanceCount() { return this.invoke('getCurrentAttendanceCount'); }

  // Payments
  getPayments(params?: any) { return this.invoke('getPayments', params); }
  createPayment(data: any) { return this.invoke('createPayment', data); }

  // Trainers
  getTrainers(params?: any) { return this.invoke('getTrainers', params); }
  getTrainer(id: string) { return this.invoke('getTrainer', id); }
  createTrainer(data: any) { return this.invoke('createTrainer', data); }
  updateTrainer(id: string, data: any) { return this.invoke('updateTrainer', id, data); }
  deleteTrainer(id: string) { return this.invoke('deleteTrainer', id); }

  // Products
  getProducts(params?: any) { return this.invoke('getProducts', params); }
  createProduct(data: any) { return this.invoke('createProduct', data); }
  updateProduct(id: string, data: any) { return this.invoke('updateProduct', id, data); }
  deleteProduct(id: string) { return this.invoke('deleteProduct', id); }

  // Dashboard
  getDashboardStats() { return this.invoke('getDashboardStats'); }
  getMonthlySubscriptions(year: number) { return this.invoke('getMonthlySubscriptions', year); }
  getMonthlyRevenue(year: number) { return this.invoke('getMonthlyRevenue', year); }

  // Backup
  createBackup() { return this.invoke('createBackup'); }
  getBackups() { return this.invoke('getBackups'); }
  restoreBackup(filename: string) { return this.invoke('restoreBackup', filename); }
  deleteBackup(id: string) { return this.invoke('deleteBackup', id); }

  // Settings
  getSetting(key: string) { return this.invoke('getSetting', key); }
  setSetting(key: string, value: string) { return this.invoke('setSetting', key, value); }
  getAllSettings() { return this.invoke('getAllSettings'); }

  private async invoke(method: string, ...args: any[]): Promise<any> {
    if (this.api && this.api[method]) {
      return this.api[method](...args);
    }
    // Return demo data when not in Electron
    return this.getDemoData(method, args);
  }

  private getDemoData(method: string, args: any[]): any {
    // Demo data for web preview
    const demoData: Record<string, any> = {
      getDashboardStats: {
        success: true,
        data: { totalMembers: 156, attendanceToday: 43, expiredSubscriptions: 12, dailyRevenue: 2450 }
      },
      getMonthlySubscriptions: {
        success: true,
        data: [12, 19, 25, 32, 28, 35, 40, 38, 45, 42, 50, 48]
      },
      getMonthlyRevenue: {
        success: true,
        data: [15000, 22000, 28000, 35000, 30000, 42000, 48000, 45000, 52000, 49000, 58000, 55000]
      },
      getMembers: {
        success: true,
        data: {
          members: [
            { id: '1', fullName: 'أحمد محمد', phone: '0551234567', qrCode: 'GYM-001', isActive: true, createdAt: new Date(), subscriptions: [{ status: 'active', endDate: new Date(Date.now() + 30*24*60*60*1000) }] },
            { id: '2', fullName: 'محمد علي', phone: '0559876543', qrCode: 'GYM-002', isActive: true, createdAt: new Date(), subscriptions: [{ status: 'active', endDate: new Date(Date.now() + 15*24*60*60*1000) }] },
            { id: '3', fullName: 'خالد عبدالله', phone: '0553334444', qrCode: 'GYM-003', isActive: true, createdAt: new Date(), subscriptions: [{ status: 'expired', endDate: new Date(Date.now() - 5*24*60*60*1000) }] },
            { id: '4', fullName: 'عمر حسن', phone: '0557778888', qrCode: 'GYM-004', isActive: true, createdAt: new Date(), subscriptions: [{ status: 'active', endDate: new Date(Date.now() + 60*24*60*60*1000) }] },
            { id: '5', fullName: 'فهد سعيد', phone: '0551112222', qrCode: 'GYM-005', isActive: false, createdAt: new Date(), subscriptions: [] },
          ],
          total: 5,
          page: 1,
          limit: 20,
        }
      },
      getAttendanceToday: {
        success: true,
        data: [
          { id: '1', memberId: '1', checkIn: new Date(), member: { fullName: 'أحمد محمد', phone: '0551234567' } },
          { id: '2', memberId: '2', checkIn: new Date(Date.now() - 3600000), member: { fullName: 'محمد علي', phone: '0559876543' } },
        ]
      },
      getTrainers: {
        success: true,
        data: { trainers: [
          { id: '1', fullName: 'كابتن أحمد', phone: '0551111111', specialization: 'بناء أجسام', isActive: true, sessions: [] },
          { id: '2', fullName: 'كابتن سارة', phone: '0552222222', specialization: 'لياقة بدنية', isActive: true, sessions: [] },
        ], total: 2, page: 1, limit: 20 }
      },
      getProducts: {
        success: true,
        data: { products: [
          { id: '1', name: 'بروتين واي', price: 180, stock: 25, category: 'مكملات' },
          { id: '2', name: 'كرياتين', price: 95, stock: 15, category: 'مكملات' },
          { id: '3', name: 'قفازات تمرين', price: 45, stock: 30, category: 'معدات' },
        ], total: 3, page: 1, limit: 20 }
      },
      getPayments: {
        success: true,
        data: { payments: [
          { id: '1', memberId: '1', amount: 300, paymentMethod: 'cash', invoiceNumber: 'INV-000001', createdAt: new Date(), member: { fullName: 'أحمد محمد' } },
          { id: '2', memberId: '2', amount: 800, paymentMethod: 'bank_transfer', invoiceNumber: 'INV-000002', createdAt: new Date(), member: { fullName: 'محمد علي' } },
        ], total: 2, page: 1, limit: 20 }
      },
      getSubscriptions: {
        success: true,
        data: { subscriptions: [
          { id: '1', memberId: '1', type: 'monthly', price: 300, startDate: new Date(), endDate: new Date(Date.now() + 30*24*60*60*1000), status: 'active', member: { fullName: 'أحمد محمد' } },
          { id: '2', memberId: '2', type: 'quarterly', price: 800, startDate: new Date(), endDate: new Date(Date.now() + 90*24*60*60*1000), status: 'active', member: { fullName: 'محمد علي' } },
        ], total: 2, page: 1, limit: 20 }
      },
      getBackups: {
        success: true,
        data: [
          { id: '1', filename: 'auto-backup-2026-05-20.sqlite', size: 2048000, type: 'auto', createdAt: new Date() },
          { id: '2', filename: 'backup-2026-05-19.sqlite', size: 1980000, type: 'manual', createdAt: new Date(Date.now() - 86400000) },
        ]
      },
    };

    return demoData[method] || { success: true, data: null };
  }
}
