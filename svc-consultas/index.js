const express = require("express");
const mongoose = require("mongoose");
const setupSwagger = require("./swagger");

const app = express();
app.use(express.json());

const ConsultaSchema = new mongoose.Schema(
  {
    tutorId: Number,
    petId: Number,
    dataHora: Date,
    tipo: String,
    status: { type: String, default: "ABERTA" },
  },
  { timestamps: true }
);

const Consulta =
  mongoose.models.Consulta || mongoose.model("Consulta", ConsultaSchema);

let connected = false;
async function connect() {
  if (!connected) {
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
  }
}

// rotas
/**
 * @swagger
 * /consultas:
 *   get:
 *     summary: Lista todas as consultas
 *     tags: [Consultas]
 *     responses:
 *       200:
 *         description: Lista de consultas retornada com sucesso
 */

app.get("/consultas", async (req, res) => {
  await connect();
  const list = await Consulta.find().sort({ createdAt: -1 }).lean();
  res.json(list);
});
app.get("/consultas/:id", async (req, res) => {
  await connect();
  const it = await Consulta.findById(req.params.id).lean();
  it ? res.json(it) : res.sendStatus(404);
});
/**
 * @swagger
 * /consultas:
 *   post:
 *     summary: Cria uma nova consulta diretamente no microserviço
 *     tags: [Consultas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tutorId: { type: integer }
 *               petId: { type: integer }
 *               dataHora: { type: string, format: date-time }
 *               tipo: { type: string }
 *               status: { type: string }
 *     responses:
 *       201:
 *         description: Consulta criada com sucesso
 */

app.post("/consultas", async (req, res) => {
  // habilite se quiser criar direto também
  await connect();
  const created = await Consulta.create(req.body);
  res.status(201).json(created);
});
app.put("/consultas/:id", async (req, res) => {
  await connect();
  const up = await Consulta.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).lean();
  up ? res.json(up) : res.sendStatus(404);
});
app.delete("/consultas/:id", async (req, res) => {
  await connect();
  const del = await Consulta.findByIdAndDelete(req.params.id).lean();
  del ? res.sendStatus(204) : res.sendStatus(404);
});

const port = process.env.PORT || 3001;
setupSwagger(app);
app.listen(port, () => console.log(`svc-consultas :${port}`));
