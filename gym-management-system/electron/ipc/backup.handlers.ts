import { ipcMain } from 'electron';
import { getPrisma } from '../database/init';
import { createBackup as createBackupFile, getBackupsList, restoreFromBackup, deleteBackupFile } from '../services/backup.service';

export function registerBackupHandlers(): void {
  const prisma = getPrisma();

  ipcMain.handle('backup:create', async () => {
    try {
      const result = await createBackupFile();
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('backup:getAll', async () => {
    try {
      const backups = await prisma.backup.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return { success: true, data: backups };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('backup:restore', async (_event, filename: string) => {
    try {
      await restoreFromBackup(filename);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('backup:delete', async (_event, id: string) => {
    try {
      const backup = await prisma.backup.findUnique({ where: { id } });
      if (backup) {
        deleteBackupFile(backup.filename);
        await prisma.backup.delete({ where: { id } });
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}
