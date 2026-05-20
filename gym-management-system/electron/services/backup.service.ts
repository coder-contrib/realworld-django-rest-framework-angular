import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import { getPrisma } from '../database/init';

const BACKUP_DIR = path.join(app.getPath('userData'), 'backups');

function ensureBackupDir(): void {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

export async function createBackup(): Promise<{ filename: string; size: number }> {
  ensureBackupDir();

  const prisma = getPrisma();
  const dbPath = path.join(app.getPath('userData'), 'database.sqlite');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-${timestamp}.sqlite`;
  const backupPath = path.join(BACKUP_DIR, filename);

  // Copy database file
  fs.copyFileSync(dbPath, backupPath);

  const stats = fs.statSync(backupPath);

  // Record backup in database
  await prisma.backup.create({
    data: {
      filename,
      size: stats.size,
      type: 'manual',
    },
  });

  // Clean old backups (keep last 30)
  await cleanOldBackups();

  return { filename, size: stats.size };
}

export function getBackupsList(): string[] {
  ensureBackupDir();
  return fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.sqlite'));
}

export async function restoreFromBackup(filename: string): Promise<void> {
  const backupPath = path.join(BACKUP_DIR, filename);
  const dbPath = path.join(app.getPath('userData'), 'database.sqlite');

  if (!fs.existsSync(backupPath)) {
    throw new Error('ملف النسخة الاحتياطية غير موجود');
  }

  // Close current connection
  const prisma = getPrisma();
  await prisma.$disconnect();

  // Restore
  fs.copyFileSync(backupPath, dbPath);
}

export function deleteBackupFile(filename: string): void {
  const backupPath = path.join(BACKUP_DIR, filename);
  if (fs.existsSync(backupPath)) {
    fs.unlinkSync(backupPath);
  }
}

async function cleanOldBackups(): Promise<void> {
  const prisma = getPrisma();
  const backups = await prisma.backup.findMany({
    orderBy: { createdAt: 'desc' },
    skip: 30,
  });

  for (const backup of backups) {
    deleteBackupFile(backup.filename);
    await prisma.backup.delete({ where: { id: backup.id } });
  }
}

export function startAutoBackup(): void {
  // Run auto backup at midnight
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const msUntilMidnight = midnight.getTime() - now.getTime();

  setTimeout(() => {
    performAutoBackup();
    // Then every 24 hours
    setInterval(performAutoBackup, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);
}

async function performAutoBackup(): Promise<void> {
  try {
    ensureBackupDir();
    const prisma = getPrisma();
    const dbPath = path.join(app.getPath('userData'), 'database.sqlite');
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `auto-backup-${timestamp}.sqlite`;
    const backupPath = path.join(BACKUP_DIR, filename);

    fs.copyFileSync(dbPath, backupPath);
    const stats = fs.statSync(backupPath);

    await prisma.backup.create({
      data: {
        filename,
        size: stats.size,
        type: 'auto',
      },
    });

    await cleanOldBackups();
    console.log(`Auto backup created: ${filename}`);
  } catch (error) {
    console.error('Auto backup failed:', error);
  }
}
