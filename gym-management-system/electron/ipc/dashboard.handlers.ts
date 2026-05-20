import { ipcMain } from 'electron';
import { getPrisma } from '../database/init';

export function registerDashboardHandlers(): void {
  const prisma = getPrisma();

  ipcMain.handle('dashboard:stats', async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [
        totalMembers,
        attendanceToday,
        expiredSubscriptions,
        dailyRevenue,
      ] = await Promise.all([
        prisma.member.count({ where: { isActive: true } }),
        prisma.attendance.count({ where: { checkIn: { gte: today } } }),
        prisma.subscription.count({
          where: { status: 'active', endDate: { lt: new Date() } },
        }),
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: { createdAt: { gte: today } },
        }),
      ]);

      return {
        success: true,
        data: {
          totalMembers,
          attendanceToday,
          expiredSubscriptions,
          dailyRevenue: dailyRevenue._sum.amount || 0,
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('dashboard:monthlySubscriptions', async (_event, year: number) => {
    try {
      const monthlyData: number[] = [];

      for (let month = 0; month < 12; month++) {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

        const count = await prisma.subscription.count({
          where: {
            createdAt: { gte: startDate, lte: endDate },
          },
        });
        monthlyData.push(count);
      }

      return { success: true, data: monthlyData };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('dashboard:monthlyRevenue', async (_event, year: number) => {
    try {
      const monthlyData: number[] = [];

      for (let month = 0; month < 12; month++) {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

        const revenue = await prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            createdAt: { gte: startDate, lte: endDate },
          },
        });
        monthlyData.push(revenue._sum.amount || 0);
      }

      return { success: true, data: monthlyData };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}
