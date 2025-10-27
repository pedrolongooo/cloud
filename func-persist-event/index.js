const mongoose = require('mongoose');

let cachedConn = null;
const ConsultaSchema = new mongoose.Schema({
  tutorId: Number, petId: Number, dataHora: Date, tipo: String,
  status: { type: String, default: 'ABERTA' }
}, { timestamps: true });

function getConsultaModel() {
  return mongoose.models.Consulta || mongoose.model('Consulta', ConsultaSchema);
}

module.exports = async function (context, message) {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!cachedConn) cachedConn = await mongoose.connect(mongoUri);
    const Consulta = getConsultaModel();
    const payload = typeof message === 'string' ? JSON.parse(message) : message;
    await Consulta.create(payload);
    context.log('Consulta persistida do evento');
  } catch (e) {
    context.log.error('Persist error:', e && e.stack ? e.stack : e);
    throw e;
  }
};