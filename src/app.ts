import express, { type Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import apiKeysRouter from './routes/api-key.route'
import 'reflect-metadata'
import userRouter from './routes/user.route'
// import authRouter from './routes/auth.route'
import * as ResponseMiddleware from './middlewares/response.middleware'
// import * as ApiKeyMiddleware from './middlewares/api-key.middleware'

const app: Express = express()
app.use(express.json())

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    openapi: '3.0.0',
    info: { title: 'Mediconnect API', version: '1.0.0' }
  },
  apis: ['src/routes/*.route.ts']
})
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

// app.use('/auth', authRouter)
app.use('/user', userRouter)

app.use('/api-keys', apiKeysRouter)
// app.use('/drugs', ApiKeyMiddleware.onlyValidApiKey, drugsRouter)
app.use(ResponseMiddleware.handleErrorResponse)

app.all('*', ResponseMiddleware.invalidRouteResponse)

export default app
