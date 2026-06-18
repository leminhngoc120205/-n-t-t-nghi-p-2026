import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ICategory extends Document {
  name: string
  slug: string
  parentId: Types.ObjectId | null
  displayOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new Schema<ICategory>(
  {
    name:         { type: String, required: true, trim: true },
    slug:         { type: String, required: true, unique: true, lowercase: true, trim: true },
    parentId:     { type: Schema.Types.ObjectId, ref: 'IMSCategory', default: null },
    displayOrder: { type: Number, default: 0 },
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'ims_categories' },
)

categorySchema.index({ slug: 1 })
categorySchema.index({ parentId: 1 })

export const Category =
  (mongoose.models.IMSCategory as mongoose.Model<ICategory>) ||
  mongoose.model<ICategory>('IMSCategory', categorySchema)
