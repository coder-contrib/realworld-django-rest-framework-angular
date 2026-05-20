import { ipcMain } from 'electron';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { getPrisma } from '../database/init';

const JWT_SECRET = 'gym-management-secret-key-2024';
const TOKEN_EXPIRY = '24h';

export function registerAuthHandlers(): void {
  const prisma = getPrisma();

  ipcMain.handle('auth:login', async (_event, username: string, password: string) => {
    try {
      const user = await prisma.user.findUnique({ where: { username } });

      if (!user || !user.isActive) {
        return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      return {
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
          }
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('auth:logout', async () => {
    return { success: true };
  });

  ipcMain.handle('auth:getCurrentUser', async (_event) => {
    // This would typically verify the token
    return { success: true };
  });

  ipcMain.handle('auth:changePassword', async (_event, oldPassword: string, newPassword: string) => {
    try {
      // Implementation would use current user context
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}
