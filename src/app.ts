import express, { type Express, type NextFunction, type Request, type Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc, { type Options } from 'swagger-jsdoc'
import 'reflect-metadata'

const app: Express = express()

// Configuration Swagger JSDoc
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Votre API',
    version: '1.0.0',
    description: 'Documentation de votre API'
  }
}

const options: Options = {
  swaggerDefinition,
  apis: ['./routes/*.ts']
}

const swaggerSpec = swaggerJSDoc(options)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

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
app.get('/', (_: Request, res: Response) => {
  res.send('Hello, Express with TypeScript!')
})

// Return 404 on unknown route
app.all('*', (_: Request, res: Response) => {
  return res.status(404).send({
    success: false,
    message: 'Invalid route'
  })
})

// Define a middleware function to handle errors
app.use((err: any, _: Request, res: Response, _: NextFunction) => {
  console.log(err)
  return res.status(500).send({
    success: false,
    message: 'Internal server error'
  })
})

export default app
