import mongoose, { Schema, Document } from 'mongoose'

export interface ITopic extends Document {
  name: string
  slug: string
  description: string
  avatar: string
  showIcon: boolean
  displayOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const topicSchema = new Schema<ITopic>(
  {
    name:         { type: String, required: true, trim: true },
    slug:         { type: String, required: true, unique: true, lowercase: true, trim: true },
    description:  { type: String, default: '' },
    avatar:       { type: String, default: '' },
    showIcon:     { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'ims_topics' },
)

topicSchema.index({ slug: 1 })
topicSchema.index({ displayOrder: 1 })

export const Topic =
  (mongoose.models.IMSTopic as mongoose.Model<ITopic>) ||
  mongoose.model<ITopic>('IMSTopic', topicSchema)
