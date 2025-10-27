const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerId: String,
  total: Number,
  status: { type: String, default: 'NEW' }
},{ timestamps:true });

module.exports = async function (context, message) {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    context.log.error('MONGODB_URI missing');
    return;
  }
  await mongoose.connect(mongoUri);
  const Order = mongoose.model('Order', OrderSchema);
  try {
    const payload = typeof message === 'string' ? JSON.parse(message) : message;
    await Order.create(payload);
    context.log('Order persisted from event');
  } catch (e) {
    context.log.error(e);
  } finally {
    await mongoose.disconnect();
  }
};
