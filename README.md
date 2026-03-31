# Onda Finance 🌊

Aplicação bancária simulada construída com React + TypeScript, seguindo arquitetura baseada em features.

## Como rodar o projeto

```bash
ponpm install
pnpm run dev
pnpm test
pnpm run build
```

## Decisões Técnicas

### Zustand vs React Query

- **Zustand** → **client state** (sessão, saldo). Leve, sem boilerplate, persistência via localStorage.
- **React Query** → **server state** (transações). Cache, refetch, loading states, invalidação automática.

### Organização por Features

Cada feature (`auth`, `dashboard`, `transfer`) encapsula seus componentes. Escala melhor que organização por tipo.

### Validação: Zod + React Hook Form

Schemas declarativos e type-safe. Mínimos re-renders.

### Axios

Camada de API centralizada em `src/services/api/`.

## Segurança (Considerações Teóricas)

🔒 Engenharia Reversa
O código frontend é minimizado e ofuscado no build (pnpm build), dificultando leitura direta.
Informações sensíveis não são armazenadas no frontend.
Toda lógica crítica (como regras financeiras e validações) deve estar no backend.
Uso de variáveis de ambiente para evitar exposição de endpoints sensíveis.

🔐 Vazamento de Dados
HTTPS obrigatório para criptografia de dados em trânsito.
Uso de cookies httpOnly para armazenamento de tokens (evita acesso via JavaScript).
Implementação de proteção contra:
XSS (Cross-Site Scripting) → sanitização de inputs
CSRF (Cross-Site Request Forgery) → uso de tokens CSRF
Dados sensíveis nunca são armazenados em localStorage ou sessionStorage.
Controle de acesso baseado em autenticação e autorização no backend.

## Melhorias Futuras

- 🔐 Autenticação JWT real
- 📄 Paginação de transações
- 📊 Gráficos de gastos
