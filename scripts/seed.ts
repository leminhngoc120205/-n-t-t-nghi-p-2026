/**
 * Chạy: npx tsx scripts/seed.ts
 * Yêu cầu: MONGODB_URI đã set trong .env.local
 */
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import { hashPassword } from '../lib/auth'

// Đọc .env.local thủ công (không cần dotenv package)
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8').split(/\r?\n/).forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const idx = trimmed.indexOf('=')
    if (idx > 0) process.env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim()
  })
}

const URI = process.env.MONGODB_URI
if (!URI) { console.error('Thiếu MONGODB_URI trong .env.local'); process.exit(1) }

async function main() {
  await mongoose.connect(URI!)
  console.log('✅ Kết nối MongoDB thành công')

  const db = mongoose.connection.db!

  // ─── Departments ──────────────────────────────────────────────────────────
  const deptColl = db.collection('ims_departments')
  if (await deptColl.countDocuments() === 0) {
    await deptColl.insertMany([
      { name: 'Ban Thời sự',    slug: 'thoi-su',    location: 'Hà Nội',    createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ban Kinh tế',    slug: 'kinh-te',    location: 'Hà Nội',    createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ban Xã hội',     slug: 'xa-hoi',     location: 'Hà Nội',    createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ban Thể thao',   slug: 'the-thao',   location: 'Hà Nội',    createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ban Công nghệ',  slug: 'cong-nghe',  location: 'Hà Nội',    createdAt: new Date(), updatedAt: new Date() },
      { name: 'Văn phòng HCM',  slug: 'van-phong-hcm', location: 'TP.HCM', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Văn phòng Đà Nẵng', slug: 'van-phong-dn', location: 'Đà Nẵng', createdAt: new Date(), updatedAt: new Date() },
    ])
    console.log('✅ Seeded departments')
  }

  // ─── Categories ───────────────────────────────────────────────────────────
  const catColl = db.collection('ims_categories')
  if (await catColl.countDocuments() === 0) {
    await catColl.insertMany([
      { name: 'Thời Sự',    slug: 'thoi-su',    parentId: null, displayOrder: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Kinh Tế',    slug: 'kinh-te',    parentId: null, displayOrder: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Xã Hội',     slug: 'xa-hoi',     parentId: null, displayOrder: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Thể Thao',   slug: 'the-thao',   parentId: null, displayOrder: 4, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Công Nghệ',  slug: 'cong-nghe',  parentId: null, displayOrder: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Giải Trí',   slug: 'giai-tri',   parentId: null, displayOrder: 6, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sức Khỏe',   slug: 'suc-khoe',   parentId: null, displayOrder: 7, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    ])
    console.log('✅ Seeded categories')
  }

  // ─── Topics ───────────────────────────────────────────────────────────────
  const topicColl = db.collection('ims_topics')
  if (await topicColl.countDocuments() === 0) {
    await topicColl.insertMany([
      { name: 'Bầu cử Mỹ 2026',      slug: 'bau-cu-my-2026',      description: '', avatar: '', showIcon: false, displayOrder: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Biến đổi khí hậu',     slug: 'bien-doi-khi-hau',    description: '', avatar: '', showIcon: false, displayOrder: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'AI & Công nghệ mới',   slug: 'ai-cong-nghe-moi',    description: '', avatar: '', showIcon: true,  displayOrder: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'AFF Cup 2026',         slug: 'aff-cup-2026',        description: '', avatar: '', showIcon: false, displayOrder: 4, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    ])
    console.log('✅ Seeded topics')
  }

  // ─── Tags ─────────────────────────────────────────────────────────────────
  const tagColl = db.collection('ims_tags')
  if (await tagColl.countDocuments() === 0) {
    const tags = ['Hà Nội','TP.HCM','Quốc hội','Chính phủ','Kinh tế số','Thời tiết',
                  'Bóng đá','VinFast','ChatGPT','Y tế','Giáo dục','Môi trường']
    await tagColl.insertMany(tags.map((name) => ({
      name,
      slug: name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,'-').replace(/đ/g,'d'),
      articleCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })))
    console.log('✅ Seeded tags')
  }

  // ─── Authors ──────────────────────────────────────────────────────────────
  const authorColl = db.collection('ims_authors')
  if (await authorColl.countDocuments() === 0) {
    await authorColl.insertMany([
      { name: 'Nguyễn Văn Minh', slug: 'nguyen-van-minh', avatar: '', bio: 'Phóng viên thời sự',  email: '', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Trần Thị Hoa',    slug: 'tran-thi-hoa',    avatar: '', bio: 'Biên tập viên kinh tế', email: '', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Lê Văn Đức',      slug: 'le-van-duc',      avatar: '', bio: 'Phóng viên thể thao',  email: '', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    ])
    console.log('✅ Seeded authors')
  }

  // ─── Users ────────────────────────────────────────────────────────────────
  const userColl = db.collection('ims_users')
  if (await userColl.countDocuments() === 0) {
    await userColl.insertMany([
      { username: 'ngoclm_vcc', passwordHash: hashPassword('Admin@123'), fullName: 'Lê Minh Ngọc VCCorp',    email: 'ngoclm_vcc@gmail.com', phone: '0925158286', address: '', telegramId: '', role: 'admin',    departmentId: null, createdAt: new Date(), updatedAt: new Date() },
      { username: 'admin',      passwordHash: hashPassword('Admin@123'), fullName: 'Quản trị viên hệ thống', email: 'admin@cnnd.vn',        phone: '',           address: '', telegramId: '', role: 'admin',    departmentId: null, createdAt: new Date(), updatedAt: new Date() },
      { username: 'editor_vcc', passwordHash: hashPassword('Admin@123'), fullName: 'Biên tập viên VCC',      email: 'editor@cnnd.vn',       phone: '',           address: '', telegramId: '', role: 'editor',   departmentId: null, createdAt: new Date(), updatedAt: new Date() },
      { username: 'minhvu',     passwordHash: hashPassword('Admin@123'), fullName: 'Nguyễn Minh Vũ',         email: 'minhvu@cnnd.vn',       phone: '',           address: '', telegramId: '', role: 'reporter', departmentId: null, createdAt: new Date(), updatedAt: new Date() },
    ])
    console.log('✅ Seeded users')
  }

  await mongoose.disconnect()
  console.log('\n🎉 Seed hoàn tất!')
}

main().catch(err => { console.error(err); process.exit(1) })
