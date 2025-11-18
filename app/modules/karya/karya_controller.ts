import { FastifyReply, FastifyRequest } from 'fastify'
import Prisma from '#prisma/prisma'
import { AuthenticatedRequest } from '#app/middlewares/auth_middleware'
import KaryaService from '#app/modules/karya/karya_service'
import { CreateKaryaBody } from '#app/modules/karya/karya_schema'

export default class KaryaController {
  /**
   * Create a new karya
   * POST /v1/karya
   */
  static async create(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.json(null, 401, 'UNAUTHORIZED', 'User not authenticated')
      }

      const body = request.body as CreateKaryaBody
      const { title, description, type, category, tag, fileUrl, fileHash, nftId, txHash } = body

      // Get user from database using privyId
      const user = await Prisma.user.findUnique({
        where: { privyId: request.user.privyId },
      })

      if (!user) {
        return reply.json(null, 404, 'USER_NOT_FOUND', 'User not found in database')
      }

      // Check if fileHash already exists
      const existingKarya = await Prisma.karya.findFirst({
        where: { fileHash },
      })

      if (existingKarya) {
        return reply.json(null, 409, 'FILE_HASH_EXISTS', 'A karya with this file hash already exists')
      }

      // Create karya using service
      const karya = await KaryaService.create({
        userId: user.id,
        title,
        description,
        type,
        category,
        tag,
        fileUrl,
        fileHash,
        nftId,
        txHash,
      })

      return reply.json(
        {
          karya,
        },
        201,
        null,
        'Karya created successfully'
      )
    } catch (error) {
      if (error instanceof Error) {
        return reply.json(null, 500, 'SYSTEM_ERROR', error.message)
      }

      return reply.json(null, 500, 'SYSTEM_ERROR', 'Failed to create karya')
    }
  }

  /**
   * Get all karya for authenticated user
   * GET /v1/karya
   */
  static async getAll(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.json(null, 401, 'UNAUTHORIZED', 'User not authenticated')
      }

      // Get user from database using privyId
      const user = await Prisma.user.findUnique({
        where: { privyId: request.user.privyId },
      })

      if (!user) {
        return reply.json(null, 404, 'USER_NOT_FOUND', 'User not found in database')
      }

      // Get all karya for user
      const karya = await KaryaService.getAllByUserId(user.id)

      return reply.json(
        {
          karya,
        },
        200,
        null,
        'Karya retrieved successfully'
      )
    } catch (error) {
      if (error instanceof Error) {
        return reply.json(null, 500, 'SYSTEM_ERROR', error.message)
      }

      return reply.json(null, 500, 'SYSTEM_ERROR', 'Failed to retrieve karya')
    }
  }

  /**
   * Verify karya by fileHash
   * POST /v1/karya/verify
   */
  static async verify(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as { hash: string }
      const { hash } = body

      if (!hash) {
        return reply.json(null, 400, 'VALIDATION_ERROR', 'Hash is required')
      }

      // Find karya by fileHash with all related data
      const karya = await Prisma.karya.findFirst({
        where: { fileHash: hash },
        include: {
          user: {
            select: {
              id: true,
              privyId: true,
              walletAddress: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          licenses: true,
        },
      })

      if (!karya) {
        return reply.json(null, 404, 'KARYA_NOT_FOUND', 'Karya with this hash does not exist')
      }

      return reply.json(
        {
          karya: {
            id: karya.id,
            userId: karya.userId,
            title: karya.title,
            description: karya.description,
            type: karya.type,
            category: karya.category,
            tag: karya.tag,
            fileUrl: karya.fileUrl,
            fileHash: karya.fileHash,
            nftId: karya.nftId,
            txHash: karya.txHash,
            createdAt: karya.createdAt,
            updatedAt: karya.updatedAt,
            user: karya.user,
            licenses: karya.licenses,
          },
        },
        200,
        null,
        'Karya found successfully'
      )
    } catch (error) {
      if (error instanceof Error) {
        return reply.json(null, 500, 'SYSTEM_ERROR', error.message)
      }

      return reply.json(null, 500, 'SYSTEM_ERROR', 'Failed to verify karya')
    }
  }
}

