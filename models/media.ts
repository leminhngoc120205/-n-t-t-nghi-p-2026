import mongoose, { Schema, Document, Types } from 'mongoose'

export type MediaType = 'image' | 'video' | 'audio'

export interface IMedia extends Document {
  filename: string
  originalName: string
  mimeType: string
  size: number
  mediaType: MediaType
  url: string
  uploadedBy: Types.ObjectId | null
  createdAt: Date
  updatedAt: Date
}

const mediaSchema = new Schema<IMedia>(
  {
    filename:     { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType:     { type: String, required: true },
    size:         { type: Number, required: true },
    mediaType:    { type: String, enum: ['image', 'video', 'audio'], required: true },
    url:          { type: String, required: true },
    uploadedBy:   { type: Schema.Types.ObjectId, ref: 'IMSUser', default: null },
  },
  { timestamps: true, collection: 'ims_media' },
)

export const Media =
  (mongoose.models.IMSMedia as mongoose.Model<IMedia>) ||
  mongoose.model<IMedia>('IMSMedia', mediaSchema)
