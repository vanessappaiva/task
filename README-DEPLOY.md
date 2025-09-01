# Deploy para Vercel

Este projeto está configurado para deploy automático na Vercel com funções serverless.

## Como fazer o deploy:

1. **Conecte seu repositório na Vercel:**
   - Vá para [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Conecte seu repositório GitHub/GitLab

2. **Configuração automática:**
   - A Vercel detectará automaticamente que é um projeto Vite
   - Usará as configurações do `vercel.json`
   - Build command: `vite build`
   - Output directory: `dist`

3. **APIs Serverless:**
   - As funções estão em `/api/`
   - `/api/tasks` - CRUD de tarefas
   - `/api/tasks/[id]` - Operações em tarefa específica  
   - `/api/teams` - Lista das equipes

## Estrutura das APIs:

### GET /api/tasks
Retorna todas as tarefas

### POST /api/tasks
Cria nova tarefa
```json
{
  "title": "Título da tarefa",
  "osNumber": "1234",
  "team": "Equipe Cris",
  "status": "pendentes",
  "description": "Descrição opcional",
  "estimatedHours": "8",
  "deadline": "2025-12-31"
}
```

### PATCH /api/tasks/[id]
Atualiza tarefa existente

### DELETE /api/tasks/[id]
Remove tarefa

### GET /api/teams
Retorna lista das equipes

## Nota importante:
As funções serverless usam storage em memória para demonstração. Para produção, recomenda-se integrar com um banco de dados como:
- Vercel KV
- PlanetScale
- Supabase
- Firebase