import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task, Team, insertTaskSchema } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";

interface TaskModalProps {
  task?: Task | null;
  teams: Team[];
  onClose: () => void;
}

const STATUS_OPTIONS = [
  { value: "pendentes", label: "Pendentes" },
  { value: "em-andamento", label: "Em Andamento" },
  { value: "em-analise", label: "Em Análise/Aprovação" },
  { value: "pausado", label: "Pausado/Com Impedimento" },
  { value: "concluidas", label: "Concluídas" },
];

const TEAM_OPTIONS = [
  { value: "Core View", label: "Core View" },
  { value: "Fiscal View", label: "Fiscal View" },
  { value: "UX Design", label: "UX Design" },
  { value: "Desenvolvimento", label: "Desenvolvimento" },
  { value: "QA Testing", label: "QA Testing" },
];

export default function TaskModal({ task, teams, onClose }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    osNumber: "",
    deadline: "",
    estimatedHours: "",
    team: "",
    status: "pendentes",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        osNumber: task.osNumber || "",
        deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : "",
        estimatedHours: task.estimatedHours || "",
        team: task.team || "",
        status: task.status || "pendentes",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        osNumber: "",
        deadline: "",
        estimatedHours: "",
        team: "",
        status: "pendentes",
      });
    }
  }, [task]);

  const createTaskMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertTaskSchema>) => {
      const response = await apiRequest("POST", "/api/tasks", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso!",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao criar tarefa. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (data: Partial<z.infer<typeof insertTaskSchema>>) => {
      const response = await apiRequest("PATCH", `/api/tasks/${task?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Sucesso",
        description: "Tarefa atualizada com sucesso!",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar tarefa. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const taskData = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined,
        description: formData.description || undefined,
        estimatedHours: formData.estimatedHours || undefined,
      };

      const validatedData = insertTaskSchema.parse(taskData);

      if (task) {
        updateTaskMutation.mutate(validatedData);
      } else {
        createTaskMutation.mutate(validatedData);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erro de validação",
          description: "Por favor, verifique os campos obrigatórios.",
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-task-edit">
        <DialogHeader>
          <DialogTitle data-testid="text-modal-title">
            {task ? "Editar Tarefa" : "Nova Tarefa"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="osNumber">Número OS</Label>
            <Input
              id="osNumber"
              type="text"
              placeholder="OS - 1234"
              value={formData.osNumber}
              onChange={(e) => handleInputChange("osNumber", e.target.value)}
              data-testid="input-os-number"
              required
            />
          </div>

          <div>
            <Label htmlFor="title">Título da Tarefa</Label>
            <Input
              id="title"
              type="text"
              placeholder="Digite o título da tarefa"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              data-testid="input-task-title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva os detalhes da tarefa"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              data-testid="textarea-task-description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deadline">Prazo</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
                data-testid="input-task-deadline"
              />
            </div>
            <div>
              <Label htmlFor="estimatedHours">Estimativa (horas)</Label>
              <Input
                id="estimatedHours"
                type="text"
                placeholder="8"
                value={formData.estimatedHours}
                onChange={(e) => handleInputChange("estimatedHours", e.target.value)}
                data-testid="input-task-hours"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="team">Equipe/Categoria</Label>
            <Select value={formData.team} onValueChange={(value) => handleInputChange("team", value)}>
              <SelectTrigger data-testid="select-task-team">
                <SelectValue placeholder="Selecione uma equipe" />
              </SelectTrigger>
              <SelectContent>
                {TEAM_OPTIONS.map((team) => (
                  <SelectItem key={team.value} value={team.value}>
                    {team.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger data-testid="select-task-status">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              data-testid="button-cancel-task"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createTaskMutation.isPending || updateTaskMutation.isPending}
              data-testid="button-save-task"
            >
              {createTaskMutation.isPending || updateTaskMutation.isPending 
                ? "Salvando..." 
                : "Salvar Tarefa"
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
