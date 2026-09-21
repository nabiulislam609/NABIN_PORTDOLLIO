import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS } from './src/data/defaultData.ts';
import { Project, ProfileConfig, ContactMessage } from './src/types.ts';

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const PROFILE_FILE = path.join(DATA_DIR, 'profile.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const AUTH_FILE = path.join(DATA_DIR, 'auth.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Data loaders
function getProjects(): Project[] {
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading projects.json:', e);
  }
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(DEFAULT_PROJECTS, null, 2));
  return DEFAULT_PROJECTS;
}

function saveProjects(projects: Project[]) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

function getProfile(): ProfileConfig {
  try {
    if (fs.existsSync(PROFILE_FILE)) {
      const data = fs.readFileSync(PROFILE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading profile.json:', e);
  }
  fs.writeFileSync(PROFILE_FILE, JSON.stringify(DEFAULT_PROFILE, null, 2));
  return DEFAULT_PROFILE;
}

function saveProfile(profile: ProfileConfig) {
  fs.writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2));
}

function getMessages(): ContactMessage[] {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const data = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading messages.json:', e);
  }
  return [];
}

function saveMessages(messages: ContactMessage[]) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

interface AuthData {
  adminPassword: string;
  sessionSecret: string;
}

function getAuthData(): AuthData {
  try {
    if (fs.existsSync(AUTH_FILE)) {
      const data = fs.readFileSync(AUTH_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      // Ensure deprecated 'admin' password cannot be used; enforce NABIN
      if (!parsed.adminPassword || parsed.adminPassword === 'admin') {
        parsed.adminPassword = 'NABIN';
        fs.writeFileSync(AUTH_FILE, JSON.stringify(parsed, null, 2));
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading auth.json:', e);
  }
  const defaultAuth: AuthData = {
    adminPassword: 'NABIN', // Master administrator password
    sessionSecret: 'portfolio_admin_token_' + Math.random().toString(36).substring(2),
  };
  fs.writeFileSync(AUTH_FILE, JSON.stringify(defaultAuth, null, 2));
  return defaultAuth;
}

function saveAuthData(auth: AuthData) {
  fs.writeFileSync(AUTH_FILE, JSON.stringify(auth, null, 2));
}

// Ensure defaults exist
getProjects();
getProfile();
getAuthData();

async function startServer() {
  const app = express();

  // Middleware
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Auth Middleware
  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const auth = getAuthData();
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
    }
    const token = authHeader.split(' ')[1];
    if (token !== auth.sessionSecret) {
      return res.status(403).json({ error: 'Forbidden: Invalid or expired admin session' });
    }
    next();
  };

  // ==================== AUTH APIS ====================
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { password } = req.body;
    const auth = getAuthData();

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    if (password === 'admin') {
      return res.status(401).json({ error: 'The default password "admin" is disabled. Please enter "NABIN".' });
    }

    if (password === auth.adminPassword) {
      return res.json({
        success: true,
        token: auth.sessionSecret,
        message: 'Admin authentication successful',
      });
    } else {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
  });

  app.get('/api/auth/verify', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const auth = getAuthData();
    if (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1] === auth.sessionSecret) {
      return res.json({ authenticated: true });
    }
    return res.json({ authenticated: false });
  });

  app.post('/api/auth/change-password', requireAdmin, (req: Request, res: Response) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.trim().length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long' });
    }
    const auth = getAuthData();
    auth.adminPassword = newPassword.trim();
    saveAuthData(auth);
    return res.json({ success: true, message: 'Admin password updated successfully' });
  });

  // ==================== PROFILE APIS ====================
  app.get('/api/profile', (_req: Request, res: Response) => {
    const profile = getProfile();
    res.json(profile);
  });

  app.put('/api/profile', requireAdmin, (req: Request, res: Response) => {
    const updated = req.body as ProfileConfig;
    if (!updated || !updated.name) {
      return res.status(400).json({ error: 'Invalid profile data' });
    }
    saveProfile(updated);
    res.json({ success: true, profile: updated });
  });

  // ==================== PROJECTS APIS ====================
  app.get('/api/projects', (_req: Request, res: Response) => {
    const projects = getProjects();
    res.json(projects);
  });

  app.post('/api/projects', requireAdmin, (req: Request, res: Response) => {
    const { title, category, image, images, description, goals, workCompleted, results, projectUrl, date, clientIndustry, strategy, toolsUsed, featured } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ error: 'Title, Category, and Description are required' });
    }

    const projects = getProjects();
    const newProject: Project = {
      id: 'proj-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      title: title.trim(),
      category: category.trim(),
      image: image?.trim() || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
      images: Array.isArray(images) ? images.filter(Boolean) : [],
      description: description.trim(),
      goals: goals?.trim() || '',
      workCompleted: Array.isArray(workCompleted) ? workCompleted : typeof workCompleted === 'string' ? workCompleted.split('\n').filter(Boolean) : [],
      results: results?.trim() || 'Significant growth & improved KPI performance',
      projectUrl: projectUrl?.trim() || '',
      date: date?.trim() || new Date().getFullYear().toString(),
      clientIndustry: clientIndustry?.trim() || 'Digital Business',
      strategy: strategy?.trim() || '',
      toolsUsed: Array.isArray(toolsUsed) ? toolsUsed : typeof toolsUsed === 'string' ? toolsUsed.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      featured: Boolean(featured),
    };

    projects.unshift(newProject);
    saveProjects(projects);
    res.status(201).json({ success: true, project: newProject });
  });

  app.put('/api/projects/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const projects = getProjects();
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const { title, category, image, images, description, goals, workCompleted, results, projectUrl, date, clientIndustry, strategy, toolsUsed, featured } = req.body;

    const updatedProject: Project = {
      ...projects[index],
      title: title !== undefined ? title.trim() : projects[index].title,
      category: category !== undefined ? category.trim() : projects[index].category,
      image: image !== undefined ? image.trim() : projects[index].image,
      images: images !== undefined ? (Array.isArray(images) ? images.filter(Boolean) : []) : projects[index].images || [],
      description: description !== undefined ? description.trim() : projects[index].description,
      goals: goals !== undefined ? goals.trim() : projects[index].goals,
      workCompleted: Array.isArray(workCompleted)
        ? workCompleted
        : typeof workCompleted === 'string'
        ? workCompleted.split('\n').filter(Boolean)
        : projects[index].workCompleted,
      results: results !== undefined ? results.trim() : projects[index].results,
      projectUrl: projectUrl !== undefined ? projectUrl.trim() : projects[index].projectUrl,
      date: date !== undefined ? date.trim() : projects[index].date,
      clientIndustry: clientIndustry !== undefined ? clientIndustry.trim() : projects[index].clientIndustry,
      strategy: strategy !== undefined ? strategy.trim() : projects[index].strategy,
      toolsUsed: Array.isArray(toolsUsed)
        ? toolsUsed
        : typeof toolsUsed === 'string'
        ? toolsUsed.split(',').map((t: string) => t.trim()).filter(Boolean)
        : projects[index].toolsUsed,
      featured: featured !== undefined ? Boolean(featured) : projects[index].featured,
    };

    projects[index] = updatedProject;
    saveProjects(projects);
    res.json({ success: true, project: updatedProject });
  });

  app.delete('/api/projects/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const projects = getProjects();
    const filtered = projects.filter(p => p.id !== id);

    if (filtered.length === projects.length) {
      return res.status(404).json({ error: 'Project not found' });
    }

    saveProjects(filtered);
    res.json({ success: true, message: 'Project deleted successfully' });
  });

  app.post('/api/projects/reset', requireAdmin, (_req: Request, res: Response) => {
    saveProjects(DEFAULT_PROJECTS);
    res.json({ success: true, projects: DEFAULT_PROJECTS, message: 'Restored default projects' });
  });

  // ==================== CONTACT APIS ====================
  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide name, email, and message.' });
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const messages = getMessages();
    const newMessage: ContactMessage = {
      id: 'msg-' + Date.now().toString(36),
      name: name.trim(),
      email: email.trim(),
      subject: subject ? subject.trim() : 'Project Inquiry',
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'unread',
    };

    messages.unshift(newMessage);
    saveMessages(messages);

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. I will get back to you shortly.',
    });
  });

  app.get('/api/contact/messages', requireAdmin, (_req: Request, res: Response) => {
    const messages = getMessages();
    res.json(messages);
  });

  app.delete('/api/contact/messages/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const messages = getMessages();
    const filtered = messages.filter(m => m.id !== id);
    saveMessages(filtered);
    res.json({ success: true });
  });

  app.put('/api/contact/messages/:id/read', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const messages = getMessages();
    const target = messages.find(m => m.id === id);
    if (target) {
      target.status = 'read';
      saveMessages(messages);
    }
    res.json({ success: true, messages });
  });

  // ==================== IMAGE UPLOAD API ====================
  app.post('/api/upload', requireAdmin, (req: Request, res: Response) => {
    const { dataUrl, filename } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ error: 'dataUrl is required' });
    }

    // If dataUrl is a base64 string, we can return it directly or write to public upload folder
    // For maximum portability and instant persistence, dataUrl or hosted path works seamlessly
    return res.json({
      success: true,
      url: dataUrl,
    });
  });

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
