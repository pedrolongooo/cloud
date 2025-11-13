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
- **MicroFrontEnd** (Vite + React)
- **Microservices:**
  - `svc-tutors` → Azure SQL Database (1 DTU) – CRUD de **Tutores** e **Pets**
  - `svc-consultas` → MongoDB Atlas (Free Cluster) – CRUD de **Consultas**
- **BFF (Backend-for-Frontend)** → agrega dados dos microserviços e aciona Functions
- **Azure Functions:**
  - `func-create-event` (HTTP Trigger → envia mensagens ao Service Bus)
  - `func-persist-event` (Service Bus Trigger → grava consultas no MongoDB)
- **Diagramas atualizados:** C4 Model, Arc42 e Software Architecture Canvas.

---

## 🐳 Imagens Publicadas no Docker Hub
| Serviço | Repositório | Descrição |
|----------|--------------|------------|
| **BFF** | [pedrolongoo/bff](https://hub.docker.com/r/pedrolongoo/bff) | Camada de agregação e proxy CRUD. Faz requests para microserviços e Functions. |
| **svc-tutors** | [pedrolongoo/svc-tutors](https://hub.docker.com/r/pedrolongoo/svc-tutors) | Microserviço de Tutores e Pets (Azure SQL Database). |
| **svc-consultas** | [pedrolongoo/svc-consultas](https://hub.docker.com/r/pedrolongoo/svc-consultas) | Microserviço de Consultas (MongoDB Atlas). |
| **Namespace Docker Hub** | [https://hub.docker.com/u/pedrolongoo](https://hub.docker.com/u/pedrolongoo) | Todos os repositórios públicos do projeto. |

---

## 🔗 Publicação e Automatização
- **CI/CD:** GitHub Actions (`.github/workflows/docker-publish.yml`)  
  - Build e Push automáticos de `bff`, `svc-tutors` e `svc-consultas`  
  - Publicação em Docker Hub com tags `latest` e commit SHA  
<<<<<<< HEAD
  - Login automatizado com `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN`  
=======
  - Login automatizado com `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN`  
>>>>>>> 0f906f04d7fc7aeb724041b98e82a333d4925f1a
