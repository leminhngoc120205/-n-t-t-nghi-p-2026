import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IRSSFeed extends Document {
  name: string
  url: string
  categoryId: Types.ObjectId | null
  lastImported: Date | null
  importCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const rssFeedSchema = new Schema<IRSSFeed>(
  {
    name:         { type: String, required: true, trim: true },
    url:          { type: String, required: true, unique: true, trim: true },
    categoryId:   { type: Schema.Types.ObjectId, ref: 'IMSCategory', default: null },
    lastImported: { type: Date, default: null },
    importCount:  { type: Number, default: 0 },
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'ims_rss_feeds' }
)

export const RSSFeed =
  (mongoose.models.IMSRSSFeed as mongoose.Model<IRSSFeed>) ||
  mongoose.model<IRSSFeed>('IMSRSSFeed', rssFeedSchema)
