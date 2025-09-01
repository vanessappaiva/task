import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

// This is a simplified implementation for demo purposes
// In production, you'd use a persistent database
let tasks: any[] = [
  {
    id: "task-1",
    title: "Plentário",
    description: "2 horas processo realizado",
    osNumber: "1394",
    deadline: "2025-08-26T00:00:00.000Z",
    estimatedHours: "2",
    team: "Equipe Cris",
    status: "pendentes",
    createdAt: "2025-09-01T17:53:27.833Z",
    updatedAt: "2025-09-01T17:53:27.833Z",
  },
  // ... other tasks would be here in production from a database
];

const insertTaskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  osNumber: z.string().min(1, "Número OS é obrigatório"), 
  team: z.string().min(1, "Equipe é obrigatória"),
  status: z.string().default("pendentes"),
  description: z.string().optional(),
  estimatedHours: z.string().optional(),
  deadline: z.string().optional().transform((val) => {
    if (val && val.trim() !== '') {
      return new Date(val).toISOString();
    }
    return null;
  }),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      // Get single task
      const task = tasks.find(t => t.id === id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.status(200).json(task);
    }

    if (req.method === 'PATCH') {
      // Update task
      try {
        const updates = insertTaskSchema.partial().parse(req.body);
        const taskIndex = tasks.findIndex(t => t.id === id);
        
        if (taskIndex === -1) {
          return res.status(404).json({ error: 'Task not found' });
        }

        const updatedTask = {
          ...tasks[taskIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        tasks[taskIndex] = updatedTask;
        return res.status(200).json(updatedTask);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: "Invalid task data", details: error.errors });
        }
        throw error;
      }
    }

    if (req.method === 'DELETE') {
      // Delete task
      const taskIndex = tasks.findIndex(t => t.id === id);
      if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      tasks.splice(taskIndex, 1);
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}