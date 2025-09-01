import { type User, type InsertUser, type Task, type InsertTask, type Team, type InsertTeam } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Task methods
  getAllTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  // Team methods
  getAllTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tasks: Map<string, Task>;
  private teams: Map<string, Team>;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.teams = new Map();
    
    // Initialize with default teams
    this.initializeTeams();
    this.initializeSampleTasks();
  }

  private initializeTeams() {
    const defaultTeams: Team[] = [
      { id: "team-1", name: "Core View", colorClass: "team-blue" },
      { id: "team-2", name: "Fiscal View", colorClass: "team-orange" },
      { id: "team-3", name: "UX Design", colorClass: "team-teal" },
      { id: "team-4", name: "Desenvolvimento", colorClass: "team-purple" },
      { id: "team-5", name: "QA Testing", colorClass: "team-pink" },
    ];
    
    defaultTeams.forEach(team => {
      this.teams.set(team.id, team);
    });
  }

  private initializeSampleTasks() {
    const sampleTasks: Task[] = [
      {
        id: "task-1",
        title: "Plentário",
        description: "2 horas processo realizado",
        osNumber: "OS - 1394",
        deadline: new Date("2025-08-26"),
        estimatedHours: "2",
        team: "Core View",
        status: "pendentes",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "task-2",
        title: "Incluir documento",
        description: "Incluir DOC e disretinha quando não veio no arquivo",
        osNumber: "OS - 1393",
        deadline: new Date("2024-09-08"),
        estimatedHours: "4",
        team: "Fiscal View",
        status: "pendentes",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "task-3",
        title: "Estoque - Pós reunião",
        description: "Adicionar filtros das reuniões do problema",
        osNumber: "OS - 1395",
        deadline: new Date("2025-09-15"),
        estimatedHours: "6",
        team: "UX Design",
        status: "pendentes",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "task-4",
        title: "E-sfinge v1",
        description: "Aceder ao problema no sistema com feedback dos utilizadores",
        osNumber: "OS - 0003",
        deadline: new Date("2024-09-02"),
        estimatedHours: "8",
        team: "Desenvolvimento",
        status: "pendentes",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "task-5",
        title: "Assinador do PWA",
        description: "Recuperar trabalhar a fase da atividade desenvolvida",
        osNumber: "OS - 1338",
        deadline: new Date("2025-09-30"),
        estimatedHours: "18",
        team: "Desenvolvimento",
        status: "em-andamento",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "task-6",
        title: "Menu TCE VIRTUAL",
        description: "Criado de via paralelo que deixa disparar o que",
        osNumber: "OS - 0002",
        deadline: new Date("2025-08-26"),
        estimatedHours: "12",
        team: "Core View",
        status: "concluidas",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "task-7",
        title: "Estoque",
        description: "Criar exemplo com planos off-SCJ",
        osNumber: "OS - 1250",
        deadline: new Date("2025-09-23"),
        estimatedHours: "10",
        team: "Fiscal View",
        status: "concluidas",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "task-8",
        title: "Comunicação",
        description: "Descrição incompleta",
        osNumber: "OS - 1365",
        deadline: null,
        estimatedHours: "5",
        team: "UX Design",
        status: "concluidas",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleTasks.forEach(task => {
      this.tasks.set(task.id, task);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Task methods
  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const now = new Date();
    const task: Task = { 
      ...insertTask,
      id, 
      description: insertTask.description || null,
      estimatedHours: insertTask.estimatedHours || null,
      deadline: insertTask.deadline || null,
      status: insertTask.status || "pendentes",
      createdAt: now, 
      updatedAt: now 
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;
    
    const updatedTask: Task = {
      ...existingTask,
      ...updates,
      description: updates.description !== undefined ? updates.description : existingTask.description,
      estimatedHours: updates.estimatedHours !== undefined ? updates.estimatedHours : existingTask.estimatedHours,
      deadline: updates.deadline !== undefined ? updates.deadline : existingTask.deadline,
      updatedAt: new Date(),
    };
    
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Team methods
  async getAllTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }

  async getTeam(id: string): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const id = randomUUID();
    const team: Team = { ...insertTeam, id };
    this.teams.set(id, team);
    return team;
  }
}

export const storage = new MemStorage();
