import { FastifyReply } from 'fastify'
import privyClient from '#app/configs/privy_config'
import Prisma from '#prisma/prisma'
import { AuthenticatedRequest } from '#app/middlewares/auth_middleware'

export default class AuthController {
  /**
   * Verify Privy token and sync/create user in database
   * POST /v1/auth/verify
   */
  static async verify(request: AuthenticatedRequest, reply: FastifyReply) {
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.json(null, 401, 'UNAUTHORIZED', 'Missing or invalid authorization header')
    }

    const token = authHeader.substring(7)

    try {
      // Verify token with Privy
      const claims = await privyClient.verifyAuthToken(token)

      // Get user info from Privy
      const privyUser = await privyClient.getUser(claims.userId)

      // Find or create user in database
      const user = await Prisma.user.upsert({
        where: { privyId: claims.userId },
        update: {
          walletAddress: privyUser.wallet?.address || null,
          email: privyUser.email?.address || null,
          updatedAt: new Date(),
        },
        create: {
          privyId: claims.userId,
          walletAddress: privyUser.wallet?.address || null,
          email: privyUser.email?.address || null,
        },
      })

      return reply.json(
        {
          user: {
            id: user.id,
            privyId: user.privyId,
            walletAddress: user.walletAddress,
            email: user.email,
          },
        },
        200,
        null,
        'User verified and synced successfully'
      )
    } catch (error) {
      if (error instanceof Error) {
        return reply.json(null, 401, 'UNAUTHORIZED', error.message)
      }

      return reply.json(null, 500, 'SYSTEM_ERROR', 'Failed to verify token')
    }
  }

  /**
   * Get current authenticated user
   * GET /v1/auth/me
   */
  static async me(request: AuthenticatedRequest, reply: FastifyReply) {
    if (!request.user) {
      return reply.json(null, 401, 'UNAUTHORIZED', 'User not authenticated')
    }

    try {
      const user = await Prisma.user.findUnique({
        where: { privyId: request.user.privyId },
      })

      if (!user) {
        return reply.json(null, 404, 'USER_NOT_FOUND', 'User not found in database')
      }

      return reply.json(
        {
          user: {
            id: user.id,
            privyId: user.privyId,
            walletAddress: user.walletAddress,
            email: user.email,
          },
        },
        200
      )
    } catch (error) {
      return reply.json(null, 500, 'SYSTEM_ERROR', 'Failed to fetch user')
    }
  }
}

