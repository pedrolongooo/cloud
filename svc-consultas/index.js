const express = require("express");
const mongoose = require("mongoose");

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
app.listen(port, () => console.log(`svc-consultas :${port}`));
