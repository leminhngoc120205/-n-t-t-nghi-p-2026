import { Types } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { Article, ArticleStatus } from '@/models/article'
import { writeLog } from '@/lib/log.service'

// transition[fromStatus][toStatus] = allowed roles
const TRANSITIONS: Record<string, Record<string, string[]>> = {
  draft:           { processing: ['reporter', 'editor', 'admin'] },
  processing:      { waiting_edit: ['editor', 'admin'], returned: ['editor', 'admin'], draft: ['reporter', 'editor', 'admin'] },
  waiting_edit:    { waiting_publish: ['editor', 'admin'], returned: ['editor', 'admin'] },
  returned:        { processing: ['reporter', 'editor', 'admin'] },
  waiting_publish: { published: ['admin'], returned: ['admin', 'editor'] },
  published:       { removed: ['admin'] },
  removed:         { published: ['admin'], deleted: ['admin'] },
}

const TRANSITION_ACTION: Record<string, string> = {
  processing:      'submit_edit',
  waiting_edit:    'update',
  waiting_publish: 'submit_publish',
  published:       'publish',
  removed:         'unpublish',
  returned:        'return',
  deleted:         'delete',
}

export function canTransition(from: ArticleStatus, to: ArticleStatus, role: string): boolean {
  return !!TRANSITIONS[from]?.[to]?.includes(role)
}

export async function transitionStatus(
  articleId: string,
  to: ArticleStatus,
  userId: string,
  role: string,
  notes?: string,
): Promise<{ ok: boolean; error?: string; data?: unknown }> {
  if (!Types.ObjectId.isValid(articleId)) return { ok: false, error: 'ID không hợp lệ.' }

  await connectDB()
  const article = await Article.findById(articleId)
  if (!article) return { ok: false, error: 'Không tìm thấy bài viết.' }

  const from = article.status as ArticleStatus
  if (!canTransition(from, to, role)) {
    return { ok: false, error: `Không có quyền chuyển trạng thái từ "${from}" sang "${to}".` }
  }

  const update: Record<string, unknown> = { status: to }
  if (to === 'published') {
    update.publishedAt = new Date()
    update.publisherId = new Types.ObjectId(userId)
  }
  if (to === 'waiting_edit') {
    update.editorId = new Types.ObjectId(userId)
  }
  if (notes !== undefined) {
    update.notes = notes
  }

  const updated = await Article.findByIdAndUpdate(articleId, update, { new: true })

  await writeLog({
    userId,
    actionType: (TRANSITION_ACTION[to] ?? 'update') as import('@/models/action-log').ActionType,
    objectType: 'article',
    objectId: articleId,
    objectTitle: article.title,
    detail: notes,
  })

  return { ok: true, data: updated }
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}
