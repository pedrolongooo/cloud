// svc-tutors/swagger.js
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "svc-tutors API – PJBL",
      version: "1.0.0",
      description: "Microserviço responsável por Tutores e Pets (Azure SQL).",
    },
  },
  apis: ["./index.js"],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
