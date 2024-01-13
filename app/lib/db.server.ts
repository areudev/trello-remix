import {PrismaClient} from '@prisma/client'
import {singleton} from './singleton.server'

export const prisma = singleton('prisma', () => {
  const client = new PrismaClient()
  client.$connect()
  return client
})
