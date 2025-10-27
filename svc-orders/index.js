import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const uri = process.env.MONGODB_URI;
await mongoose.connect(uri);
const Order = mongoose.model('Order', new mongoose.Schema({
  customerId: String,
  total: Number,
  status: { type: String, default: 'NEW' }
},{ timestamps:true }));

app.get('/orders', async (req,res)=>{
  const data = await Order.find().lean();
  res.json(data);
});

app.post('/orders', async (req,res)=>{
  const o = await Order.create(req.body);
  res.status(201).json(o);
});

app.get('/health', (req,res)=>res.json({ok:true}));

const port = process.env.PORT || 3001;
app.listen(port, ()=>console.log(`svc-orders :${port}`));
