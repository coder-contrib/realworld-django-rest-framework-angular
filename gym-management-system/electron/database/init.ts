import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as path from 'path';
import * as fs from 'fs';
import { app } from 'electron';

let prisma: PrismaClient;

export function getPrisma(): PrismaClient {
  if (!prisma) {
    const dbPath = path.join(app.getPath('userData'), 'database.sqlite');
    const storageDir = path.dirname(dbPath);

    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    process.env['DATABASE_URL'] = `file:${dbPath}`;
    prisma = new PrismaClient();
  }
  return prisma;
}

export async function initializeDatabase(): Promise<void> {
  const db = getPrisma();

  // Create default admin user if not exists
  const adminExists = await db.user.findUnique({
    where: { username: 'Admin' }
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin', 10);
    await db.user.create({
      data: {
        username: 'Admin',
        password: hashedPassword,
        fullName: 'مدير النظام',
        role: 'admin',
      }
    });
    console.log('Default admin user created: Admin/Admin');
  }

  // Create default settings
  const settings = [
    { key: 'gym_name', value: 'النادي الرياضي' },
    { key: 'gym_phone', value: '' },
    { key: 'gym_address', value: '' },
    { key: 'currency', value: 'SAR' },
    { key: 'auto_backup', value: 'true' },
    { key: 'backup_time', value: '00:00' },
    { key: 'session_timeout', value: '30' },
    { key: 'theme', value: 'dark' },
  ];

  for (const setting of settings) {
    const exists = await db.setting.findUnique({ where: { key: setting.key } });
    if (!exists) {
      await db.setting.create({ data: setting });
    }
  }
}
