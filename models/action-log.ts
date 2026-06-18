import mongoose, { Schema, Document, Types } from 'mongoose'

export type ActionType =
  | 'create' | 'update' | 'delete'
  | 'submit_edit' | 'submit_publish'
  | 'approve' | 'publish' | 'unpublish'
  | 'return' | 'remove' | 'restore'

export type ObjectType = 'article' | 'user' | 'category' | 'topic' | 'tag' | 'author' | 'department'

export interface IActionLog extends Document {
  userId: Types.ObjectId
  actionType: ActionType
  objectType: ObjectType
  objectId: Types.ObjectId
  objectTitle: string
  detail: string
  createdAt: Date
}

const actionLogSchema = new Schema<IActionLog>(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'IMSUser', required: true },
    actionType:  {
      type: String,
      enum: ['create','update','delete','submit_edit','submit_publish',
             'approve','publish','unpublish','return','remove','restore'],
      required: true,
    },
    objectType:  {
      type: String,
      enum: ['article','user','category','topic','tag','author','department'],
      required: true,
    },
    objectId:    { type: Schema.Types.ObjectId, required: true },
    objectTitle: { type: String, default: '' },
    detail:      { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false }, collection: 'ims_action_logs' },
)

actionLogSchema.index({ userId: 1, createdAt: -1 })
actionLogSchema.index({ objectType: 1, objectId: 1 })

export const ActionLog =
  (mongoose.models.IMSActionLog as mongoose.Model<IActionLog>) ||
  mongoose.model<IActionLog>('IMSActionLog', actionLogSchema)
