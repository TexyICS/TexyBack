const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TexyBack API Documentation',
    version: '1.0.0',
    description: 'Documentation de l’API TexyBack',
  },
  servers: [
    {
      url: 'http://localhost:5000', // Mets le bon port ici
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // Chemin vers tes fichiers contenant les routes avec des commentaires JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
