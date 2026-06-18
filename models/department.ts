import mongoose, { Schema, Document } from 'mongoose'

export interface IDepartment extends Document {
  name: string
  slug: string
  location: string
  createdAt: Date
  updatedAt: Date
}

const departmentSchema = new Schema<IDepartment>(
  {
    name:     { type: String, required: true, unique: true, trim: true },
    slug:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    location: { type: String, default: '' },
  },
  { timestamps: true, collection: 'ims_departments' },
)

export const Department =
  (mongoose.models.IMSDepartment as mongoose.Model<IDepartment>) ||
  mongoose.model<IDepartment>('IMSDepartment', departmentSchema)
