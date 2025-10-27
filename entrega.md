# 🧩 Projeto PJBL – Cloud Architecture

## 👥 Integrantes do Grupo
- **Ryan Kloss**  
- **Iago José de Souza**  
- **Mateus Tozin**  
- **Gabriel Carvalho**  
- **Pedro Henrique Longo**

---

## 📦 Repositório no GitHub
📁 [https://github.com/pedrolongooo/cloud](https://github.com/pedrolongooo/cloud)

O repositório contém:
- MicroFrontEnd (Vite + React)
- Microservices:
  - `svc-orders` → MongoDB Atlas
  - `svc-customers` → Azure SQL Database (1 DTU)
- BFF (Backend-for-Frontend)
- Azure Functions:
  - `func-create-event` (HTTP Trigger → Service Bus)
  - `func-persist-event` (Service Bus Trigger → MongoDB)
- Diagramas atualizados: C4 Model, Arc42 e Software Architecture Canvas.

---

## 🐳 Imagens Publicadas no Docker Hub
| Serviço | Repositório | Descrição |
|----------|--------------|------------|
| **BFF** | [pedrolongoo/bff](https://hub.docker.com/r/pedrolongoo/bff) | Agregação e proxy CRUD (integra microserviços e functions) |
| **svc-customers** | [pedrolongoo/svc-customers](https://hub.docker.com/r/pedrolongoo/svc-customers) | Microserviço de clientes (Azure SQL Server) |
| **svc-orders** | *(publicação automática via workflow)* | Microserviço de pedidos (MongoDB Atlas) |
| **Namespace Docker Hub** | [https://hub.docker.com/u/pedrolongoo](https://hub.docker.com/u/pedrolongoo) | Todos os repositórios públicos do projeto |

---

## ☁️ Resumo Técnico
- **Arquitetura:** Microfrontends + Microservices + Functions + BFF  
- **Banco de Dados:**  
  - MongoDB Atlas (Free Cluster)  
  - Azure SQL Database (1 DTU)  
- **Integração:** Azure Service Bus (fila `orders-created`)  
- **Funções Serverless:**  
  - `func-create-event` → Recebe POST do BFF e envia evento  
  - `func-persist-event` → Consome evento e grava no MongoDB  
- **BFF:** agrega dados de `orders` e `customers` e expõe `GET /aggregate`  
- **Frontend (MFE):** consome API do BFF via `VITE_BFF_BASE_URL`  

---

## 🔗 Publicação e Automatização
- **CI/CD:** GitHub Actions (`.github/workflows/docker-publish.yml`)  
  - Build e Push automáticos de `bff`, `svc-orders`, `svc-customers`  
  - Publicação em Docker Hub com tags `latest` e commit SHA  
