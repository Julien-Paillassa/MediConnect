import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc, { Options } from 'swagger-jsdoc';

const app = express();
const port = process.env.PORT || 3000;

// Configuration Swagger JSDoc
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Votre API',
    version: '1.0.0',
    description: 'Documentation de votre API',
  },
};

const options: Options = {
  swaggerDefinition,
  apis: ['./routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Endpoint racine
 *     description: Renvoie un message de bienvenue
 *     responses:
 *       200:
 *         description: Réponse réussie
 */
app.get('/', (req, res) => {
  res.send('Hello, Express with TypeScript!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});