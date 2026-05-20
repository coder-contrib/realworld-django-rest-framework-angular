import { ipcMain } from 'electron';
import { getPrisma } from '../database/init';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

export function registerMemberHandlers(): void {
  const prisma = getPrisma();

  ipcMain.handle('members:getAll', async (_event, params?: any) => {
    try {
      const { page = 1, limit = 20, search = '', status = 'all' } = params || {};
      const skip = (page - 1) * limit;

      const where: any = {};
      if (search) {
        where.OR = [
          { fullName: { contains: search } },
          { phone: { contains: search } },
          { qrCode: { contains: search } },
        ];
      }
      if (status !== 'all') {
        where.isActive = status === 'active';
      }

      const [members, total] = await Promise.all([
        prisma.member.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 },
          }
        }),
        prisma.member.count({ where }),
      ]);

      return { success: true, data: { members, total, page, limit } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('members:getOne', async (_event, id: string) => {
    try {
      const member = await prisma.member.findUnique({
        where: { id },
        include: {
          subscriptions: { orderBy: { createdAt: 'desc' } },
          attendances: { orderBy: { checkIn: 'desc' }, take: 30 },
          payments: { orderBy: { createdAt: 'desc' } },
          measurements: { orderBy: { createdAt: 'desc' } },
        }
      });

      if (!member) {
        return { success: false, error: 'العضو غير موجود' };
      }

      return { success: true, data: member };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('members:create', async (_event, data: any) => {
    try {
      // Generate unique QR code
      const qrCode = `GYM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const member = await prisma.member.create({
        data: {
          ...data,
          qrCode,
        }
      });

      return { success: true, data: member };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('members:update', async (_event, id: string, data: any) => {
    try {
      const member = await prisma.member.update({
        where: { id },
        data,
      });
      return { success: true, data: member };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('members:delete', async (_event, id: string) => {
    try {
      await prisma.member.delete({ where: { id } });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('members:search', async (_event, query: string) => {
    try {
      const members = await prisma.member.findMany({
        where: {
          OR: [
            { fullName: { contains: query } },
            { phone: { contains: query } },
            { qrCode: { contains: query } },
          ]
        },
        take: 10,
      });
      return { success: true, data: members };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}
