import { FastifySchema } from 'fastify'

export interface CreateKaryaBody {
  title: string
  description: string
  type: string
  category?: string
  tag?: string[]
  fileUrl: string
  fileHash: string
  nftId?: string
  txHash?: string
}

export interface KaryaResponse {
  karya: {
    id: string
    title: string
    description: string
    type: string
    category: string | null
    tag: string[]
    fileUrl: string
    fileHash: string
    nftId: string | null
    txHash: string | null
    createdAt: string
    updatedAt: string
  }
}

const KaryaSchema = {
  create: {
    body: {
      type: 'object',
      required: ['title', 'description', 'type', 'fileUrl', 'fileHash'],
      properties: {
        title: {
          type: 'string',
          minLength: 1,
          description: 'Title of the karya',
        },
        description: {
          type: 'string',
          minLength: 1,
          description: 'Description of the karya',
        },
        type: {
          type: 'string',
          minLength: 1,
          description: 'Type of the karya',
        },
        category: {
          type: 'string',
          description: 'Category of the karya (optional)',
        },
        tag: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Tags for the karya (optional)',
        },
        fileUrl: {
          type: 'string',
          format: 'uri',
          description: 'URL of the file',
        },
        fileHash: {
          type: 'string',
          minLength: 1,
          description: 'Hash of the file',
        },
        nftId: {
          type: 'string',
          description: 'NFT ID (optional)',
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
              karya: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  type: { type: 'string' },
                  category: { type: 'string', nullable: true },
                  tag: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  fileUrl: { type: 'string' },
                  fileHash: { type: 'string' },
                  nftId: { type: 'string', nullable: true },
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
              karya: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    type: { type: 'string' },
                    category: { type: 'string', nullable: true },
                    tag: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    fileUrl: { type: 'string' },
                    fileHash: { type: 'string' },
                    nftId: { type: 'string', nullable: true },
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
  verify: {
    body: {
      type: 'object',
      required: ['hash'],
      properties: {
        hash: {
          type: 'string',
          minLength: 1,
          description: 'File hash to verify',
        },
      },
    },
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
              karya: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  type: { type: 'string' },
                  category: { type: 'string', nullable: true },
                  tag: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  fileUrl: { type: 'string' },
                  fileHash: { type: 'string' },
                  nftId: { type: 'string', nullable: true },
                  txHash: { type: 'string', nullable: true },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      privyId: { type: 'string' },
                      walletAddress: { type: 'string', nullable: true },
                      email: { type: 'string', nullable: true },
                      createdAt: { type: 'string', format: 'date-time' },
                      updatedAt: { type: 'string', format: 'date-time' },
                    },
                  },
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
                        duration: { type: 'number' },
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

export default KaryaSchema

