import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

// Simplified in-memory storage for serverless functions
// Note: In production, you'd want to use a database like Vercel's KV or external DB
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
  {
    id: "task-2",
    title: "Incluir documento",
    description: "Incluir DOC e disretinha quando não veio no arquivo",
    osNumber: "1393",
    deadline: "2024-09-08T00:00:00.000Z",
    estimatedHours: "4",
    team: "Equipe Michel",
    status: "pendentes",
    createdAt: "2025-09-01T17:53:27.833Z",
    updatedAt: "2025-09-01T17:53:27.833Z",
  },
  {
    id: "task-3",
    title: "Estoque - Pós reunião",
    description: "Adicionar filtros das reuniões do problema",
    osNumber: "1395",
    deadline: "2025-09-15T00:00:00.000Z",
    estimatedHours: "6",
    team: "Equipe Verner",
    status: "pendentes",
    createdAt: "2025-09-01T17:53:27.833Z",
    updatedAt: "2025-09-01T17:53:27.833Z",
  },
  {
    id: "task-4",
    title: "E-sfinge v1",
    description: "Aceder ao problema no sistema com feedback dos utilizadores",
    osNumber: "0003",
    deadline: "2024-09-02T00:00:00.000Z",
    estimatedHours: "8",
    team: "Equipe Fenili",
    status: "pendentes",
    createdAt: "2025-09-01T17:53:27.833Z",
    updatedAt: "2025-09-01T17:53:27.833Z",
  },
  {
    id: "task-5",
    title: "Assinador do PWA",
    description: "Recuperar trabalhar a fase da atividade desenvolvida",
    osNumber: "1338",
    deadline: "2025-09-30T00:00:00.000Z",
    estimatedHours: "18",
    team: "Equipe Fenili",
    status: "em-andamento",
    createdAt: "2025-09-01T17:53:27.833Z",
    updatedAt: "2025-09-01T17:53:27.833Z",
  },
  {
    id: "task-6",
    title: "Menu TCE VIRTUAL",
    description: "Criado de via paralelo que deixa disparar o que",
    osNumber: "0002",
    deadline: "2025-08-26T00:00:00.000Z",
    estimatedHours: "12",
    team: "Equipe Cris",
    status: "concluidas",
    createdAt: "2025-09-01T17:53:27.833Z",
    updatedAt: "2025-09-01T17:53:27.833Z",
  },
  {
    id: "task-7",
    title: "Estoque",
    description: "Criar exemplo com planos off-SCJ",
    osNumber: "1250",
    deadline: "2025-09-23T00:00:00.000Z",
    estimatedHours: "10",
    team: "Equipe Michel",
    status: "concluidas",
    createdAt: "2025-09-01T17:53:27.833Z",
    updatedAt: "2025-09-01T17:53:27.833Z",
  },
  {
    id: "task-8",
    title: "Comunicação",
    description: "Descrição incompleta",
    osNumber: "1365",
    deadline: null,
    estimatedHours: "5",
    team: "Equipe Verner",
    status: "concluidas",
    createdAt: "2025-09-01T17:53:27.833Z",
    updatedAt: "2025-09-01T17:53:27.833Z",
  },
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

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get all tasks
      return res.status(200).json(tasks);
    }

    if (req.method === 'POST') {
      // Create new task
      try {
        const validatedData = insertTaskSchema.parse(req.body);
        const newTask = {
          ...validatedData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        tasks.push(newTask);
        return res.status(201).json(newTask);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: "Invalid task data", details: error.errors });
        }
        throw error;
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}