import 'dotenv/config'
import Fastify, { FastifyError, FastifyRegisterOptions, FastifyReply, FastifyRequest } from 'fastify'
import AppException from '#app/exceptions/app_exception'
import { ContentTypeParserDoneFunction } from 'fastify/types/content-type-parser'
import ErrorCodes from '#app/exceptions/error_codes'
import cors from '@fastify/cors'
import routes from '#app/routes/index'
import fastifySwagger, { SwaggerOptions } from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import swaggerConfigSetup from '#app/configs/swagger_config'

const fastify = Fastify({
  logger: process.env.LOGGER === 'true' ? {
    transport: process.env.NODE_ENV !== 'production' ? {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
        colorize: true,
        singleLine: false,
      },
    } : undefined,
    level: process.env.LOG_LEVEL || 'info',
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        headers: {
          authorization: req.headers.authorization ? 'Bearer ***' : undefined,
          'content-type': req.headers['content-type'],
        },
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },
  } : false,
})

// REGISTER CORS
fastify.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://site-nusakarya.jsuysj.easypanel.host',
      'https://nusakarya.vercel.app',
    ]

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return cb(null, true)
    }

    // Normalize origin by removing trailing slash
    const normalizedOrigin = origin.replace(/\/$/, '')

    // Find matching allowed origin
    const matchedOrigin = allowedOrigins.find(allowed => {
      const normalizedAllowed = allowed.replace(/\/$/, '')

      return normalizedOrigin === normalizedAllowed || origin === allowed
    })

    if (matchedOrigin) {
      // Return the matched origin (or the original if exact match)
      return cb(null, origin === matchedOrigin ? origin : matchedOrigin)
    }

    return cb(new Error('Not allowed by CORS'), false)
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
})

// REGISTER JSON RESPONSE HELPER
fastify.decorateReply('json', function (this: FastifyReply, data: object | string | number | boolean | null = null, status = 200, code: string | null = null, message: string | null = null) {
  this.status(status).send({
    status,
    code,
    message,
    data,
  })
})

// SET CUSTOM ERROR HANDLER
fastify.setErrorHandler(function (error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof AppException) {
    fastify.log.warn({
      err: error,
      method: request.method,
      url: request.url,
      statusCode: error.status,
      code: error.code,
    }, `[${error.code}] ${error.message}`)

    reply.status(error.status).send({
      status: error.status,
      code: error.code,
      message: error.message,
      data: null,
    })
  } else if (error instanceof Error) {
    fastify.log.error({
      err: error,
      method: request.method,
      url: request.url,
      stack: error.stack,
    }, `[SYSTEM_ERROR] ${error.message}`)

    reply.status(500).send({
      status: 500,
      code: error.code ?? 'SYSTEM_ERROR',
      message: error.message ?? 'An error occured on the system',
      data: null,
    })
  } else {
    fastify.log.error({
      method: request.method,
      url: request.url,
    }, '[SYSTEM_ERROR] An unknown error occurred')

    reply.status(500).send({
      status: 500,
      code: 'SYSTEM_ERROR',
      message: 'An error occured on the system',
      data: null,
    })
  }
})

// REGISTER JSON PARSER
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (request: FastifyRequest, body: string | Buffer<ArrayBufferLike>, done: ContentTypeParserDoneFunction) {
  try {
    // Handle empty body
    if (!body || (typeof body === 'string' && body.trim() === '')) {
      done(null, {})

      return
    }

    const json = JSON.parse(body as string)
    done(null, json)
  } catch (error) {
    const err = new AppException(400, ErrorCodes.PARSING_ERROR, `Error while parsing JSON request body: ${error instanceof Error ? error.message : 'Invalid JSON format'}`)
    done(err, null)
  }
})

// REGISTER SWAGGER
const APP_HOST = process.env.HOST ?? 'localhost:3000'
const swaggerConfig = swaggerConfigSetup(APP_HOST)

if (process.env.NODE_ENV !== 'production') {
  await fastify.register(fastifySwagger, swaggerConfig as FastifyRegisterOptions<SwaggerOptions>)
  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: { deepLinking: false },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  })
}


// ADD REQUEST LOGGING HOOKS
fastify.addHook('onRequest', (request, reply, done) => {
  request.log.info({
    method: request.method,
    url: request.url,
    ip: request.ip,
  }, `→ ${request.method} ${request.url}`)

  done()
})

fastify.addHook('onResponse', (request, reply, done) => {
  const responseTime = reply.elapsedTime
  const logLevel = reply.statusCode >= 500 ? 'error' : reply.statusCode >= 400 ? 'warn' : 'info'

  request.log[logLevel]({
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    responseTime: `${responseTime.toFixed(2)}ms`,
  }, `← ${request.method} ${request.url} ${reply.statusCode} (${responseTime.toFixed(2)}ms)`)

  done()
})

// REGISTER ROUTES
fastify.register(routes)

const start = async () => {
  try {
    const port: number = Number.parseInt(process.env.APP_PORT ?? '3000')
    await fastify.listen({
      port: port,
      host: '0.0.0.0',
    })

    fastify.log.info({
      port,
      host: '0.0.0.0',
      timestamp: new Date().toISOString(),
    }, `🚀 Server started successfully on http://localhost:${port}`)
  } catch (error) {
    fastify.log.fatal({
      err: error,
    }, '❌ Failed to start server')

    process.exit(1)
  }
}

start()
