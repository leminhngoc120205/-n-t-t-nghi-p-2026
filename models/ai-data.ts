import mongoose, { Schema, Document } from 'mongoose'

export type AIDataType = 'text' | 'image' | 'video'
export type AIDataStatus = 'pending' | 'indexed' | 'failed'

export interface IAIData extends Document {
  title: string
  dataType: AIDataType
  filePath: string
  fileSize: number
  mimeType: string
  status: AIDataStatus
  indexedAt: Date | null
  errorMessage: string
  createdAt: Date
  updatedAt: Date
}

const aiDataSchema = new Schema<IAIData>(
  {
    title:        { type: String, required: true, trim: true },
    dataType:     { type: String, enum: ['text','image','video'], required: true },
    filePath:     { type: String, required: true },
    fileSize:     { type: Number, default: 0 },
    mimeType:     { type: String, default: '' },
    status:       { type: String, enum: ['pending','indexed','failed'], default: 'pending', index: true },
    indexedAt:    { type: Date, default: null },
    errorMessage: { type: String, default: '' },
  },
  { timestamps: true, collection: 'ims_ai_data' },
)

aiDataSchema.index({ dataType: 1, status: 1 })

export const AIData =
  (mongoose.models.IMSAIData as mongoose.Model<IAIData>) ||
  mongoose.model<IAIData>('IMSAIData', aiDataSchema)
