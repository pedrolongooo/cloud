const express = require("express");
const sql = require("mssql");

const app = express();
app.use(express.json());

const cfg = {
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DB,
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASS,
  options: { encrypt: true },
};

let pool;
async function getPool() {
  if (!pool) pool = await sql.connect(cfg);
  return pool;
}

// DDL (cria se não existir)
async function ensureSchema() {
  const p = await getPool();
  await p.request().batch(`
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tutors' AND xtype='U')
CREATE TABLE Tutors (
  id INT IDENTITY(1,1) PRIMARY KEY,
  nome NVARCHAR(120) NOT NULL,
  email NVARCHAR(160) NOT NULL UNIQUE,
  telefone NVARCHAR(40) NULL,
  senha NVARCHAR(200) NOT NULL
);
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Pets' AND xtype='U')
CREATE TABLE Pets (
  id INT IDENTITY(1,1) PRIMARY KEY,
  tutorId INT NOT NULL,
  nome NVARCHAR(120) NOT NULL,
  especie NVARCHAR(60) NOT NULL,
  raca NVARCHAR(120) NULL,
  idade INT NULL,
  CONSTRAINT FK_Pets_Tutors FOREIGN KEY (tutorId) REFERENCES Tutors(id)
);`);
}
ensureSchema().catch(console.error);

// ---------- Tutors ----------
app.get("/tutors", async (req, res) => {
  const r = await (await getPool()).request().query("SELECT * FROM Tutors");
  res.json(r.recordset);
});
app.get("/tutors/:id", async (req, res) => {
  const r = await (await getPool())
    .request()
    .input("id", sql.Int, req.params.id)
    .query("SELECT * FROM Tutors WHERE id=@id");
  r.recordset[0] ? res.json(r.recordset[0]) : res.sendStatus(404);
});
app.post("/tutors", async (req, res) => {
  const { nome, email, telefone, senha } = req.body;
  const r = await (
    await getPool()
  )
    .request()
    .input("nome", sql.NVarChar, nome)
    .input("email", sql.NVarChar, email)
    .input("telefone", sql.NVarChar, telefone || null)
    .input("senha", sql.NVarChar, senha)
    .query(
      "INSERT INTO Tutors (nome,email,telefone,senha) OUTPUT INSERTED.* VALUES (@nome,@email,@telefone,@senha)"
    );
  res.status(201).json(r.recordset[0]);
});
app.put("/tutors/:id", async (req, res) => {
  const { nome, email, telefone, senha } = req.body;
  const r = await (
    await getPool()
  )
    .request()
    .input("id", sql.Int, req.params.id)
    .input("nome", sql.NVarChar, nome)
    .input("email", sql.NVarChar, email)
    .input("telefone", sql.NVarChar, telefone || null)
    .input("senha", sql.NVarChar, senha)
    .query(
      "UPDATE Tutors SET nome=@nome,email=@email,telefone=@telefone,senha=@senha WHERE id=@id; SELECT * FROM Tutors WHERE id=@id;"
    );
  r.recordset[0] ? res.json(r.recordset[0]) : res.sendStatus(404);
});
app.delete("/tutors/:id", async (req, res) => {
  const r = await (await getPool())
    .request()
    .input("id", sql.Int, req.params.id)
    .query("DELETE FROM Tutors WHERE id=@id");
  res.sendStatus(r.rowsAffected[0] ? 204 : 404);
});

// ---------- Pets ----------
app.get("/pets", async (req, res) => {
  const { tutorId } = req.query;
  const p = await getPool();
  const q = tutorId
    ? "SELECT * FROM Pets WHERE tutorId=@tutorId"
    : "SELECT * FROM Pets";
  const r = tutorId
    ? await p.request().input("tutorId", sql.Int, tutorId).query(q)
    : await p.request().query(q);
  res.json(r.recordset);
});
app.get("/pets/:id", async (req, res) => {
  const r = await (await getPool())
    .request()
    .input("id", sql.Int, req.params.id)
    .query("SELECT * FROM Pets WHERE id=@id");
  r.recordset[0] ? res.json(r.recordset[0]) : res.sendStatus(404);
});
app.post("/pets", async (req, res) => {
  const { tutorId, nome, especie, raca, idade } = req.body;
  const r = await (
    await getPool()
  )
    .request()
    .input("tutorId", sql.Int, tutorId)
    .input("nome", sql.NVarChar, nome)
    .input("especie", sql.NVarChar, especie)
    .input("raca", sql.NVarChar, raca || null)
    .input("idade", sql.Int, idade || null)
    .query(
      "INSERT INTO Pets (tutorId,nome,especie,raca,idade) OUTPUT INSERTED.* VALUES (@tutorId,@nome,@especie,@raca,@idade)"
    );
  res.status(201).json(r.recordset[0]);
});
app.put("/pets/:id", async (req, res) => {
  const { tutorId, nome, especie, raca, idade } = req.body;
  const r = await (
    await getPool()
  )
    .request()
    .input("id", sql.Int, req.params.id)
    .input("tutorId", sql.Int, tutorId)
    .input("nome", sql.NVarChar, nome)
    .input("especie", sql.NVarChar, especie)
    .input("raca", sql.NVarChar, raca || null)
    .input("idade", sql.Int, idade || null)
    .query(
      "UPDATE Pets SET tutorId=@tutorId,nome=@nome,especie=@especie,raca=@raca,idade=@idade WHERE id=@id; SELECT * FROM Pets WHERE id=@id;"
    );
  r.recordset[0] ? res.json(r.recordset[0]) : res.sendStatus(404);
});
app.delete("/pets/:id", async (req, res) => {
  const r = await (await getPool())
    .request()
    .input("id", sql.Int, req.params.id)
    .query("DELETE FROM Pets WHERE id=@id");
  res.sendStatus(r.rowsAffected[0] ? 204 : 404);
});

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`svc-tutors :${port}`));
