import mongoose, { Schema, Document } from 'mongoose'

export interface IAuthor extends Document {
  name: string
  slug: string
  avatar: string
  bio: string
  email: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const authorSchema = new Schema<IAuthor>(
  {
    name:     { type: String, required: true, trim: true },
    slug:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    avatar:   { type: String, default: '' },
    bio:      { type: String, default: '' },
    email:    { type: String, default: '', lowercase: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'ims_authors' },
)

authorSchema.index({ slug: 1 })

export const Author =
  (mongoose.models.IMSAuthor as mongoose.Model<IAuthor>) ||
  mongoose.model<IAuthor>('IMSAuthor', authorSchema)
