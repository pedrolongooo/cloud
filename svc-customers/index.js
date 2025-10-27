import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import sql from 'mssql';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const config = {
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DB,
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASS,
  options: { encrypt: true }
};
const pool = await sql.connect(config);

// init table if not exists
await pool.request().query(`
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Customers' and xtype='U')
CREATE TABLE Customers (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(200) NOT NULL,
  email NVARCHAR(200) NOT NULL UNIQUE
);
`);

app.get('/customers', async (req,res)=>{
  const r = await pool.request().query('SELECT id, name, email FROM Customers ORDER BY id DESC');
  res.json(r.recordset);
});

app.get('/customers/:id', async (req,res)=>{
  const r = await pool.request().input('id', sql.Int, req.params.id).query('SELECT id, name, email FROM Customers WHERE id=@id');
  if(!r.recordset.length) return res.sendStatus(404);
  res.json(r.recordset[0]);
});

app.post('/customers', async (req,res)=>{
  const {name, email} = req.body;
  const r = await pool.request()
    .input('name', sql.NVarChar, name)
    .input('email', sql.NVarChar, email)
    .query('INSERT INTO Customers(name,email) OUTPUT inserted.* VALUES(@name,@email)');
  res.status(201).json(r.recordset[0]);
});

app.put('/customers/:id', async (req,res)=>{
  const {name, email} = req.body;
  const r = await pool.request()
    .input('id', sql.Int, req.params.id)
    .input('name', sql.NVarChar, name)
    .input('email', sql.NVarChar, email)
    .query('UPDATE Customers SET name=@name, email=@email WHERE id=@id; SELECT id,name,email FROM Customers WHERE id=@id;');
  if(!r.recordset.length) return res.sendStatus(404);
  res.json(r.recordset[0]);
});

app.delete('/customers/:id', async (req,res)=>{
  await pool.request().input('id', sql.Int, req.params.id).query('DELETE FROM Customers WHERE id=@id');
  res.sendStatus(204);
});

const port = process.env.PORT || 3002;
app.listen(port, ()=>console.log(`svc-customers :${port}`));
