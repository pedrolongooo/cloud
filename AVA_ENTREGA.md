# Entrega PJBL – Links e Equipe

**Projeto:** PJBL Cloud – MFE + BFF + 2 Microservices + 2 Functions

## Repositórios GitHub (públicos)
- MFE: https://github.com/<org>/<repo-mfe>
- BFF: https://github.com/<org>/<repo-bff>
- svc-orders (Mongo): https://github.com/<org>/<repo-svc-orders>
- svc-customers (Azure SQL): https://github.com/<org>/<repo-svc-customers>
- Functions: 
  - create-event: https://github.com/<org>/<repo-func-create-event>
  - persist-event: https://github.com/<org>/<repo-func-persist-event>

## Docker Hub
- bff: https://hub.docker.com/r/<user>/bff
- svc-orders: https://hub.docker.com/r/<user>/svc-orders
- svc-customers: https://hub.docker.com/r/<user>/svc-customers

## Nomes dos alunos
- Nome 1 — RA: ______
- Nome 2 — RA: ______
- Nome 3 — RA: ______
- Nome 4 — RA: ______

## Observações
- O BFF agrega dados de `svc-orders` e `svc-customers` e também faz proxy CRUD.
- O fluxo de evento é criado via `func-create-event` (HTTP) → Service Bus → `func-persist-event` (persistência Mongo).
