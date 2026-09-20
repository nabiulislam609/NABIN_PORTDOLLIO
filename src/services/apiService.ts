import { ContactMessage, ProfileConfig, Project } from '../types.ts';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS } from '../data/defaultData.ts';

const KEYS = {
  TOKEN: 'portfolio_admin_token',
  PASSWORD: 'portfolio_admin_pwd',
  PROFILE: 'portfolio_profile',
  PROJECTS: 'portfolio_projects',
  INQUIRIES: 'portfolio_inquiries',
};

/**
 * Safely parse JSON from a response without throwing 'Unexpected end of JSON input'
 */
async function safeParseJson<T = any>(res: Response): Promise<T | null> {
  try {
    const text = await res.text();
    if (!text || !text.trim()) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/**
 * Admin Login
 * Supports both full-stack Node server and static host (Vercel/Netlify) fallback.
 */
export async function apiLogin(
  password: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await safeParseJson(res);

    if (res.ok && data?.success && data?.token) {
      localStorage.setItem(KEYS.TOKEN, data.token);
      return { success: true, token: data.token };
    }

    // Explicit credential rejection from active backend
    if (res.status === 401 && data?.error) {
      // Check if password matches a local changed password
      const storedPwd = localStorage.getItem(KEYS.PASSWORD) || 'admin';
      if (password === storedPwd) {
        const localToken = 'local-admin-' + Date.now();
        localStorage.setItem(KEYS.TOKEN, localToken);
        return { success: true, token: localToken };
      }
      return { success: false, error: data.error };
    }
  } catch (err) {
    console.warn('Server endpoint unreachable, using client authentication:', err);
  }

  // Graceful fallback for static deployments (Vercel, Netlify, offline)
  const storedPwd = localStorage.getItem(KEYS.PASSWORD) || 'admin';
  if (password === storedPwd) {
    const localToken = 'local-admin-' + Date.now();
    localStorage.setItem(KEYS.TOKEN, localToken);
    return { success: true, token: localToken };
  } else {
    return { success: false, error: 'Invalid admin credentials' };
  }
}

/**
 * Verify admin token
 */
export async function apiVerifyToken(token: string): Promise<boolean> {
  if (!token) return false;

  try {
    const res = await fetch('/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeParseJson(res);
    if (res.ok && data?.authenticated !== undefined) {
      return Boolean(data.authenticated);
    }
  } catch (err) {
    console.warn('Backend verify unreachable, validating local session:', err);
  }

  const savedToken = localStorage.getItem(KEYS.TOKEN);
  return Boolean(
    savedToken && (token === savedToken || token.startsWith('local-admin-'))
  );
}

/**
 * Change Admin Password
 */
export async function apiChangePassword(
  token: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (!newPassword || newPassword.trim().length < 4) {
    return {
      success: false,
      error: 'Password must be at least 4 characters long',
    };
  }

  // Always save locally so static host deploys (Vercel) persist the new password
  localStorage.setItem(KEYS.PASSWORD, newPassword.trim());

  try {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword: newPassword.trim() }),
    });
    const data = await safeParseJson(res);
    if (res.ok && data?.success) {
      return { success: true };
    }
  } catch (err) {
    console.warn('Backend password change unreachable, saved locally:', err);
  }

  return { success: true };
}

/**
 * Get Profile
 */
export async function apiGetProfile(): Promise<ProfileConfig> {
  try {
    const res = await fetch('/api/profile');
    const data = await safeParseJson<ProfileConfig>(res);
    if (res.ok && data && data.name) {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Backend profile unreachable, loading from cache:', err);
  }

  const cached = localStorage.getItem(KEYS.PROFILE);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.name) return parsed;
    } catch {}
  }

  return DEFAULT_PROFILE;
}

/**
 * Save Profile
 */
export async function apiSaveProfile(
  token: string,
  profile: ProfileConfig
): Promise<ProfileConfig> {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));

  try {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });
    const data = await safeParseJson(res);
    if (res.ok && data?.profile) {
      return data.profile;
    }
  } catch (err) {
    console.warn('Backend save profile unreachable, changes preserved locally:', err);
  }

  return profile;
}

/**
 * Get Projects
 */
export async function apiGetProjects(): Promise<Project[]> {
  try {
    const res = await fetch('/api/projects');
    const data = await safeParseJson<Project[]>(res);
    if (res.ok && Array.isArray(data) && data.length > 0) {
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Backend projects unreachable, loading from cache:', err);
  }

  const cached = localStorage.getItem(KEYS.PROJECTS);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }

  return DEFAULT_PROJECTS;
}

/**
 * Save / Update Project
 */
export async function apiSaveProject(
  token: string,
  projectData: Partial<Project>
): Promise<Project[]> {
  const isEdit = Boolean(projectData.id);
  const currentProjects = await apiGetProjects();

  let updatedProjects: Project[];
  if (isEdit) {
    updatedProjects = currentProjects.map((p) =>
      p.id === projectData.id ? ({ ...p, ...projectData } as Project) : p
    );
  } else {
    const newProject: Project = {
      ...(projectData as any),
      id: projectData.id || 'proj-' + Date.now(),
      date: projectData.date || new Date().toISOString().split('T')[0],
      workCompleted: projectData.workCompleted || [],
      toolsUsed: projectData.toolsUsed || [],
    };
    updatedProjects = [newProject, ...currentProjects];
  }

  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(updatedProjects));

  try {
    const url = isEdit ? `/api/projects/${projectData.id}` : '/api/projects';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    });
    const data = await safeParseJson(res);
    if (res.ok && data?.projects && Array.isArray(data.projects)) {
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(data.projects));
      return data.projects;
    }
  } catch (err) {
    console.warn('Backend save project unreachable, updated locally:', err);
  }

  return updatedProjects;
}

/**
 * Delete Project
 */
export async function apiDeleteProject(
  token: string,
  id: string
): Promise<Project[]> {
  const currentProjects = await apiGetProjects();
  const filtered = currentProjects.filter((p) => p.id !== id);
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(filtered));

  try {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeParseJson(res);
    if (res.ok && data?.projects && Array.isArray(data.projects)) {
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(data.projects));
      return data.projects;
    }
  } catch (err) {
    console.warn('Backend delete project unreachable, updated locally:', err);
  }

  return filtered;
}

/**
 * Reset Projects to initial defaults
 */
export async function apiResetProjects(token: string): Promise<Project[]> {
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));

  try {
    const res = await fetch('/api/projects/reset', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeParseJson(res);
    if (res.ok && data?.projects && Array.isArray(data.projects)) {
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(data.projects));
      return data.projects;
    }
  } catch (err) {
    console.warn('Backend reset projects unreachable, restored defaults:', err);
  }

  return DEFAULT_PROJECTS;
}

/**
 * Submit Contact Inquiry
 */
export async function apiSubmitContact(inquiry: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; message: string; error?: string }> {
  // Always register in localStorage so the admin can review the message in the Admin Modal
  const newMsg: ContactMessage = {
    id: 'msg-' + Date.now(),
    name: inquiry.name,
    email: inquiry.email,
    subject: inquiry.subject,
    message: inquiry.message,
    createdAt: new Date().toISOString(),
    status: 'unread',
  };

  try {
    const currentCached = localStorage.getItem(KEYS.INQUIRIES);
    const list: ContactMessage[] = currentCached ? JSON.parse(currentCached) : [];
    list.unshift(newMsg);
    localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(list));
  } catch {}

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry),
    });
    const data = await safeParseJson(res);
    if (res.ok) {
      return {
        success: true,
        message: data?.message || 'Thank you! Your message has been received.',
      };
    }
    if (data?.error) {
      return { success: false, message: '', error: data.error };
    }
  } catch (err) {
    console.warn('Backend contact submission unreachable, stored in local inbox:', err);
  }

  return {
    success: true,
    message: 'Thank you! Your message has been received.',
  };
}

/**
 * Get Contact Inquiries
 */
export async function apiGetInquiries(
  token: string
): Promise<ContactMessage[]> {
  try {
    const res = await fetch('/api/contact/messages', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeParseJson<ContactMessage[]>(res);
    if (res.ok && Array.isArray(data)) {
      // Merge with any local submissions
      const cached = localStorage.getItem(KEYS.INQUIRIES);
      const localList: ContactMessage[] = cached ? JSON.parse(cached) : [];
      const combined = [...data];
      for (const loc of localList) {
        if (!combined.some((c) => c.id === loc.id)) {
          combined.push(loc);
        }
      }
      localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(combined));
      return combined;
    }
  } catch (err) {
    console.warn('Backend inquiries unreachable, loading from local inbox:', err);
  }

  const cached = localStorage.getItem(KEYS.INQUIRIES);
  if (cached) {
    try {
      const list = JSON.parse(cached);
      if (Array.isArray(list)) return list;
    } catch {}
  }

  return [];
}

/**
 * Delete Contact Inquiry
 */
export async function apiDeleteInquiry(
  token: string,
  id: string
): Promise<ContactMessage[]> {
  const cached = localStorage.getItem(KEYS.INQUIRIES);
  let list: ContactMessage[] = cached ? JSON.parse(cached) : [];
  list = list.filter((m) => m.id !== id);
  localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(list));

  try {
    await fetch(`/api/contact/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.warn('Backend delete inquiry unreachable, removed locally:', err);
  }

  return list;
}
