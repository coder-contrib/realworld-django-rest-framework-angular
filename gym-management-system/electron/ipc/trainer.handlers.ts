import { ipcMain } from 'electron';
import { getPrisma } from '../database/init';

export function registerTrainerHandlers(): void {
  const prisma = getPrisma();

  ipcMain.handle('trainers:getAll', async (_event, params?: any) => {
    try {
      const { page = 1, limit = 20 } = params || {};
      const skip = (page - 1) * limit;

      const [trainers, total] = await Promise.all([
        prisma.trainer.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { sessions: true },
        }),
        prisma.trainer.count(),
      ]);

      return { success: true, data: { trainers, total, page, limit } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('trainers:getOne', async (_event, id: string) => {
    try {
      const trainer = await prisma.trainer.findUnique({
        where: { id },
        include: { sessions: true },
      });
      return { success: true, data: trainer };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('trainers:create', async (_event, data: any) => {
    try {
      const trainer = await prisma.trainer.create({ data });
      return { success: true, data: trainer };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('trainers:update', async (_event, id: string, data: any) => {
    try {
      const trainer = await prisma.trainer.update({ where: { id }, data });
      return { success: true, data: trainer };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('trainers:delete', async (_event, id: string) => {
    try {
      await prisma.trainer.delete({ where: { id } });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}
