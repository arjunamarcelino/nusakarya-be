import { FastifyRequest, FastifyReply } from 'fastify'
import privyClient from '#app/configs/privy_config'
import AppException from '#app/exceptions/app_exception'
import ErrorCodes from '#app/exceptions/error_codes'

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string
    privyId: string
    walletAddress?: string
    email?: string
  }
}

export async function verifyPrivyToken(
  request: AuthenticatedRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppException(401, ErrorCodes.UNAUTHORIZED, 'Missing or invalid authorization header')
    }

    const token = authHeader.substring(7)

    const claims = await privyClient.verifyAuthToken(token)

    request.user = {
      id: claims.userId,
      privyId: claims.userId,
    }
  } catch (error) {
    if (error instanceof AppException) {
      throw error
    }
    throw new AppException(401, ErrorCodes.UNAUTHORIZED, 'Invalid or expired token')
  }
}

