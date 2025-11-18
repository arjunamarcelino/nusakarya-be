import Prisma from '#prisma/prisma'

export interface CreateLicenseData {
  karyaId: string
  userId: string
  type: string
  price: number
  duration: number
  description: string
  tnc: string
  txHash?: string | null
}

export interface LicenseResponse {
  id: string
  karyaId: string
  userId: string
  type: string
  price: number
  duration: number
  description: string
  tnc: string
  txHash: string | null
  createdAt: Date
  updatedAt: Date
}

export default class LicenseService {
  /**
   * Create a new license
   */
  static async create(data: CreateLicenseData): Promise<LicenseResponse> {
    // Create license
    const license = await Prisma.license.create({
      data: {
        karyaId: data.karyaId,
        userId: data.userId,
        type: data.type,
        price: data.price,
        duration: data.duration,
        description: data.description,
        tnc: data.tnc,
        txHash: data.txHash || null,
      },
    })

    return {
      id: license.id,
      karyaId: license.karyaId,
      userId: license.userId,
      type: license.type,
      price: license.price,
      duration: license.duration,
      description: license.description,
      tnc: license.tnc,
      txHash: license.txHash,
      createdAt: license.createdAt,
      updatedAt: license.updatedAt,
    }
  }

  /**
   * Get all licenses for a user
   */
  static async getAllByUserId(userId: string): Promise<LicenseResponse[]> {
    const licenses = await Prisma.license.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return licenses.map((license) => ({
      id: license.id,
      karyaId: license.karyaId,
      userId: license.userId,
      type: license.type,
      price: license.price,
      duration: license.duration,
      description: license.description,
      tnc: license.tnc,
      txHash: license.txHash,
      createdAt: license.createdAt,
      updatedAt: license.updatedAt,
    }))
  }
}

