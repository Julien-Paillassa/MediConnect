import cookieParser from 'cookie-parser'
import express, { type Express } from 'express'
import Prometheus from 'prom-client'
import 'reflect-metadata'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import * as ApiKeyMiddleware from './middlewares/api-key.middleware'
import * as AuthMiddleware from './middlewares/authenticate.middleware'
import * as ResponseMiddleware from './middlewares/response.middleware'
import apiKeysRouter from './routes/api-key.route'
import authRouter from './routes/auth.route'
import drugCompositionsRouter from './routes/drug-composition.route'
import drugGenericsRouter from './routes/drug-generic.route'
import drugPackagesRouter from './routes/drug-package.route'
import drugSpecificationsRouter from './routes/drug-specification.route'
import genericsRouter from './routes/generic.route'
import SubscriptionRouter from './routes/subscription.route'
import userRouter from './routes/user.route'
import WebhookRouter from './routes/webhook.route'

const register = new Prometheus.Registry()
register.setDefaultLabels({ app: 'Mediconnect API' })
Prometheus.collectDefaultMetrics({ register })

const app: Express = express()

app.use(ResponseMiddleware.bodyParse)
app.use(cookieParser())

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Mediconnect API', version: '1.0.0' },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
        /**
         * Unable to use cookie auth with swagger-ui-express,
         * see https://github.com/scottie1984/swagger-ui-express/issues/299
         * Adding instructions to set the cookie manually in the description of tags that require an API key
         */
        // ApiKeyAuth: {
        //   type: 'apiKey',
        //   name: 'X-API-KEY',
        //   in: 'cookie'
        // }
      },
      responses: {
        MissingOrInvalidApiKeyError: {
          description: 'API key is missing or invalid',
          headers: {
            'WWW-Authenticate': {
              schema: {
                type: 'string'
              },
              description: 'Cookie realm="X-API-KEY"'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'cus_P15hb9Ce949BCT' },
            name: { type: 'string', example: 'Toto' },
            email: { type: 'string', example: 'toto@gmail.com' }
          }
        }
      }
    }
  },
  apis: ['src/routes/*.route.ts']
})

const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: { withCredentials: true }
}

// public paths
app.use('/auth', authRouter)
app.use('/webhooks', WebhookRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))
app.get('/metrics', (req, res, next) => {
  res.setHeader('Content-Type', register.contentType)
  register.metrics().then(data => res.status(200).send(data)).catch(next)
})

// protected path
app.use('/api-keys', AuthMiddleware.authenticate, apiKeysRouter)
app.use('/subscription', AuthMiddleware.authenticate, SubscriptionRouter)

// paths protected by API key
app.use('/drug-compositions', ApiKeyMiddleware.onlyValidApiKey, drugCompositionsRouter)
app.use('/drug-generics', ApiKeyMiddleware.onlyValidApiKey, drugGenericsRouter)
app.use('/drug-specifications', ApiKeyMiddleware.onlyValidApiKey, drugSpecificationsRouter)
app.use('/drug-packages', ApiKeyMiddleware.onlyValidApiKey, drugPackagesRouter)
app.use('/generics', ApiKeyMiddleware.onlyValidApiKey, genericsRouter)
app.use('/user', ApiKeyMiddleware.onlyValidApiKey, userRouter)

// error handling
app.use(ResponseMiddleware.handleErrorResponse)
app.all('*', ResponseMiddleware.invalidRouteResponse)

export default app
