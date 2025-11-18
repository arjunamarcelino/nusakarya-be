import { FastifySchema } from 'fastify'

export interface CreateLicenseBody {
  karyaId: string
  type: string
  price: number
  duration: number
  description: string
  tnc: string
  txHash?: string
}

export interface LicenseResponse {
  license: {
    id: string
    karyaId: string
    userId: string
    type: string
    price: number
    duration: number
    description: string
    tnc: string
    txHash: string | null
    createdAt: string
    updatedAt: string
  }
}

const LicenseSchema = {
  create: {
    body: {
      type: 'object',
      required: ['karyaId', 'type', 'price', 'duration', 'description', 'tnc'],
      properties: {
        karyaId: {
          type: 'string',
          minLength: 1,
          description: 'ID of the karya',
        },
        type: {
          type: 'string',
          minLength: 1,
          description: 'Type of the license',
        },
        price: {
          type: 'number',
          minimum: 0,
          description: 'Price of the license',
        },
        duration: {
          type: 'integer',
          minimum: 1,
          description: 'Duration of the license in days',
        },
        description: {
          type: 'string',
          minLength: 1,
          description: 'Description of the license',
        },
        tnc: {
          type: 'string',
          minLength: 1,
          description: 'Terms and conditions of the license',
        },
        txHash: {
          type: 'string',
          description: 'Transaction hash (optional)',
        },
      },
    },
    response: {
      201: {
        type: 'object',
        properties: {
          status: { type: 'number' },
          code: { type: 'string', nullable: true },
          message: { type: 'string', nullable: true },
          data: {
            type: 'object',
            properties: {
              license: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  karyaId: { type: 'string' },
                  userId: { type: 'string' },
                  type: { type: 'string' },
                  price: { type: 'number' },
                  duration: { type: 'integer' },
                  description: { type: 'string' },
                  tnc: { type: 'string' },
                  txHash: { type: 'string', nullable: true },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
      },
      400: {
        type: 'object',
        properties: {
          status: { type: 'number' },
          code: { type: 'string' },
          message: { type: 'string' },
          data: { type: 'null' },
        },
      },
      401: {
        type: 'object',
        properties: {
          status: { type: 'number' },
          code: { type: 'string' },
          message: { type: 'string' },
          data: { type: 'null' },
        },
      },
      404: {
        type: 'object',
        properties: {
          status: { type: 'number' },
          code: { type: 'string' },
          message: { type: 'string' },
          data: { type: 'null' },
        },
      },
      500: {
        type: 'object',
        properties: {
          status: { type: 'number' },
          code: { type: 'string' },
          message: { type: 'string' },
          data: { type: 'null' },
        },
      },
    },
  } as FastifySchema,
  getAll: {
    response: {
      200: {
        type: 'object',
        properties: {
          status: { type: 'number' },
          code: { type: 'string', nullable: true },
          message: { type: 'string', nullable: true },
          data: {
            type: 'object',
            properties: {
              licenses: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    karyaId: { type: 'string' },
                    userId: { type: 'string' },
                    type: { type: 'string' },
                    price: { type: 'number' },
                    duration: { type: 'integer' },
                    description: { type: 'string' },
                    tnc: { type: 'string' },
                    txHash: { type: 'string', nullable: true },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
      401: {
        type: 'object',
        properties: {
          status: { type: 'number' },
          code: { type: 'string' },
          message: { type: 'string' },
          data: { type: 'null' },
        },
      },
      404: {
        type: 'object',
        properties: {
          status: { type: 'number' },
          code: { type: 'string' },
          message: { type: 'string' },
          data: { type: 'null' },
        },
      },
      500: {
        type: 'object',
        properties: {
          status: { type: 'number' },
          code: { type: 'string' },
          message: { type: 'string' },
          data: { type: 'null' },
        },
      },
    },
  } as FastifySchema,
}

export default LicenseSchema

