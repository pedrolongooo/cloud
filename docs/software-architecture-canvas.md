# Software Architecture Canvas – PJBL

**Nome do Sistema:** PJBL Cloud  
**Objetivo:** Portal com CRUD de Customers + Orders, agregação via BFF e processamento por eventos.

- **Stakeholders:** Estudantes, Professor, Time PJBL
- **Requisitos Funcionais:** CRUD Customers (Azure SQL); Orders (Mongo); Agregação no BFF; Evento → persistência
- **Requisitos Não Funcionais:** Disponibilidade, Observabilidade, Segurança básica
- **Padrões:** MFE, BFF, Microservices, EDA (Service Bus)
- **Tecnologias:** React/Vite, Node/Express, MongoDB Atlas, Azure SQL, Azure Functions, Service Bus
- **Deploy/Infra:** Docker para serviços; Static Web Apps para MFE; Azure Functions
- **Métricas:** Latência BFF < 300ms em dev; Erros < 1%
