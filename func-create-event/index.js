const { ServiceBusClient } = require('@azure/service-bus');

module.exports = async function (context, req) {
  const connectionString = process.env.SB_CONNECTION_STRING;
  const queueName = process.env.SB_QUEUE || 'orders-created';
  const sbClient = new ServiceBusClient(connectionString);
  const sender = sbClient.createSender(queueName);

  try {
    const body = req.body || {};
    await sender.sendMessages({ body, contentType: 'application/json' });
    await sender.close();
    await sbClient.close();
    context.res = { status: 202, body: { ok: true, enqueued: body } };
  } catch (e) {
    context.log.error(e);
    context.res = { status: 500, body: { error: e.message } };
  }
};
