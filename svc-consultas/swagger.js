// svc-consultas/swagger.js
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "svc-consultas API – PJBL",
      version: "1.0.0",
      description: "Microserviço responsável pelas Consultas (MongoDB Atlas).",
    },
  },
  apis: ["./index.js"],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
