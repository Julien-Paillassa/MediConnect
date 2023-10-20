import express, { type NextFunction, type Express, type Request, type Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc, { type Options } from 'swagger-jsdoc'
import apiKeysRouter from './routes/api-key.route'
import 'reflect-metadata'

const app: Express = express()
app.use(express.json())

app.use(apiKeysRouter)

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
  apis: ['src/routes/*.route.ts']
}

const swaggerSpec = swaggerJSDoc(options)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Return 404 on unknown route
app.all('*', (_req: Request, res: Response) => {
  return res.status(404).send({
    success: false,
    message: 'Invalid route'
  })
})

// Define a middleware function to handle errors
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.log(err)
  return res.status(500).send({
    success: false,
    message: 'Internal server error'
  })
})

export default app
