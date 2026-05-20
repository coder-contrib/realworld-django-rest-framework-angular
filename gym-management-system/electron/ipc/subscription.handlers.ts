import { ipcMain } from 'electron';
import { getPrisma } from '../database/init';

export function registerSubscriptionHandlers(): void {
  const prisma = getPrisma();

  ipcMain.handle('subscriptions:getAll', async (_event, params?: any) => {
    try {
      const { page = 1, limit = 20, status = 'all', memberId } = params || {};
      const skip = (page - 1) * limit;

      const where: any = {};
      if (status !== 'all') where.status = status;
      if (memberId) where.memberId = memberId;

      const [subscriptions, total] = await Promise.all([
        prisma.subscription.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { member: true },
        }),
        prisma.subscription.count({ where }),
      ]);

      return { success: true, data: { subscriptions, total, page, limit } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('subscriptions:getOne', async (_event, id: string) => {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { id },
        include: { member: true },
      });
      return { success: true, data: subscription };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('subscriptions:create', async (_event, data: any) => {
    try {
      const subscription = await prisma.subscription.create({
        data,
        include: { member: true },
      });
      return { success: true, data: subscription };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('subscriptions:update', async (_event, id: string, data: any) => {
    try {
      const subscription = await prisma.subscription.update({
        where: { id },
        data,
      });
      return { success: true, data: subscription };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('subscriptions:freeze', async (_event, id: string) => {
    try {
      const subscription = await prisma.subscription.update({
        where: { id },
        data: {
          status: 'frozen',
          frozenAt: new Date(),
        },
      });
      return { success: true, data: subscription };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('subscriptions:unfreeze', async (_event, id: string) => {
    try {
      const sub = await prisma.subscription.findUnique({ where: { id } });
      if (!sub || !sub.frozenAt) {
        return { success: false, error: 'الاشتراك غير مجمد' };
      }

      const frozenDays = Math.ceil(
        (Date.now() - sub.frozenAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      const newEndDate = new Date(sub.endDate);
      newEndDate.setDate(newEndDate.getDate() + frozenDays);

      const subscription = await prisma.subscription.update({
        where: { id },
        data: {
          status: 'active',
          frozenAt: null,
          frozenDays: sub.frozenDays + frozenDays,
          endDate: newEndDate,
        },
      });
      return { success: true, data: subscription };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('subscriptions:renew', async (_event, id: string, data: any) => {
    try {
      const subscription = await prisma.subscription.update({
        where: { id },
        data: {
          status: 'active',
          startDate: new Date(),
          endDate: data.endDate,
          price: data.price,
          type: data.type,
        },
      });
      return { success: true, data: subscription };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('subscriptions:cancel', async (_event, id: string) => {
    try {
      const subscription = await prisma.subscription.update({
        where: { id },
        data: { status: 'cancelled' },
      });
      return { success: true, data: subscription };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('subscriptions:expiringSoon', async () => {
    try {
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      const subscriptions = await prisma.subscription.findMany({
        where: {
          status: 'active',
          endDate: {
            lte: sevenDaysFromNow,
            gte: new Date(),
          },
        },
        include: { member: true },
        orderBy: { endDate: 'asc' },
      });

      return { success: true, data: subscriptions };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}
