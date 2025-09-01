import { Task } from "@shared/schema";
import TaskCard from "./task-card";
import { ClipboardCheck, PauseCircle } from "lucide-react";

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function KanbanColumn({ title, tasks, onTaskClick }: KanbanColumnProps) {
  const getEmptyStateIcon = () => {
    if (title.includes("ANÁLISE")) {
      return <ClipboardCheck className="text-muted-foreground text-2xl mb-2" size={32} />;
    }
    if (title.includes("PAUSADO")) {
      return <PauseCircle className="text-muted-foreground text-2xl mb-2" size={32} />;
    }
    return null;
  };

  const getEmptyStateMessage = () => {
    if (title.includes("ANÁLISE")) {
      return "Nenhuma tarefa em análise";
    }
    if (title.includes("PAUSADO")) {
      return "Nenhuma tarefa pausada";
    }
    return "Nenhuma tarefa";
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm" data-testid={`column-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground mb-1" data-testid={`text-column-title-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
          {title}
        </h2>
        <span className="text-xs text-muted-foreground" data-testid={`text-task-count-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
          {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
        </span>
      </div>
      <div className="p-4 column-scrollable space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8" data-testid={`empty-state-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
            {getEmptyStateIcon()}
            <p className="text-sm text-muted-foreground">{getEmptyStateMessage()}</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              data-testid={`card-task-${task.id}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
