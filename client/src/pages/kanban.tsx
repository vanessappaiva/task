import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Task, Team } from "@shared/schema";
import KanbanColumn from "@/components/kanban-column";
import TaskModal from "@/components/task-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getCurrentDate } from "@/lib/date-utils";

const COLUMN_CONFIG = [
  { id: "pendentes", title: "PENDENTES", status: "pendentes" },
  { id: "em-andamento", title: "EM ANDAMENTO", status: "em-andamento" },
  { id: "em-analise", title: "EM ANÁLISE/APROVAÇÃO", status: "em-analise" },
  { id: "pausado", title: "PAUSADO/COM IMPEDIMENTO", status: "pausado" },
  { id: "concluidas", title: "CONCLUÍDAS", status: "concluidas" },
];

export default function KanbanBoard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleNewTaskClick = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Carregando tarefas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 shadow-sm" data-testid="header-main">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground" data-testid="text-page-title">
              TAREFAS EM ANDAMENTO
            </h1>
            <p className="text-sm text-muted-foreground">UX/UI Design</p>
          </div>
          <Button 
            onClick={handleNewTaskClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-new-task"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova tarefa
          </Button>
        </div>
        <div className="mt-2">
          <div className="text-xs text-muted-foreground/70" data-testid="text-current-date">
            {getCurrentDate()}
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
          {COLUMN_CONFIG.map((column) => (
            <KanbanColumn
              key={column.id}
              title={column.title}
              tasks={getTasksByStatus(column.status)}
              onTaskClick={handleTaskClick}
              data-testid={`column-${column.id}`}
            />
          ))}
        </div>
      </main>

      {/* Task Modal */}
      {isModalOpen && (
        <TaskModal
          task={selectedTask}
          teams={teams}
          onClose={handleCloseModal}
          data-testid="modal-task"
        />
      )}
    </div>
  );
}
