import { Types } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { Article, ArticleStatus, IArticle } from '@/models/article'
import { writeLog } from '@/lib/log.service'

/* ── Article type rules ── */
interface TypeRule {
  minWords: number
  requireThumbnail: boolean
  requireSapo: boolean
  requireCategory: boolean
  requireVideoUrl?: boolean
  requireStreamUrl?: boolean
  requireSteps?: boolean
  requireQaItems?: boolean
}

const TYPE_RULES: Record<string, TypeRule> = {
  size_s:         { minWords: 100,  requireThumbnail: false, requireSapo: false, requireCategory: true },
  size_m:         { minWords: 300,  requireThumbnail: true,  requireSapo: true,  requireCategory: true },
  size_l:         { minWords: 800,  requireThumbnail: true,  requireSapo: true,  requireCategory: true },
  magazine:       { minWords: 1500, requireThumbnail: true,  requireSapo: true,  requireCategory: true },
  big_story:      { minWords: 1500, requireThumbnail: true,  requireSapo: true,  requireCategory: true },
  video_autoplay: { minWords: 0,    requireThumbnail: true,  requireSapo: false, requireCategory: true, requireVideoUrl: true },
  livestream:     { minWords: 0,    requireThumbnail: true,  requireSapo: false, requireCategory: true, requireStreamUrl: true },
  wiki_how:       { minWords: 0,    requireThumbnail: true,  requireSapo: false, requireCategory: true, requireSteps: true },
  cooking:        { minWords: 0,    requireThumbnail: true,  requireSapo: false, requireCategory: true },
  qa:             { minWords: 0,    requireThumbnail: false, requireSapo: false, requireCategory: true, requireQaItems: true },
}

function countWordsInHtml(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return text === '' ? 0 : text.split(' ').filter(Boolean).length
}

function validateArticleForSubmit(article: IArticle): string[] {
  const errors: string[] = []
  const rule = TYPE_RULES[article.articleType] ?? TYPE_RULES['size_m']

  if (rule.minWords > 0) {
    const wc = countWordsInHtml(article.content ?? '')
    if (wc < rule.minWords) {
      errors.push(`Nội dung quá ngắn — cần ít nhất ${rule.minWords} từ, hiện có ${wc} từ.`)
    }
  }
  if (rule.requireThumbnail && !article.thumbnail) {
    errors.push('Chưa có ảnh đại diện (thumbnail).')
  }
  if (rule.requireSapo && !article.sapo?.trim()) {
    errors.push('Chưa có mô tả (sapo).')
  }
  if (rule.requireCategory && !article.categoryId) {
    errors.push('Chưa chọn chuyên mục.')
  }
  if (rule.requireVideoUrl && !article.videoUrl?.trim()) {
    errors.push('Bài video cần có đường dẫn video (videoUrl).')
  }
  if (rule.requireStreamUrl && !article.streamUrl?.trim()) {
    errors.push('Bài livestream cần có đường dẫn stream (streamUrl).')
  }
  if (rule.requireSteps && (!article.steps || article.steps.length < 2)) {
    errors.push('Bài Wiki-How cần ít nhất 2 bước hướng dẫn.')
  }
  if (rule.requireQaItems && (!article.qaItems || article.qaItems.length < 2)) {
    errors.push('Bài Q&A cần ít nhất 2 cặp hỏi-đáp.')
  }

  return errors
}

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

  // Validate article content rules before submitting for review
  if (to === 'processing') {
    const errors = validateArticleForSubmit(article as IArticle)
    if (errors.length > 0) {
      return { ok: false, error: errors.join(' ') }
    }
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
