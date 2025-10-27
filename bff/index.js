const express = require("express");
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
app.use(["/tutors", "/tutors/:id", "/pets", "/pets/:id"], proxy(TUTORS_URL));
app.use(["/consultas", "/consultas/:id"], proxy(CONSULTAS_URL));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`bff :${port}`));
