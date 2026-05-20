import { app, BrowserWindow, ipcMain, session } from 'electron';
import * as path from 'path';
import { initializeDatabase } from './database/init';
import { registerAuthHandlers } from './ipc/auth.handlers';
import { registerMemberHandlers } from './ipc/member.handlers';
import { registerSubscriptionHandlers } from './ipc/subscription.handlers';
import { registerAttendanceHandlers } from './ipc/attendance.handlers';
import { registerPaymentHandlers } from './ipc/payment.handlers';
import { registerTrainerHandlers } from './ipc/trainer.handlers';
import { registerProductHandlers } from './ipc/product.handlers';
import { registerDashboardHandlers } from './ipc/dashboard.handlers';
import { registerBackupHandlers } from './ipc/backup.handlers';
import { registerSettingsHandlers } from './ipc/settings.handlers';
import { startAutoBackup } from './services/backup.service';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    title: 'Gym Management System',
    icon: path.join(__dirname, '../src/assets/icons/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Load Angular app
  if (process.env['NODE_ENV'] === 'development') {
    mainWindow.loadURL('http://localhost:4200');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/browser/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

async function bootstrap(): Promise<void> {
  // Initialize database
  await initializeDatabase();

  // Register IPC handlers
  registerAuthHandlers();
  registerMemberHandlers();
  registerSubscriptionHandlers();
  registerAttendanceHandlers();
  registerPaymentHandlers();
  registerTrainerHandlers();
  registerProductHandlers();
  registerDashboardHandlers();
  registerBackupHandlers();
  registerSettingsHandlers();

  // Start auto backup
  startAutoBackup();
}

app.whenReady().then(async () => {
  await bootstrap();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
