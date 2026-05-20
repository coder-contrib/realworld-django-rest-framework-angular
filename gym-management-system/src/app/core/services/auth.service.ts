import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authState = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  authState$ = this.authState.asObservable();

  constructor() {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.authState.next(parsed);
      } catch {
        localStorage.removeItem('auth');
      }
    }
  }

  get isAuthenticated(): boolean {
    return this.authState.value.isAuthenticated;
  }

  get currentUser(): User | null {
    return this.authState.value.user;
  }

  get token(): string | null {
    return this.authState.value.token;
  }

  async login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const electronAPI = (window as any).electronAPI;

      if (electronAPI) {
        const result = await electronAPI.login(username, password);
        if (result.success) {
          const state: AuthState = {
            isAuthenticated: true,
            user: result.data.user,
            token: result.data.token,
          };
          this.authState.next(state);
          localStorage.setItem('auth', JSON.stringify(state));
          return { success: true };
        }
        return { success: false, error: result.error };
      }

      // Demo mode - simulate login for web preview
      if (username === 'Admin' && password === 'Admin') {
        const state: AuthState = {
          isAuthenticated: true,
          user: { id: '1', username: 'Admin', fullName: 'مدير النظام', role: 'admin' },
          token: 'demo-token',
        };
        this.authState.next(state);
        localStorage.setItem('auth', JSON.stringify(state));
        return { success: true };
      }

      return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
    } catch (error: any) {
      return { success: false, error: error.message || 'حدث خطأ غير متوقع' };
    }
  }

  logout(): void {
    this.authState.next({ isAuthenticated: false, user: null, token: null });
    localStorage.removeItem('auth');
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role || this.currentUser?.role === 'admin';
  }
}
