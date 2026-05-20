import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Auth
  login: (username: string, password: string) =>
    ipcRenderer.invoke('auth:login', username, password),
  logout: () => ipcRenderer.invoke('auth:logout'),
  getCurrentUser: () => ipcRenderer.invoke('auth:getCurrentUser'),
  changePassword: (oldPassword: string, newPassword: string) =>
    ipcRenderer.invoke('auth:changePassword', oldPassword, newPassword),

  // Members
  getMembers: (params?: any) => ipcRenderer.invoke('members:getAll', params),
  getMember: (id: string) => ipcRenderer.invoke('members:getOne', id),
  createMember: (data: any) => ipcRenderer.invoke('members:create', data),
  updateMember: (id: string, data: any) => ipcRenderer.invoke('members:update', id, data),
  deleteMember: (id: string) => ipcRenderer.invoke('members:delete', id),
  searchMembers: (query: string) => ipcRenderer.invoke('members:search', query),

  // Subscriptions
  getSubscriptions: (params?: any) => ipcRenderer.invoke('subscriptions:getAll', params),
  getSubscription: (id: string) => ipcRenderer.invoke('subscriptions:getOne', id),
  createSubscription: (data: any) => ipcRenderer.invoke('subscriptions:create', data),
  updateSubscription: (id: string, data: any) => ipcRenderer.invoke('subscriptions:update', id, data),
  freezeSubscription: (id: string) => ipcRenderer.invoke('subscriptions:freeze', id),
  unfreezeSubscription: (id: string) => ipcRenderer.invoke('subscriptions:unfreeze', id),
  renewSubscription: (id: string, data: any) => ipcRenderer.invoke('subscriptions:renew', id, data),
  cancelSubscription: (id: string) => ipcRenderer.invoke('subscriptions:cancel', id),
  getExpiringSoon: () => ipcRenderer.invoke('subscriptions:expiringSoon'),

  // Attendance
  checkIn: (memberId: string) => ipcRenderer.invoke('attendance:checkIn', memberId),
  checkInByQR: (qrCode: string) => ipcRenderer.invoke('attendance:checkInByQR', qrCode),
  getAttendanceToday: () => ipcRenderer.invoke('attendance:today'),
  getAttendanceHistory: (params?: any) => ipcRenderer.invoke('attendance:history', params),
  getCurrentAttendanceCount: () => ipcRenderer.invoke('attendance:currentCount'),

  // Payments
  getPayments: (params?: any) => ipcRenderer.invoke('payments:getAll', params),
  createPayment: (data: any) => ipcRenderer.invoke('payments:create', data),
  getPayment: (id: string) => ipcRenderer.invoke('payments:getOne', id),

  // Trainers
  getTrainers: (params?: any) => ipcRenderer.invoke('trainers:getAll', params),
  getTrainer: (id: string) => ipcRenderer.invoke('trainers:getOne', id),
  createTrainer: (data: any) => ipcRenderer.invoke('trainers:create', data),
  updateTrainer: (id: string, data: any) => ipcRenderer.invoke('trainers:update', id, data),
  deleteTrainer: (id: string) => ipcRenderer.invoke('trainers:delete', id),

  // Products
  getProducts: (params?: any) => ipcRenderer.invoke('products:getAll', params),
  getProduct: (id: string) => ipcRenderer.invoke('products:getOne', id),
  createProduct: (data: any) => ipcRenderer.invoke('products:create', data),
  updateProduct: (id: string, data: any) => ipcRenderer.invoke('products:update', id, data),
  deleteProduct: (id: string) => ipcRenderer.invoke('products:delete', id),

  // Invoices
  createInvoice: (data: any) => ipcRenderer.invoke('invoices:create', data),
  getInvoices: (params?: any) => ipcRenderer.invoke('invoices:getAll', params),

  // Dashboard
  getDashboardStats: () => ipcRenderer.invoke('dashboard:stats'),
  getMonthlySubscriptions: (year: number) => ipcRenderer.invoke('dashboard:monthlySubscriptions', year),
  getMonthlyRevenue: (year: number) => ipcRenderer.invoke('dashboard:monthlyRevenue', year),

  // Backup
  createBackup: () => ipcRenderer.invoke('backup:create'),
  getBackups: () => ipcRenderer.invoke('backup:getAll'),
  restoreBackup: (filename: string) => ipcRenderer.invoke('backup:restore', filename),
  deleteBackup: (id: string) => ipcRenderer.invoke('backup:delete', id),

  // Settings
  getSetting: (key: string) => ipcRenderer.invoke('settings:get', key),
  setSetting: (key: string, value: string) => ipcRenderer.invoke('settings:set', key, value),
  getAllSettings: () => ipcRenderer.invoke('settings:getAll'),

  // File operations
  selectImage: () => ipcRenderer.invoke('file:selectImage'),
  saveFile: (data: any, filename: string) => ipcRenderer.invoke('file:save', data, filename),
});
