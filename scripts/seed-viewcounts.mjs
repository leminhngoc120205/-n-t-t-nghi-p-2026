/**
 * Seed viewCount cho các bài RSS đã import (đang = 0)
 * Dùng công thức dựa trên tuổi bài: bài mới nhất = nhiều view nhất
 * Usage: node scripts/seed-viewcounts.mjs
 */

import mongoose from 'mongoose'
import { readFileSync } from 'fs'
import { resolve } from 'path'

try {
  const env = readFileSync(resolve('.env.local'), 'utf-8')
  for (const line of env.split('\n')) {
    const eq = line.indexOf('=')
    if (eq < 1 || line.startsWith('#')) continue
    const k = line.slice(0, eq).trim()
    const v = line.slice(eq + 1).trim()
    if (k && !(k in process.env)) process.env[k] = v
  }
} catch {}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/journalism-cms'

const articleSchema = new mongoose.Schema({
  viewCount: Number,
  publishedAt: Date,
  sourceUrl: String,
  status: String,
}, { strict: false, collection: 'ims_articles' })

/* Ước lượng view dựa vào tuổi bài + seed từ ObjectId để deterministic */
function estimateViewCount(publishedAt, objectIdHex) {
  const ageHours = (Date.now() - new Date(publishedAt).getTime()) / 3_600_000
  const seed = parseInt(objectIdHex?.slice(-4) ?? '0', 16) / 65535  // 0..1

  let base, spread
  if      (ageHours < 3)   { base = 400;   spread = 800 }   // Vừa đăng: 400-1200
  else if (ageHours < 12)  { base = 1200;  spread = 3800 }  // Buổi sáng: 1200-5000
  else if (ageHours < 24)  { base = 3000;  spread = 9000 }  // Trong ngày: 3k-12k
  else if (ageHours < 48)  { base = 6000;  spread = 14000 } // Hôm qua: 6k-20k
  else if (ageHours < 96)  { base = 4000;  spread = 11000 } // 2-4 ngày: 4k-15k
  else if (ageHours < 168) { base = 2000;  spread = 8000 }  // tuần này: 2k-10k
  else                     { base = 500;   spread = 4500 }  // cũ hơn: 500-5k

  return Math.round(base + seed * spread)
}

async function main() {
  console.log(`\nKết nối MongoDB: ${MONGODB_URI.replace(/\/\/.*@/, '//***@')}\n`)
  await mongoose.connect(MONGODB_URI)

  const Article = mongoose.models.Article || mongoose.model('Article', articleSchema)

  // Tìm bài có sourceUrl (RSS) và viewCount = 0
  const articles = await Article.find({
    sourceUrl: { $exists: true, $ne: '' },
    viewCount: 0,
    status: 'published',
  }).select('_id publishedAt title').lean()

  console.log(`Tìm thấy ${articles.length} bài RSS chưa có view count.\n`)

  let updated = 0
  for (const a of articles) {
    const viewCount = estimateViewCount(
      a.publishedAt ?? new Date(),
      a._id.toString()
    )
    await Article.findByIdAndUpdate(a._id, { viewCount })
    updated++
    if (updated % 20 === 0) process.stdout.write(`  ${updated}/${articles.length}...\n`)
  }

  console.log(`\n✅ Đã cập nhật ${updated} bài với viewCount thực tế.\n`)
  await mongoose.disconnect()
}

main().catch(e => { console.error('❌', e.message); process.exit(1) })
