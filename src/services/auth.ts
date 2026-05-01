import { api } from './api';
import type { AuthSession, AuthUser } from './storage';

export type LoginRequest = {
  work_email: string;
  password: string;
};

export type LoginResponse = {
  access: string;
  refresh: string;
  user: AuthUser;
};

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/auth/login/', body);
  return res.data;
}

export async function refresh(body: { refresh: string }): Promise<{ access: string }> {
  const res = await api.post<{ access: string }>('/auth/refresh/', body);
  return res.data;
}

export function toSession(r: LoginResponse): AuthSession {
  return { access: r.access, refresh: r.refresh, user: r.user };
}

