import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const ORDERS_URL = process.env.ORDERS_URL || 'http://localhost:3001';
const CUSTOMERS_URL = process.env.CUSTOMERS_URL || 'http://localhost:3002';
const CREATE_EVENT_URL = process.env.CREATE_EVENT_URL || 'http://localhost:7071/api/create-event';

// Aggregation
app.get('/aggregate', async (req, res) => {
  try {
    const [customers, orders] = await Promise.all([
      axios.get(`${CUSTOMERS_URL}/customers`).then(r=>r.data),
      axios.get(`${ORDERS_URL}/orders`).then(r=>r.data),
    ]);
    res.json({ customers, orders, ts: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Proxy CRUD - customers
app.get('/customers', async (req,res)=>{
  const r = await axios.get(`${CUSTOMERS_URL}/customers`);
  res.status(r.status).json(r.data);
});
app.get('/customers/:id', async (req,res)=>{
  try{
    const r = await axios.get(`${CUSTOMERS_URL}/customers/${req.params.id}`);
    res.status(r.status).json(r.data);
  }catch(e){ res.status(e.response?.status||500).json(e.response?.data||{error:e.message});}
});
app.post('/customers', async (req,res)=>{
  const r = await axios.post(`${CUSTOMERS_URL}/customers`, req.body);
  res.status(r.status).json(r.data);
});
app.put('/customers/:id', async (req,res)=>{
  const r = await axios.put(`${CUSTOMERS_URL}/customers/${req.params.id}`, req.body);
  res.status(r.status).json(r.data);
});
app.delete('/customers/:id', async (req,res)=>{
  const r = await axios.delete(`${CUSTOMERS_URL}/customers/${req.params.id}`);
  res.sendStatus(r.status);
});

// Proxy Orders list
app.get('/orders', async (req,res)=>{
  const r = await axios.get(`${ORDERS_URL}/orders`);
  res.status(r.status).json(r.data);
});

// Create Order via event (HTTP trigger)
app.post('/orders', async (req, res) => {
  try{
    const r = await axios.post(CREATE_EVENT_URL, req.body);
    res.status(r.status || 202).json({ status: 'enqueued' });
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`BFF running on :${port}`));
