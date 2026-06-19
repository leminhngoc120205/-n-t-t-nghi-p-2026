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

  // ─── Articles ─────────────────────────────────────────────────────────────
  const artColl = db.collection('ims_articles')
  if (await artColl.countDocuments() === 0) {
    // Lấy _id thật từ các collection đã seed
    const [uAdmin, uEditor, uReporter] = await Promise.all([
      userColl.findOne({ username: 'ngoclm_vcc' }),
      userColl.findOne({ username: 'editor_vcc' }),
      userColl.findOne({ username: 'minhvu' }),
    ])
    const [catTS, catKT, catXH, catTT, catCN] = await Promise.all([
      catColl.findOne({ slug: 'thoi-su' }),
      catColl.findOne({ slug: 'kinh-te' }),
      catColl.findOne({ slug: 'xa-hoi' }),
      catColl.findOne({ slug: 'the-thao' }),
      catColl.findOne({ slug: 'cong-nghe' }),
    ])

    const now = new Date()
    const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000)

    await artColl.insertMany([
      {
        title: 'Dự báo thời tiết ngày 19/6/2026: Hà Nội nắng nóng gay gắt, nhiệt độ lên tới 39°C',
        slug: 'du-bao-thoi-tiet-19-6-2026-ha-noi-nang-nong-' + Date.now(),
        sapo: 'Theo Trung tâm Khí tượng Thủy văn Quốc gia, ngày 19/6/2026 Hà Nội và các tỉnh Bắc Bộ tiếp tục chịu ảnh hưởng của đợt nắng nóng gay gắt, nhiệt độ cao nhất lên tới 39–40°C.',
        content: 'Cơ quan khí tượng cảnh báo người dân hạn chế ra ngoài trong khung giờ 10h–16h. Khu vực Tây Bắc Bộ nắng nóng đặc biệt gay gắt với nhiệt độ phổ biến 37–39°C.\n\nMiền Trung từ Thanh Hóa đến Thừa Thiên Huế nắng nóng, nhiệt độ 35–38°C. Nam Bộ chiều tối có mưa dông, đề phòng lốc, sét và gió giật mạnh.',
        thumbnail: '', articleType: 'size_m', status: 'published',
        writerId: uReporter!._id, editorId: uEditor!._id, publisherId: uAdmin!._id,
        categoryId: catTS!._id, authorId: null, tags: [], topics: [],
        source: 'TTXVN', notes: '', showOnHome: true, isFeatured: true,
        viewCount: 15423, commentCount: 12, publishedAt: daysAgo(1),
        createdAt: daysAgo(2), updatedAt: daysAgo(1),
      },
      {
        title: 'Quốc hội thông qua Nghị quyết về cơ cấu lại nền kinh tế giai đoạn 2026–2030',
        slug: 'quoc-hoi-thong-qua-nghi-quyet-co-cau-kinh-te-' + (Date.now() + 1),
        sapo: 'Với 472/473 đại biểu tán thành, Quốc hội đã chính thức thông qua Nghị quyết về Kế hoạch cơ cấu lại nền kinh tế giai đoạn 2026–2030, đặt mục tiêu tăng trưởng GDP bình quân 7,5%/năm.',
        content: 'Nghị quyết xác định 5 lĩnh vực ưu tiên tái cơ cấu gồm: đầu tư công, doanh nghiệp nhà nước, hệ thống tổ chức tín dụng, đơn vị sự nghiệp công lập và ngân sách nhà nước.\n\nMục tiêu đến 2030: kinh tế số đóng góp 30% GDP; xuất khẩu tăng trưởng bình quân 7–8%/năm.',
        thumbnail: '', articleType: 'size_l', status: 'published',
        writerId: uReporter!._id, editorId: uEditor!._id, publisherId: uAdmin!._id,
        categoryId: catKT!._id, authorId: null, tags: [], topics: [],
        source: 'Cổng TTĐT Quốc hội', notes: '', showOnHome: false, isFeatured: false,
        viewCount: 9871, commentCount: 5, publishedAt: daysAgo(2),
        createdAt: daysAgo(3), updatedAt: daysAgo(2),
      },
      {
        title: 'TP.HCM ra mắt ứng dụng tra cứu ngập lụt thời gian thực cho người dân',
        slug: 'tphcm-ra-mat-ung-dung-tra-cuu-ngap-lut-' + (Date.now() + 2),
        sapo: 'UBND TP.HCM vừa ra mắt ứng dụng "HCM Flood Alert" cho phép người dân tra cứu điểm ngập lụt theo thời gian thực, cập nhật mỗi 5 phút từ hệ thống 1.200 cảm biến.',
        content: 'Ứng dụng tích hợp bản đồ Google Maps, cảnh báo đẩy khi khu vực người dùng có nguy cơ ngập trên 20cm. Đây là bước tiến quan trọng trong chiến lược đô thị thông minh của TP.HCM giai đoạn 2025–2030.',
        thumbnail: '', articleType: 'size_s', status: 'waiting_edit',
        writerId: uReporter!._id, editorId: null, publisherId: null,
        categoryId: catXH!._id, authorId: null, tags: [], topics: [],
        source: 'UBND TP.HCM', notes: '', showOnHome: false, isFeatured: false,
        viewCount: 0, commentCount: 0, publishedAt: null,
        createdAt: daysAgo(1), updatedAt: daysAgo(1),
      },
      {
        title: 'VinFast ra mắt mẫu xe điện VF 3 Plus với tầm hoạt động 350 km',
        slug: 'vinfast-ra-mat-vf3-plus-350km-' + (Date.now() + 3),
        sapo: 'VinFast chính thức giới thiệu phiên bản nâng cấp VF 3 Plus tại triển lãm ô tô Hà Nội 2026, với pin mới cho phép di chuyển tới 350 km mỗi lần sạc đầy, giá bán dự kiến 390 triệu đồng.',
        content: 'VF 3 Plus được trang bị pin LFP dung lượng 42 kWh, hỗ trợ sạc nhanh DC 50kW. Xe có thêm tính năng hỗ trợ lái tự động Level 2, camera 360 độ và màn hình trung tâm 10,4 inch.',
        thumbnail: '', articleType: 'size_m', status: 'draft',
        writerId: uAdmin!._id, editorId: null, publisherId: null,
        categoryId: catKT!._id, authorId: null, tags: [], topics: [],
        source: 'VinFast', notes: 'Chờ ảnh chính thức từ PR VinFast', showOnHome: false, isFeatured: false,
        viewCount: 0, commentCount: 0, publishedAt: null,
        createdAt: daysAgo(1), updatedAt: daysAgo(1),
      },
      {
        title: 'Đội tuyển Việt Nam triệu tập 28 cầu thủ chuẩn bị cho AFF Cup 2026',
        slug: 'doi-tuyen-viet-nam-trieu-tap-aff-cup-2026-' + (Date.now() + 4),
        sapo: 'HLV trưởng Kim Sang-sik công bố danh sách 28 cầu thủ được triệu tập vào đội tuyển Việt Nam cho vòng loại AFF Cup 2026, trong đó có 5 cầu thủ đang thi đấu tại nước ngoài.',
        content: 'Đáng chú ý có sự trở lại của tiền đạo Nguyễn Tiến Linh sau thời gian điều trị chấn thương. Đội sẽ tập trung từ ngày 1/7 tại Hà Nội trước khi di chuyển sang Thái Lan thi đấu vào ngày 10/7.',
        thumbnail: '', articleType: 'size_m', status: 'published',
        writerId: uReporter!._id, editorId: uEditor!._id, publisherId: uAdmin!._id,
        categoryId: catTT!._id, authorId: null, tags: [], topics: [],
        source: 'VFF', notes: '', showOnHome: true, isFeatured: true,
        viewCount: 24105, commentCount: 38, publishedAt: daysAgo(3),
        createdAt: daysAgo(4), updatedAt: daysAgo(3),
      },
      {
        title: 'Google ra mắt Gemini 2.5 Ultra — mô hình AI mạnh nhất từ trước đến nay',
        slug: 'google-gemini-2-5-ultra-ra-mat-' + (Date.now() + 5),
        sapo: 'Google DeepMind chính thức công bố Gemini 2.5 Ultra, vượt qua GPT-5 trên hầu hết các bài benchmark, đặc biệt xuất sắc trong lập luận toán học và lập trình.',
        content: 'Gemini 2.5 Ultra đạt 92,1% trên MMLU, 68,5% trên HumanEval, và lần đầu tiên vượt ngưỡng 90% trên bài kiểm tra bar của luật sư.\n\nModel hiện có trên Google AI Studio và sẽ tích hợp vào Workspace từ tháng 8/2026.',
        thumbnail: '', articleType: 'size_m', status: 'waiting_publish',
        writerId: uReporter!._id, editorId: uEditor!._id, publisherId: null,
        categoryId: catCN!._id, authorId: null, tags: [], topics: [],
        source: 'Google Blog', notes: '', showOnHome: false, isFeatured: false,
        viewCount: 0, commentCount: 0, publishedAt: null,
        createdAt: daysAgo(1), updatedAt: daysAgo(0),
      },
      {
        title: 'Việt Nam lần đầu xuất khẩu chip bán dẫn sang thị trường Mỹ',
        slug: 'viet-nam-xuat-khau-chip-ban-dan-my-' + (Date.now() + 6),
        sapo: 'Tập đoàn VinTech công bố lô hàng chip bán dẫn đầu tiên xuất khẩu sang Hoa Kỳ trị giá 12 triệu USD, đánh dấu bước ngoặt lịch sử trong ngành công nghệ Việt Nam.',
        content: 'Các chip được sản xuất tại nhà máy Hòa Lạc, đạt tiêu chuẩn 28nm. Đây là kết quả của chiến lược hợp tác với Intel và Samsung trong 3 năm qua.',
        thumbnail: '', articleType: 'size_l', status: 'published',
        writerId: uEditor!._id, editorId: uEditor!._id, publisherId: uAdmin!._id,
        categoryId: catCN!._id, authorId: null, tags: [], topics: [],
        source: 'VinTech', notes: '', showOnHome: true, isFeatured: false,
        viewCount: 31240, commentCount: 67, publishedAt: daysAgo(4),
        createdAt: daysAgo(5), updatedAt: daysAgo(4),
      },
      {
        title: 'Giá xăng trong nước tăng lần thứ 3 liên tiếp, RON 95 vượt 25.000 đồng',
        slug: 'gia-xang-tang-lan-3-ron95-vuot-25000-' + (Date.now() + 7),
        sapo: 'Liên bộ Công Thương – Tài chính quyết định điều chỉnh tăng giá xăng dầu từ 15h ngày 18/6/2026, xăng RON 95 tăng thêm 680 đồng/lít, lên mức 25.340 đồng/lít.',
        content: 'Đây là lần tăng giá thứ 3 liên tiếp trong vòng 6 tuần. Nguyên nhân chính do giá dầu thô thế giới tăng mạnh, vượt ngưỡng 95 USD/thùng.\n\nGiá dầu diesel cũng tăng 520 đồng/lít, hiện ở mức 22.180 đồng/lít.',
        thumbnail: '', articleType: 'size_s', status: 'returned',
        writerId: uReporter!._id, editorId: uEditor!._id, publisherId: null,
        categoryId: catKT!._id, authorId: null, tags: [], topics: [],
        source: 'Bộ Công Thương', notes: 'Cần cập nhật số liệu mới nhất từ buổi họp báo 18h', showOnHome: false, isFeatured: false,
        viewCount: 0, commentCount: 0, publishedAt: null,
        createdAt: daysAgo(2), updatedAt: daysAgo(0),
      },
      {
        title: 'Thủ tướng chủ trì họp khẩn về phòng chống lũ lụt miền Trung',
        slug: 'thu-tuong-hop-khan-phong-chong-lu-lut-mien-trung-' + (Date.now() + 8),
        sapo: 'Chiều 18/6, Thủ tướng Chính phủ chủ trì cuộc họp khẩn với các bộ ngành và địa phương miền Trung về tình hình mưa lũ diễn biến phức tạp, đặc biệt tại Quảng Nam và Quảng Ngãi.',
        content: 'Thủ tướng yêu cầu di dời khẩn cấp dân cư vùng có nguy cơ sạt lở cao, huy động lực lượng quân đội, công an hỗ trợ địa phương.\n\nTính đến 16h ngày 18/6, đã có 3 người thiệt mạng, 12 người mất tích do lũ lụt tại Quảng Nam.',
        thumbnail: '', articleType: 'size_m', status: 'processing',
        writerId: uReporter!._id, editorId: null, publisherId: null,
        categoryId: catTS!._id, authorId: null, tags: [], topics: [],
        source: 'VGP', notes: '', showOnHome: false, isFeatured: false,
        viewCount: 0, commentCount: 0, publishedAt: null,
        createdAt: daysAgo(0), updatedAt: daysAgo(0),
      },
      {
        title: 'Ronaldo lập hat-trick giúp Al-Nassr thắng 4–1 ở AFC Champions League',
        slug: 'ronaldo-hat-trick-al-nassr-afc-champions-' + (Date.now() + 9),
        sapo: 'Cristiano Ronaldo có màn trình diễn xuất sắc với cú hat-trick trong trận Al-Nassr thắng Pohang Steelers 4–1 tại vòng bảng AFC Champions League Elite 2026.',
        content: 'Ronaldo ghi bàn ở phút 23, 51 và 78 — trong đó có một bàn penalty và một cú volley ngoạn mục. Với cú hat-trick này, Ronaldo nâng tổng số bàn thắng sự nghiệp lên 932.\n\nAl-Nassr hiện dẫn đầu bảng D với 9 điểm sau 3 trận.',
        thumbnail: '', articleType: 'size_m', status: 'published',
        writerId: uReporter!._id, editorId: uEditor!._id, publisherId: uAdmin!._id,
        categoryId: catTT!._id, authorId: null, tags: [], topics: [],
        source: 'AFC', notes: '', showOnHome: false, isFeatured: true,
        viewCount: 18930, commentCount: 95, publishedAt: daysAgo(2),
        createdAt: daysAgo(3), updatedAt: daysAgo(2),
      },
      {
        title: 'Bộ Y tế cảnh báo dịch sốt xuất huyết bùng phát tại 15 tỉnh phía Nam',
        slug: 'bo-y-te-canh-bao-sot-xuat-huyet-15-tinh-phia-nam-' + (Date.now() + 10),
        sapo: 'Bộ Y tế phát đi cảnh báo khẩn về tình trạng sốt xuất huyết tăng đột biến tại 15 tỉnh thành phía Nam, với hơn 12.000 ca mắc mới chỉ trong tháng 6/2026.',
        content: 'TP.HCM, Bình Dương và Đồng Nai là 3 địa phương có số ca mắc cao nhất. Bộ Y tế khuyến cáo người dân diệt lăng quăng, bọ gậy và sử dụng kem chống muỗi.\n\nCác bệnh viện đã kích hoạt phương án ứng phó dịch bệnh, tăng cường cơ số giường bệnh.',
        thumbnail: '', articleType: 'size_m', status: 'deleted',
        writerId: uReporter!._id, editorId: uEditor!._id, publisherId: uAdmin!._id,
        categoryId: catXH!._id, authorId: null, tags: [], topics: [],
        source: 'Bộ Y tế', notes: 'Đã gỡ theo yêu cầu kiểm tra thông tin', showOnHome: false, isFeatured: false,
        viewCount: 4210, commentCount: 8, publishedAt: daysAgo(5),
        createdAt: daysAgo(6), updatedAt: daysAgo(0),
      },
    ])
    console.log('✅ Seeded 11 articles (đủ các trạng thái)')
  } else {
    console.log('⏭️  Articles đã có dữ liệu, bỏ qua')
  }

  await mongoose.disconnect()
  console.log('\n🎉 Seed hoàn tất!')
}

main().catch(err => { console.error(err); process.exit(1) })
