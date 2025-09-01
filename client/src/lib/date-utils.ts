export function getCurrentDate(): string {
  const now = new Date();
  return now.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
}

export function formatDate(date: Date | string | null): string {
  if (!date) return "Sem prazo";
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if it's tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (dateObj.toDateString() === tomorrow.toDateString()) {
    return "amanhã";
  }
  
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
}

export function getDeadlineStatus(deadline: Date | string | null): "normal" | "warning" | "critical" {
  if (!deadline) return "normal";
  
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 2) {
    return "critical";
  } else if (diffDays <= 7) {
    return "warning";
  }
  
  return "normal";
}

export function getDaysUntilDeadline(deadline: Date | string | null): number {
  if (!deadline) return Infinity;
  
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
