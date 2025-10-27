# PJBL Cloud Starter

Este repositório contém um **exemplo funcional** para cumprir os requisitos do PJBL:

- MicroFrontend (React + Vite) em `mfe/`
- BFF (Node + Express) em `bff/`
- Microserviço 1: `svc-orders/` (MongoDB Atlas)
- Microserviço 2: `svc-customers/` (Azure SQL)
- Functions (Azure Functions):
  - `func-create-event/` (HTTP trigger → envia evento para Service Bus)
  - `func-persist-event/` (Service Bus trigger → persiste no Mongo)
- Documentação:
  - `docs/openapi.yaml` (CRUD completo)
  - `docs/c4-model.md` (C1/C2/C3 em Mermaid)
  - `docs/arc42.md` (esqueleto Arc42 para preencher)
  - `docs/software-architecture-canvas.md`
  - `AVA_ENTREGA.md` (modelo do markdown para AVA)

## Rodando local
1) Crie os arquivos `.env` a partir de `.env.sample` em cada pasta.
2) Instale dependências:
   ```bash
   cd bff && npm i && cd ../svc-orders && npm i && cd ../svc-customers && npm i
   ```
3) Suba os serviços:
   ```bash
   node svc-orders/index.js
   node svc-customers/index.js
   node bff/index.js
   ```
4) Microfrontend:
   ```bash
   cd mfe && npm i && npm run dev
   ```

## Docker
Exemplo (ajuste `<registry>/<repo>`):
```bash
docker build -t <registry>/<repo>/bff:1.0 ./bff
docker build -t <registry>/<repo>/svc-orders:1.0 ./svc-orders
docker build -t <registry>/<repo>/svc-customers:1.0 ./svc-customers

docker login <registry>
docker push <registry>/<repo>/bff:1.0
docker push <registry>/<repo>/svc-orders:1.0
docker push <registry>/<repo>/svc-customers:1.0
```

## Azure Functions
- `func-create-event`: HTTP POST `/api/create-event` para publicar mensagem no Service Bus.
- `func-persist-event`: ServiceBusTrigger que consome a mensagem e persiste no MongoDB.

> Observação: este starter **não cria recursos cloud** automaticamente. Substitua as variáveis de ambiente e publique nos seus repositórios GitHub e Docker Hub.
