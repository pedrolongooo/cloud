const express = require("express");
const setupSwagger = require("./swagger");
const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));

const app = express();
app.use(express.json());

const TUTORS_URL = process.env.TUTORS_URL;
const CONSULTAS_URL = process.env.CONSULTAS_URL;
const CREATE_EVENT_URL = process.env.CREATE_EVENT_URL;

function proxy(base) {
  return async (req, res) => {
    const url = base + req.originalUrl;
    const r = await fetch(url, {
      method: req.method,
      headers: { "content-type": "application/json" },
      body: ["POST", "PUT", "PATCH"].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined,
    });
    const txt = await r.text();
    res
      .status(r.status)
      .type(r.headers.get("content-type") || "application/json")
      .send(txt);
  };
}

// Agregação
/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Retorna dados agregados (tutores, pets e consultas)
 *     tags: [BFF]
 *     responses:
 *       200:
 *         description: Dados agregados retornados com sucesso
 */

app.get("/dashboard", async (req, res) => {
  const [tutorsR, petsR, consultasR] = await Promise.all([
    fetch(`${TUTORS_URL}/tutors`),
    fetch(`${TUTORS_URL}/pets`),
    fetch(`${CONSULTAS_URL}/consultas`),
  ]);
  const [tutors, pets, consultas] = await Promise.all([
    tutorsR.json(),
    petsR.json(),
    consultasR.json(),
  ]);
  res.json({ tutors, pets, consultas, ts: new Date().toISOString() });
});

// Consultas - cria via evento (Function HTTP)
/**
 * @swagger
 * /consultas:
 *   post:
 *     summary: Cria uma nova consulta via evento (Function + Service Bus)
 *     tags: [Consultas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tutorId:
 *                 type: integer
 *               petId:
 *                 type: integer
 *               dataHora:
 *                 type: string
 *                 format: date-time
 *               tipo:
 *                 type: string
 *     responses:
 *       202:
 *         description: Consulta enviada para processamento
 */

app.post("/consultas", async (req, res) => {
  const r = await fetch(CREATE_EVENT_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(req.body),
  });
  const data = await r.json().catch(() => ({}));
  res.status(r.ok ? 202 : r.status).json({ ok: r.ok, enqueued: data });
});

// Proxy CRUD
/**
 * @swagger
 * /tutors:
 *   get:
 *     summary: Lista todos os tutores (proxy para svc-tutors)
 *     tags: [Tutores]
 *     responses:
 *       200:
 *         description: Lista de tutores
 */

app.use(["/tutors", "/tutors/:id", "/pets", "/pets/:id"], proxy(TUTORS_URL));
app.use(["/consultas", "/consultas/:id"], proxy(CONSULTAS_URL));

const port = process.env.PORT || 8080;
setupSwagger(app);
app.listen(port, () => console.log(`bff :${port}`));
