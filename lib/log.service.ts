import { Types } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { ActionLog, ActionType, ObjectType } from '@/models/action-log'

export async function writeLog(params: {
  userId: string
  actionType: ActionType
  objectType: ObjectType
  objectId: string
  objectTitle?: string
  detail?: string
}): Promise<void> {
  try {
    await connectDB()
    await ActionLog.create({
      userId: new Types.ObjectId(params.userId),
      actionType: params.actionType,
      objectType: params.objectType,
      objectId: new Types.ObjectId(params.objectId),
      objectTitle: params.objectTitle ?? '',
      detail: params.detail ?? '',
    })
  } catch {
    // log failure must never break the main business flow
  }
}
