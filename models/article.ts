import mongoose, { Schema, Document, Types } from 'mongoose'

export type ArticleStatus =
  | 'draft'           // lưu tạm
  | 'processing'      // nhận xử lý
  | 'waiting_edit'    // chờ biên tập
  | 'waiting_publish' // chờ xuất bản
  | 'approved'        // đã duyệt
  | 'published'       // đã xuất bản
  | 'cross_post'      // đăng chéo
  | 'returned'        // bị trả lại
  | 'in_progress'     // đang xử lý
  | 'removed'         // bị gỡ xuống
  | 'deleted'         // bị xóa
  | 'magazine'        // dạng tin đặc biệt

export type ArticleType =
  | 'size_s'
  | 'size_m'
  | 'size_l'
  | 'magazine'
  | 'big_story'
  | 'video_autoplay'
  | 'livestream'
  | 'wiki_how'
  | 'cooking'
  | 'qa'

export interface IStep {
  stepTitle: string
  stepContent: string
  stepImage: string
}

export interface IQaItem {
  question: string
  answer: string
}

export interface IArticle extends Document {
  title: string
  slug: string
  sapo: string
  content: string
  thumbnail: string
  articleType: ArticleType
  status: ArticleStatus
  categoryId: Types.ObjectId | null
  writerId: Types.ObjectId | null
  editorId: Types.ObjectId | null
  publisherId: Types.ObjectId | null
  authorId: Types.ObjectId | null
  tags: Types.ObjectId[]
  topics: Types.ObjectId[]
  source: string
  sourceUrl: string
  notes: string
  showOnHome: boolean
  isFeatured: boolean
  viewCount: number
  commentCount: number
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  // Extra fields per article type
  videoUrl: string
  streamUrl: string
  scheduledAt: Date | null
  steps: IStep[]
  qaItems: IQaItem[]
  ingredients: string
  cookingTime: string
  servings: string
}

const articleSchema = new Schema<IArticle>(
  {
    title:       { type: String, required: true, trim: true, maxlength: 500 },
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    sapo:        { type: String, default: '', maxlength: 1000 },
    content:     { type: String, default: '' },
    thumbnail:   { type: String, default: '' },
    articleType: {
      type: String,
      enum: ['size_s','size_m','size_l','magazine','big_story','video_autoplay','livestream','wiki_how','cooking','qa'],
      default: 'size_m',
    },
    status: {
      type: String,
      enum: ['draft','processing','waiting_edit','waiting_publish','approved','published',
             'cross_post','returned','in_progress','removed','deleted','magazine'],
      default: 'draft',
      index: true,
    },
    categoryId:  { type: Schema.Types.ObjectId, ref: 'IMSCategory',    default: null },
    writerId:    { type: Schema.Types.ObjectId, ref: 'IMSUser',         default: null },
    editorId:    { type: Schema.Types.ObjectId, ref: 'IMSUser',         default: null },
    publisherId: { type: Schema.Types.ObjectId, ref: 'IMSUser',         default: null },
    authorId:    { type: Schema.Types.ObjectId, ref: 'IMSAuthor',       default: null },
    tags:        [{ type: Schema.Types.ObjectId, ref: 'IMSTag' }],
    topics:      [{ type: Schema.Types.ObjectId, ref: 'IMSTopic' }],
    source:      { type: String, default: '' },
    sourceUrl:   { type: String, default: '' },
    notes:       { type: String, default: '' },
    showOnHome:  { type: Boolean, default: false },
    isFeatured:  { type: Boolean, default: false },
    viewCount:   { type: Number, default: 0 },
    commentCount:{ type: Number, default: 0 },
    publishedAt: { type: Date, default: null },
    // Extra per-type fields
    videoUrl:    { type: String, default: '' },
    streamUrl:   { type: String, default: '' },
    scheduledAt: { type: Date, default: null },
    steps: {
      type: [{ stepTitle: String, stepContent: String, stepImage: String }],
      default: [],
    },
    qaItems: {
      type: [{ question: String, answer: String }],
      default: [],
    },
    ingredients: { type: String, default: '' },
    cookingTime: { type: String, default: '' },
    servings:    { type: String, default: '' },
  },
  { timestamps: true, collection: 'ims_articles' },
)

articleSchema.index({ status: 1, publishedAt: -1 })
articleSchema.index({ categoryId: 1 })
articleSchema.index({ writerId: 1 })
articleSchema.index({ slug: 1 })

export const Article =
  (mongoose.models.IMSArticle as mongoose.Model<IArticle>) ||
  mongoose.model<IArticle>('IMSArticle', articleSchema)
