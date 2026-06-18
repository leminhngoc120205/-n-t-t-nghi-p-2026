import mongoose, { Schema, Document } from 'mongoose'

export interface ITag extends Document {
  name: string
  slug: string
  articleCount: number
  createdAt: Date
  updatedAt: Date
}

const tagSchema = new Schema<ITag>(
  {
    name:         { type: String, required: true, unique: true, trim: true },
    slug:         { type: String, required: true, unique: true, lowercase: true, trim: true },
    articleCount: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'ims_tags' },
)

tagSchema.index({ slug: 1 })

export const Tag =
  (mongoose.models.IMSTag as mongoose.Model<ITag>) ||
  mongoose.model<ITag>('IMSTag', tagSchema)
