import { DEFAULT_PROJECTS } from '../src/data/defaultData.ts';
import { Project } from '../src/types.ts';

let cachedProjects: Project[] = [...DEFAULT_PROJECTS];

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(cachedProjects);
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

  if (req.method === 'POST') {
    if (req.url?.includes('reset')) {
      cachedProjects = [...DEFAULT_PROJECTS];
      return res.status(200).json({ success: true, projects: cachedProjects });
    }

    const { title, category, description } = body;
    if (!title || !category || !description) {
      return res.status(400).json({ error: 'Title, Category, and Description are required' });
    }

    const newProject: Project = {
      ...body,
      id: body.id || 'proj-' + Date.now().toString(36),
      date: body.date || new Date().getFullYear().toString(),
      workCompleted: Array.isArray(body.workCompleted) ? body.workCompleted : [],
      toolsUsed: Array.isArray(body.toolsUsed) ? body.toolsUsed : [],
      featured: Boolean(body.featured),
    };

    cachedProjects.unshift(newProject);
    return res.status(201).json({ success: true, project: newProject, projects: cachedProjects });
  }

  if (req.method === 'PUT') {
    const id = body.id || req.query?.id;
    if (!id) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    const idx = cachedProjects.findIndex((p) => p.id === id);
    if (idx !== -1) {
      cachedProjects[idx] = { ...cachedProjects[idx], ...body };
    }
    return res.status(200).json({ success: true, projects: cachedProjects });
  }

  if (req.method === 'DELETE') {
    const id = req.query?.id || body.id;
    if (id) {
      cachedProjects = cachedProjects.filter((p) => p.id !== id);
    }
    return res.status(200).json({ success: true, projects: cachedProjects });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
