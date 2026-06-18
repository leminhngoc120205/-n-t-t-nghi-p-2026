import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IUser extends Document {
  username: string
  passwordHash: string
  fullName: string
  email: string
  phone: string
  address: string
  telegramId: string
  role: 'admin' | 'editor' | 'reporter'
  departmentId: Types.ObjectId | null
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    username:     { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 50 },
    passwordHash: { type: String, required: true },
    fullName:     { type: String, required: true, trim: true, maxlength: 100 },
    email:        { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone:        { type: String, default: '', trim: true },
    address:      { type: String, default: '', trim: true },
    telegramId:   { type: String, default: '', trim: true },
    role:         { type: String, enum: ['admin','editor','reporter'], default: 'reporter' },
    departmentId: { type: Schema.Types.ObjectId, ref: 'IMSDepartment', default: null },
  },
  { timestamps: true, collection: 'ims_users' },
)

userSchema.index({ username: 1 })
userSchema.index({ email: 1 }, { sparse: true })

export const User =
  (mongoose.models.IMSUser as mongoose.Model<IUser>) ||
  mongoose.model<IUser>('IMSUser', userSchema)
