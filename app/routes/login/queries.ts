import crypto from 'crypto'
import {prisma} from '~/lib/db.server'

export async function login(email: string, password: string) {
  const user = await prisma.account.findUnique({
    where: {email: email},
    include: {Password: true},
  })

  if (!user || !user.Password) {
    return false
  }

  const hash = crypto
    .pbkdf2Sync(password, user.Password.salt, 1000, 64, 'sha256')
    .toString('hex')

  if (hash !== user.Password.hash) {
    return false
  }

  return user.id
}
