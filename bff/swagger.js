// bff/swagger.js
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BFF API – PJBL",
      version: "1.0.0",
      description:
        "Swagger do BFF (API Gateway) – agrega tutores, pets e consultas.",
    },
  },
  apis: ["./index.js"], // lê os comentários do index.js
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
