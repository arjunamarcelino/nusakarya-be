import Prisma from '#prisma/prisma'
import { uuidv7 } from 'uuidv7'

export interface CreateKaryaData {
  userId: string
  title: string
  description: string
  type: string
  category?: string | null
  tag?: string[]
  fileUrl: string
  fileHash: string
  nftId?: string | null
  txHash?: string | null
}

export interface KaryaResponse {
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
  createdAt: Date
  updatedAt: Date
}

export default class KaryaService {
  /**
   * Create a new karya
   */
  static async create(data: CreateKaryaData): Promise<KaryaResponse> {
    // Generate UUID v7
    const id = uuidv7()

    // Create karya
    const karya = await Prisma.karya.create({
      data: {
        id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        type: data.type,
        category: data.category || null,
        tag: data.tag || [],
        fileUrl: data.fileUrl,
        fileHash: data.fileHash,
        nftId: data.nftId || null,
        txHash: data.txHash || null,
      },
    })

    return {
      id: karya.id,
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
    }
  }

  /**
   * Get all karya for a user
   */
  static async getAllByUserId(userId: string): Promise<KaryaResponse[]> {
    const karya = await Prisma.karya.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return karya.map((karya) => ({
      id: karya.id,
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
    }))
  }
}

