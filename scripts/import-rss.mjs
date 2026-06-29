/**
 * RSS Import Script — chạy độc lập, không cần HTTP server
 * Usage: node scripts/import-rss.mjs
 */

import mongoose from 'mongoose'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/* ── load .env.local ── */
try {
  const envFile = readFileSync(resolve('.env.local'), 'utf-8')
  for (const line of envFile.split('\n')) {
    const eq = line.indexOf('=')
    if (eq < 1 || line.startsWith('#')) continue
    const key = line.slice(0, eq).trim()
    const val = line.slice(eq + 1).trim()
    if (key && !(key in process.env)) process.env[key] = val
  }
} catch { /* no .env.local */ }

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/journalism-cms'

/* ── feeds to import ── */
const FEEDS = [
  { name: 'VnExpress - Tin mới nhất',  url: 'https://vnexpress.net/rss/tin-muc-moi-nhat.rss' },
  { name: 'VnExpress - Thời sự',       url: 'https://vnexpress.net/rss/thoi-su.rss' },
  { name: 'VnExpress - Kinh doanh',    url: 'https://vnexpress.net/rss/kinh-doanh.rss' },
  { name: 'VnExpress - Thể thao',      url: 'https://vnexpress.net/rss/the-thao.rss' },
  { name: 'VnExpress - Công nghệ',     url: 'https://vnexpress.net/rss/khoa-hoc-cong-nghe.rss' },
  { name: 'Tuổi Trẻ - Tin mới nhất',  url: 'https://tuoitre.vn/rss/tin-muc-moi-nhat.rss' },
  { name: 'Thanh Niên',                url: 'https://thanhnien.vn/rss/home.rss' },
  { name: 'Dân Trí',                   url: 'https://dantri.com.vn/rss/home.rss' },
]

/* ── minimal RSS parser ── */
function getTag(xml, tag) {
  const r1 = new RegExp(`<${tag}(?:\\s[^>]*)?><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i')
  const m1 = xml.match(r1)
  if (m1) return m1[1].trim()
  const r2 = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const m2 = xml.match(r2)
  if (m2) return m2[1].trim()
  return ''
}

function getAttr(fragment, attr) {
  const m = fragment.match(new RegExp(`\\b${attr}="([^"]*)"`, 'i'))
  return m ? m[1] : ''
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function slugify(text) {
  return text
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
    .slice(0, 100)
}

async function fetchRSS(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 IMS-RSS-Reader/1.0' },
    signal: AbortSignal.timeout(15_000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const xml = await res.text()
  const itemRegex = /<item[\s>][\s\S]*?<\/item>/gi
  const items = []
  let match = null
  while ((match = itemRegex.exec(xml)) !== null) {
    const c = match[0]
    const title = getTag(c, 'title')
    if (!title) continue
    let link = ''
    const lt = c.match(/<link>([^<]+)<\/link>/i)
    if (lt) link = lt[1].trim()
    if (!link) {
      const g = c.match(/<guid[^>]*>([^<]+)<\/guid>/i)
      if (g && g[1].trim().startsWith('http')) link = g[1].trim()
    }
    if (!link) continue
    const rawDesc = getTag(c, 'description')
    const description = stripHtml(rawDesc).slice(0, 600)
    const content = getTag(c, 'content:encoded') || rawDesc
    const pubDate = getTag(c, 'pubDate') || getTag(c, 'dc:date') || ''
    let imageUrl = ''
    const enc = c.match(/<enclosure([^>]*)>/i)
    if (enc) {
      const t = getAttr(enc[1], 'type')
      if (!t || t.startsWith('image')) imageUrl = getAttr(enc[1], 'url')
    }
    if (!imageUrl) {
      const med = c.match(/<media:(?:content|thumbnail)([^>]*)>/i)
      if (med) imageUrl = getAttr(med[1], 'url')
    }
    if (!imageUrl) {
      const img = rawDesc.match(/<img[^>]*\bsrc="([^"]+)"/i)
      if (img) imageUrl = img[1]
    }
    items.push({ title, link, description, content, pubDate, imageUrl })
  }
  return items
}

/* ── mongoose schemas (mirrors actual models) ── */
const articleSchema = new mongoose.Schema({
  title: String, slug: { type: String, unique: true },
  sapo: String, content: String, thumbnail: String,
  articleType: { type: String, default: 'size_m' },
  status: { type: String, default: 'published' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, default: null },
  writerId:   { type: mongoose.Schema.Types.ObjectId, default: null },
  editorId:   { type: mongoose.Schema.Types.ObjectId, default: null },
  publisherId:{ type: mongoose.Schema.Types.ObjectId, default: null },
  authorId:   { type: mongoose.Schema.Types.ObjectId, default: null },
  tags: { type: [], default: [] }, topics: { type: [], default: [] },
  source: { type: String, default: '' },
  sourceUrl: { type: String, default: '' },
  notes: { type: String, default: '' },
  showOnHome: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  publishedAt: { type: Date, default: null },
}, { timestamps: true, collection: 'ims_articles' })

const rssFeedSchema = new mongoose.Schema({
  name: String, url: { type: String, unique: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, default: null },
  lastImported: { type: Date, default: null },
  importCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, collection: 'ims_rss_feeds' })

/* ── main ── */
async function main() {
  console.log(`\n📡 Kết nối MongoDB: ${MONGODB_URI.replace(/\/\/.*@/, '//***@')}\n`)
  await mongoose.connect(MONGODB_URI)

  const Article = mongoose.models.Article || mongoose.model('Article', articleSchema)
  const RSSFeed = mongoose.models.RSSFeed || mongoose.model('RSSFeed', rssFeedSchema)

  let grandTotal = 0

  for (const feedCfg of FEEDS) {
    process.stdout.write(`\n⏳ ${feedCfg.name} ...`)
    try {
      const items = await fetchRSS(feedCfg.url)
      process.stdout.write(` ${items.length} items\n`)

      // Upsert feed record
      await RSSFeed.updateOne(
        { url: feedCfg.url },
        { $setOnInsert: { name: feedCfg.name, url: feedCfg.url, isActive: true } },
        { upsert: true }
      )

      let newCount = 0
      for (const item of items.slice(0, 30)) {
        const exists = await Article.exists({ sourceUrl: item.link })
        if (exists) continue

        const slug = `${slugify(item.title)}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`
        await Article.create({
          title: item.title, slug,
          sapo: item.description,
          content: item.content || item.description,
          thumbnail: item.imageUrl || '',
          source: feedCfg.name,
          sourceUrl: item.link,
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        })
        newCount++
        grandTotal++
        console.log(`   + ${item.title.slice(0, 70)}`)
      }

      const feed = await RSSFeed.findOne({ url: feedCfg.url })
      if (feed) {
        await RSSFeed.findByIdAndUpdate(feed._id, {
          lastImported: new Date(),
          $inc: { importCount: newCount },
        })
      }

      console.log(`   ✅ ${newCount} bài mới (${items.length - newCount} đã có)`)
    } catch (err) {
      console.log(`   ❌ Lỗi: ${err.message}`)
    }
  }

  console.log(`\n🎉 Xong! Tổng cộng ${grandTotal} bài mới đã vào MongoDB.\n`)
  await mongoose.disconnect()
}

main().catch(err => { console.error('\n❌', err.message); process.exit(1) })
