/**
 * Seed dữ liệu "Dòng sự kiện" vào MongoDB
 * Usage: node scripts/seed-events.mjs
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

const eventSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  slug:         { type: String, required: true, unique: true },
  description:  { type: String, default: '' },
  categoryId:   { type: mongoose.Schema.Types.ObjectId, default: null },
  categoryName: { type: String, default: '' },
  articleCount: { type: Number, default: 0 },
  showOnHome:   { type: Boolean, default: false },
  isFeatured:   { type: Boolean, default: false },
  isActive:     { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true, collection: 'ims_events' })

function slugify(text) {
  return text
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
    .slice(0, 100)
}

const SEED_EVENTS = [
  { name: 'Chiến tranh và hợp tác quân sự Mỹ - Ukraine',   categoryName: 'Thế giới',   articleCount: 142, showOnHome: true,  isFeatured: false, displayOrder: 1 },
  { name: 'Giá cà phê tăng cao toàn cầu',                   categoryName: 'Kinh tế',    articleCount: 38,  showOnHome: true,  isFeatured: true,  displayOrder: 2 },
  { name: 'Cuộc đua công nghệ AI giữa các cường quốc',       categoryName: 'Công nghệ',  articleCount: 97,  showOnHome: false, isFeatured: true,  displayOrder: 3 },
  { name: 'Biến đổi khí hậu và thiên tai 2026',              categoryName: 'Xã hội',     articleCount: 54,  showOnHome: true,  isFeatured: false, displayOrder: 4 },
  { name: 'Hành trình đội tuyển Việt Nam AFF Cup 2026',      categoryName: 'Thể thao',   articleCount: 213, showOnHome: true,  isFeatured: true,  displayOrder: 5 },
  { name: 'Quy hoạch đô thị Hà Nội 2030',                   categoryName: 'Thời sự',    articleCount: 67,  showOnHome: false, isFeatured: false, displayOrder: 6 },
  { name: 'Chính sách y tế và dịch bệnh mới nhất',          categoryName: 'Sức khỏe',   articleCount: 44,  showOnHome: true,  isFeatured: false, displayOrder: 7 },
  { name: 'Thị trường bất động sản phục hồi sau dịch',      categoryName: 'Kinh tế',    articleCount: 89,  showOnHome: false, isFeatured: false, displayOrder: 8 },
  { name: 'Đổi mới chương trình giáo dục phổ thông',        categoryName: 'Xã hội',     articleCount: 31,  showOnHome: true,  isFeatured: false, displayOrder: 9 },
]

async function main() {
  console.log(`\nKết nối MongoDB: ${MONGODB_URI.replace(/\/\/.*@/, '//***@')}\n`)
  await mongoose.connect(MONGODB_URI)

  const EventModel = mongoose.models.IMSEvent || mongoose.model('IMSEvent', eventSchema)

  const existing = await EventModel.countDocuments()
  if (existing > 0) {
    console.log(`⚠️  Đã có ${existing} dòng sự kiện trong DB. Bỏ qua seed.\n`)
    console.log('   Để seed lại, xóa collection ims_events trước.\n')
    await mongoose.disconnect()
    return
  }

  let created = 0
  for (const e of SEED_EVENTS) {
    await EventModel.create({
      ...e,
      slug: slugify(e.name) + '-' + Date.now().toString(36),
    })
    console.log(`   ✅ ${e.name}`)
    created++
  }

  console.log(`\n🎉 Đã seed ${created} dòng sự kiện vào ims_events.\n`)
  await mongoose.disconnect()
}

main().catch(e => { console.error('❌', e.message); process.exit(1) })
