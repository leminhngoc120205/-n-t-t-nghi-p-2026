import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IComment extends Document {
  articleId: Types.ObjectId
  authorName: string
  authorEmail: string
  content: string
  status: 'pending' | 'approved' | 'hidden'
  createdAt: Date
  updatedAt: Date
}

const commentSchema = new Schema<IComment>(
  {
    articleId:   { type: Schema.Types.ObjectId, ref: 'IMSArticle', required: true, index: true },
    authorName:  { type: String, required: true, trim: true, maxlength: 100 },
    authorEmail: { type: String, default: '', lowercase: true, trim: true },
    content:     { type: String, required: true, maxlength: 2000 },
    status:      { type: String, enum: ['pending', 'approved', 'hidden'], default: 'pending', index: true },
  },
  { timestamps: true, collection: 'ims_comments' },
)

export const Comment =
  (mongoose.models.IMSComment as mongoose.Model<IComment>) ||
  mongoose.model<IComment>('IMSComment', commentSchema)
