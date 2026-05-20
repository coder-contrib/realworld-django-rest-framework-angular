import { ipcMain } from 'electron';
import { getPrisma } from '../database/init';

export function registerSettingsHandlers(): void {
  const prisma = getPrisma();

  ipcMain.handle('settings:get', async (_event, key: string) => {
    try {
      const setting = await prisma.setting.findUnique({ where: { key } });
      return { success: true, data: setting?.value || null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('settings:set', async (_event, key: string, value: string) => {
    try {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('settings:getAll', async () => {
    try {
      const settings = await prisma.setting.findMany();
      const settingsMap: Record<string, string> = {};
      settings.forEach(s => { settingsMap[s.key] = s.value; });
      return { success: true, data: settingsMap };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}
