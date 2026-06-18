import { connectDB } from './mongodb'
import { User, IUser } from '@/models/user'
import { hashPassword } from './auth'
import { Types } from 'mongoose'

export type { IUser }

export interface PublicUser {
  id: string
  username: string
  fullName: string
  email: string
  phone: string
  address: string
  telegramId: string
  role: 'admin' | 'editor' | 'reporter'
  departmentId: string | null
  createdAt: string
}

export function toPublic(user: IUser): PublicUser {
  return {
    id:           (user._id as Types.ObjectId).toString(),
    username:     user.username,
    fullName:     user.fullName,
    email:        user.email ?? '',
    phone:        user.phone ?? '',
    address:      user.address ?? '',
    telegramId:   user.telegramId ?? '',
    role:         user.role,
    departmentId: user.departmentId ? user.departmentId.toString() : null,
    createdAt:    user.createdAt.toISOString(),
  }
}

export async function findByUsername(username: string): Promise<IUser | null> {
  await connectDB()
  return User.findOne({ username: username.toLowerCase().trim() })
}

export async function findById(id: string): Promise<IUser | null> {
  await connectDB()
  if (!Types.ObjectId.isValid(id)) return null
  return User.findById(id)
}

export async function updateUser(
  id: string,
  data: Partial<Pick<IUser, 'fullName' | 'email' | 'phone' | 'address' | 'telegramId'>>,
): Promise<boolean> {
  await connectDB()
  if (!Types.ObjectId.isValid(id)) return false
  const result = await User.findByIdAndUpdate(id, { $set: data })
  return result !== null
}

export async function updatePassword(id: string, newPasswordHash: string): Promise<boolean> {
  await connectDB()
  if (!Types.ObjectId.isValid(id)) return false
  const result = await User.findByIdAndUpdate(id, { $set: { passwordHash: newPasswordHash } })
  return result !== null
}

export async function getAllPublic(): Promise<PublicUser[]> {
  await connectDB()
  const users = await User.find({}).lean()
  return users.map(u => toPublic(u as unknown as IUser))
}

const SEED_USERS = [
  { username: 'ngoclm_vcc', plainPassword: 'Admin@123', fullName: 'Lê Minh Ngọc VCCorp',    email: 'ngoclm_vcc@gmail.com', phone: '0925158286', role: 'admin'    as const },
  { username: 'admin',      plainPassword: 'Admin@123', fullName: 'Quản trị viên hệ thống', email: 'admin@cnnd.vn',        phone: '',           role: 'admin'    as const },
  { username: 'editor_vcc', plainPassword: 'Admin@123', fullName: 'Biên tập viên VCC',      email: 'editor@cnnd.vn',       phone: '',           role: 'editor'   as const },
]

export async function seedUsersIfEmpty(): Promise<void> {
  await connectDB()
  const count = await User.countDocuments()
  if (count > 0) return
  for (const u of SEED_USERS) {
    const { plainPassword, ...rest } = u
    await User.create({ ...rest, passwordHash: hashPassword(plainPassword), address: '', telegramId: '', departmentId: null })
  }
  console.log('[IMS] Seeded', SEED_USERS.length, 'users into MongoDB')
}
