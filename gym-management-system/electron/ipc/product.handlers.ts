import { ipcMain } from 'electron';
import { getPrisma } from '../database/init';

export function registerProductHandlers(): void {
  const prisma = getPrisma();

  ipcMain.handle('products:getAll', async (_event, params?: any) => {
    try {
      const { page = 1, limit = 20, category } = params || {};
      const skip = (page - 1) * limit;

      const where: any = { isActive: true };
      if (category) where.category = category;

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where }),
      ]);

      return { success: true, data: { products, total, page, limit } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('products:getOne', async (_event, id: string) => {
    try {
      const product = await prisma.product.findUnique({ where: { id } });
      return { success: true, data: product };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('products:create', async (_event, data: any) => {
    try {
      const product = await prisma.product.create({ data });
      return { success: true, data: product };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('products:update', async (_event, id: string, data: any) => {
    try {
      const product = await prisma.product.update({ where: { id }, data });
      return { success: true, data: product };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('products:delete', async (_event, id: string) => {
    try {
      await prisma.product.update({ where: { id }, data: { isActive: false } });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}
