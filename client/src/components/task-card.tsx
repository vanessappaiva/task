import { Task } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { getDeadlineStatus, formatDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const deadlineStatus = getDeadlineStatus(task.deadline);
  
  const getTeamColorClass = (team: string) => {
    const teamColorMap: Record<string, string> = {
      "Equipe Cris": "team-cris",
      "Equipe Michel": "team-michel", 
      "Equipe Verner": "team-verner",
      "Equipe Fenili": "team-fenili",
    };
    return teamColorMap[team] || "team-cris";
  };

  const getDeadlineClasses = () => {
    if (deadlineStatus === "critical") {
      return "deadline-critical";
    }
    if (deadlineStatus === "warning") {
      return "deadline-warning";
    }
    return "";
  };

  const getBadgeVariant = () => {
    if (task.status === "concluidas") {
      return "secondary";
    }
    if (deadlineStatus === "critical") {
      return "destructive";
    }
    return "secondary";
  };

  const getBadgeText = () => {
    if (task.status === "concluidas") {
      return "Concluído";
    }
    if (deadlineStatus === "critical") {
      return "Crítico";
    }
    return task.team;
  };

  return (
    <div 
      className={cn(
        "task-card bg-card border border-border rounded-lg p-4 cursor-pointer border-b-4 transition-all hover:shadow-md hover:-translate-y-1",
        getTeamColorClass(task.team),
        getDeadlineClasses(),
        task.status === "concluidas" && "opacity-75"
      )}
      onClick={onClick}
      data-testid={`card-task-${task.id}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-foreground text-sm" data-testid={`text-task-title-${task.id}`}>
          {task.title}
        </h3>
        <span className="text-xs text-muted-foreground" data-testid={`text-task-os-${task.id}`}>
          OS - {task.osNumber}
        </span>
      </div>
      
      {task.description && (
        <p className="text-xs text-muted-foreground mb-3" data-testid={`text-task-description-${task.id}`}>
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Badge 
          variant="outline" 
          className="text-xs border-current"
          data-testid={`badge-task-team-${task.id}`}
        >
          {task.team}
        </Badge>
        
        {task.deadline && (
          <Badge 
            variant="secondary"
            className={cn(
              "text-xs",
              deadlineStatus === "critical" && "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
              deadlineStatus === "warning" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
              deadlineStatus === "normal" && "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
            )}
            data-testid={`badge-task-deadline-${task.id}`}
          >
            {formatDate(task.deadline)}
          </Badge>
        )}
      </div>
      
      {task.estimatedHours && (
        <div className="mt-2 text-xs text-muted-foreground" data-testid={`text-task-hours-${task.id}`}>
          {task.estimatedHours} horas
        </div>
      )}
    </div>
  );
}
