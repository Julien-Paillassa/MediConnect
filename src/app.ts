import cookieParser from 'cookie-parser'
import express, { type Express } from 'express'
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
import userSubscriptionRouter from './routes/user-subscription.route'
import userRouter from './routes/user.route'
const app: Express = express()
app.use(express.json())

app.use(express.json())
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))
app.use('/auth', authRouter)

// protected path
app.use('/api-keys', AuthMiddleware.authenticate, apiKeysRouter)
app.use('/user-subscription', AuthMiddleware.authenticate, userSubscriptionRouter)

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default app
