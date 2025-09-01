import { VercelRequest, VercelResponse } from '@vercel/node';

const teams = [
  { id: "team-1", name: "Equipe Cris", colorClass: "team-cris" },
  { id: "team-2", name: "Equipe Michel", colorClass: "team-michel" },
  { id: "team-3", name: "Equipe Verner", colorClass: "team-verner" },
  { id: "team-4", name: "Equipe Fenili", colorClass: "team-fenili" },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      return res.status(200).json(teams);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}