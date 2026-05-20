import { ipcMain } from 'electron';
import { getPrisma } from '../database/init';

export function registerPaymentHandlers(): void {
  const prisma = getPrisma();

  ipcMain.handle('payments:getAll', async (_event, params?: any) => {
    try {
      const { page = 1, limit = 20, memberId } = params || {};
      const skip = (page - 1) * limit;

      const where: any = {};
      if (memberId) where.memberId = memberId;

      const [payments, total] = await Promise.all([
        prisma.payment.findMany({
          where,
          skip,
          take: limit,
          include: { member: true },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.payment.count({ where }),
      ]);

      return { success: true, data: { payments, total, page, limit } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('payments:create', async (_event, data: any) => {
    try {
      // Generate invoice number
      const count = await prisma.payment.count();
      const invoiceNumber = `INV-${String(count + 1).padStart(6, '0')}`;

      const payment = await prisma.payment.create({
        data: {
          ...data,
          invoiceNumber,
        },
        include: { member: true },
      });

      return { success: true, data: payment };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('payments:getOne', async (_event, id: string) => {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id },
        include: { member: true },
      });
      return { success: true, data: payment };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}
