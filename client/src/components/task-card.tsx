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
      "Core View": "team-blue",
      "Fiscal View": "team-orange", 
      "UX Design": "team-teal",
      "Desenvolvimento": "team-purple",
      "QA Testing": "team-pink",
    };
    return teamColorMap[team] || "team-blue";
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
          {task.osNumber}
        </span>
      </div>
      
      {task.description && (
        <p className="text-xs text-muted-foreground mb-3" data-testid={`text-task-description-${task.id}`}>
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        <Badge 
          variant={getBadgeVariant()} 
          className="text-xs"
          data-testid={`badge-task-team-${task.id}`}
        >
          {getBadgeText()}
        </Badge>
        
        <div className="text-xs text-muted-foreground" data-testid={`text-task-deadline-${task.id}`}>
          {task.deadline ? (
            <span className={cn(
              deadlineStatus === "critical" && "text-destructive font-medium",
              deadlineStatus === "warning" && "text-yellow-600 font-medium"
            )}>
              Prazo: {formatDate(task.deadline)}
            </span>
          ) : (
            "Sem prazo"
          )}
        </div>
      </div>
      
      {task.estimatedHours && (
        <div className="mt-2 text-xs text-muted-foreground" data-testid={`text-task-hours-${task.id}`}>
          {task.estimatedHours} horas
        </div>
      )}
    </div>
  );
}
