import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IEvent extends Document {
  name: string
  slug: string
  description: string
  categoryId: Types.ObjectId | null
  categoryName: string
  articleCount: number
  showOnHome: boolean
  isFeatured: boolean
  isActive: boolean
  displayOrder: number
  createdAt: Date
  updatedAt: Date
}

const eventSchema = new Schema<IEvent>(
  {
    name:         { type: String, required: true, trim: true },
    slug:         { type: String, required: true, unique: true, lowercase: true, trim: true },
    description:  { type: String, default: '' },
    categoryId:   { type: Schema.Types.ObjectId, ref: 'IMSCategory', default: null },
    categoryName: { type: String, default: '' },
    articleCount: { type: Number, default: 0 },
    showOnHome:   { type: Boolean, default: false },
    isFeatured:   { type: Boolean, default: false },
    isActive:     { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'ims_events' },
)

eventSchema.index({ slug: 1 })
eventSchema.index({ displayOrder: 1 })
eventSchema.index({ isActive: 1 })

export const Event =
  (mongoose.models.IMSEvent as mongoose.Model<IEvent>) ||
  mongoose.model<IEvent>('IMSEvent', eventSchema)
