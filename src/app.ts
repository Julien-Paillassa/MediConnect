import express, { type Express } from 'express'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import apiKeysRouter from './routes/api-key.route'
import genericsRouter from './routes/generic.route'
import drugGenericsRouter from './routes/drug-generic.route'
import drugSpecificationsRouter from './routes/drug-specification.route'
import drugPackagesRouter from './routes/drug-package.route'
import 'reflect-metadata'
import * as ResponseMiddleware from './middlewares/response.middleware'
import * as ApiKeyMiddleware from './middlewares/api-key.middleware'

const app: Express = express()

app.use(express.json())
app.use(cookieParser())

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Mediconnect API', version: '1.0.0' },
    components: {
      securitySchemes: {
        BasicAuth: {
          type: 'http',
          scheme: 'basic'
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
app.use('/api-keys', apiKeysRouter)

// paths protected by API key
app.use('/generics', ApiKeyMiddleware.onlyValidApiKey, genericsRouter)
app.use('/drug-generics', ApiKeyMiddleware.onlyValidApiKey, drugGenericsRouter)
app.use('/drug-specifications', ApiKeyMiddleware.onlyValidApiKey, drugSpecificationsRouter)
app.use('/drug-packages', ApiKeyMiddleware.onlyValidApiKey, drugPackagesRouter)

// error handling
app.use(ResponseMiddleware.handleErrorResponse)
app.all('*', ResponseMiddleware.invalidRouteResponse)

export default app
