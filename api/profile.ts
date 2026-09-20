import { DEFAULT_PROFILE } from '../src/data/defaultData.ts';

// In-memory cache for serverless instance
let cachedProfile = { ...DEFAULT_PROFILE };

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(cachedProfile);
  }

  if (req.method === 'PUT') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    if (!body || !body.name) {
      return res.status(400).json({ error: 'Invalid profile data' });
    }
    cachedProfile = { ...cachedProfile, ...body };
    return res.status(200).json({ success: true, profile: cachedProfile });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
