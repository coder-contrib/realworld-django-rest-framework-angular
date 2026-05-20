import { ipcMain } from 'electron';
import { getPrisma } from '../database/init';

export function registerAttendanceHandlers(): void {
  const prisma = getPrisma();

  ipcMain.handle('attendance:checkIn', async (_event, memberId: string) => {
    try {
      const member = await prisma.member.findUnique({ where: { id: memberId } });
      if (!member) {
        return { success: false, error: 'العضو غير موجود' };
      }

      // Check for active subscription
      const activeSubscription = await prisma.subscription.findFirst({
        where: {
          memberId,
          status: 'active',
          endDate: { gte: new Date() },
        },
      });

      if (!activeSubscription) {
        return { success: false, error: 'لا يوجد اشتراك فعال لهذا العضو' };
      }

      const attendance = await prisma.attendance.create({
        data: { memberId },
        include: { member: true },
      });

      return { success: true, data: attendance };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('attendance:checkInByQR', async (_event, qrCode: string) => {
    try {
      const member = await prisma.member.findUnique({
        where: { qrCode },
      });

      if (!member) {
        return { success: false, error: 'رمز QR غير صالح' };
      }

      // Check for active subscription
      const activeSubscription = await prisma.subscription.findFirst({
        where: {
          memberId: member.id,
          status: 'active',
          endDate: { gte: new Date() },
        },
      });

      if (!activeSubscription) {
        return { success: false, error: `لا يوجد اشتراك فعال للعضو: ${member.fullName}` };
      }

      const attendance = await prisma.attendance.create({
        data: { memberId: member.id },
        include: { member: true },
      });

      return { success: true, data: { attendance, member } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('attendance:today', async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const attendances = await prisma.attendance.findMany({
        where: {
          checkIn: { gte: today },
        },
        include: { member: true },
        orderBy: { checkIn: 'desc' },
      });

      return { success: true, data: attendances };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('attendance:history', async (_event, params?: any) => {
    try {
      const { page = 1, limit = 50, memberId, date } = params || {};
      const skip = (page - 1) * limit;

      const where: any = {};
      if (memberId) where.memberId = memberId;
      if (date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        where.checkIn = { gte: start, lte: end };
      }

      const [attendances, total] = await Promise.all([
        prisma.attendance.findMany({
          where,
          skip,
          take: limit,
          include: { member: true },
          orderBy: { checkIn: 'desc' },
        }),
        prisma.attendance.count({ where }),
      ]);

      return { success: true, data: { attendances, total, page, limit } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('attendance:currentCount', async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const count = await prisma.attendance.count({
        where: {
          checkIn: { gte: today },
        },
      });

      return { success: true, data: count };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}
