import crypto from 'crypto'
import {prisma} from '~/lib/db.server'

export async function accountExists(email: string) {
  const account = await prisma.account.findUnique({
    where: {email: email},
    select: {id: true},
  })

  return Boolean(account)
}

export async function createAccount(email: string, password: string) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha256')
    .toString('hex')

  return prisma.account.create({
    data: {
      email: email,
      Password: {create: {hash, salt}},
    },
  })
}
