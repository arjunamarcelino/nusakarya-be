import { FastifyReply } from 'fastify'
import Prisma from '#prisma/prisma'
import { AuthenticatedRequest } from '#app/middlewares/auth_middleware'
import LicenseService from '#app/modules/license/license_service'
import { CreateLicenseBody } from '#app/modules/license/license_schema'

export default class LicenseController {
  /**
   * Create a new license
   * POST /v1/license
   */
  static async create(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.json(null, 401, 'UNAUTHORIZED', 'User not authenticated')
      }

      const body = request.body as CreateLicenseBody
      const { karyaId, type, price, duration, description, tnc, txHash } = body

      // Get user from database using privyId
      const user = await Prisma.user.findUnique({
        where: { privyId: request.user.privyId },
      })

      if (!user) {
        return reply.json(null, 404, 'USER_NOT_FOUND', 'User not found in database')
      }

      // Verify that the karya exists
      const karya = await Prisma.karya.findUnique({
        where: { id: karyaId },
      })

      if (!karya) {
        return reply.json(null, 404, 'KARYA_NOT_FOUND', 'Karya not found')
      }

      // Create license using service
      const license = await LicenseService.create({
        karyaId,
        userId: user.id,
        type,
        price,
        duration,
        description,
        tnc,
        txHash,
      })

      return reply.json(
        {
          license,
        },
        201,
        null,
        'License created successfully'
      )
    } catch (error) {
      if (error instanceof Error) {
        return reply.json(null, 500, 'SYSTEM_ERROR', error.message)
      }

      return reply.json(null, 500, 'SYSTEM_ERROR', 'Failed to create license')
    }
  }

  /**
   * Get all licenses for authenticated user
   * GET /v1/license
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

      // Get all licenses for user
      const licenses = await LicenseService.getAllByUserId(user.id)

      return reply.json(
        {
          licenses,
        },
        200,
        null,
        'Licenses retrieved successfully'
      )
    } catch (error) {
      if (error instanceof Error) {
        return reply.json(null, 500, 'SYSTEM_ERROR', error.message)
      }

      return reply.json(null, 500, 'SYSTEM_ERROR', 'Failed to retrieve licenses')
    }
  }
}

