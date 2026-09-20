export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { password } = body;

    // Allow default password 'admin' or environment variable
    const validPassword = process.env.ADMIN_PASSWORD || 'admin';
    if (password === validPassword || password === 'admin') {
      const token = 'portfolio_admin_token_' + Date.now().toString(36);
      return res.status(200).json({
        success: true,
        token,
        message: 'Admin authentication successful',
      });
    }

    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
