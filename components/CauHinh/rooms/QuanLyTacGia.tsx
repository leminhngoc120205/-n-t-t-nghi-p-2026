'use client'

import React, { useState, useEffect } from 'react'

interface Author {
  id: number
  name: string
  avatar: string
  description: string
  title: string
  account: string
}

const MOCK_AUTHORS: Author[] = [
  { id: 1,  name: 'anh tuấn',           avatar: 'A', description: 'Phóng viên mảng thời sự',          title: 'Phóng viên',         account: 'anhTuan01' },
  { id: 2,  name: 'Nguyễn Văn Hải',     avatar: 'N', description: 'Biên tập viên cao cấp',            title: 'Biên tập viên',      account: 'haiNV' },
  { id: 3,  name: 'Chuyên gia Lượng',   avatar: 'C', description: 'Chuyên gia phân tích kinh tế',     title: 'Chuyên gia',         account: 'luongCG' },
  { id: 4,  name: 'Văn Hải',            avatar: 'V', description: 'Phóng viên thể thao',              title: 'Phóng viên',         account: 'vanHai_sport' },
  { id: 5,  name: 'Trần Thị Bích',      avatar: 'T', description: 'Biên tập viên văn hóa xã hội',    title: 'Biên tập viên',      account: 'bichTT' },
  { id: 6,  name: 'Lê Minh Châu',       avatar: 'L', description: 'Phóng viên công nghệ',            title: 'Phóng viên',         account: 'chauLM' },
  { id: 7,  name: 'Phạm Quốc Hùng',     avatar: 'P', description: 'Trưởng ban biên tập',             title: 'Trưởng ban',         account: 'hungPQ' },
  { id: 8,  name: 'Nguyễn Thị Lan',     avatar: 'N', description: 'Biên tập viên kinh tế',           title: 'Biên tập viên',      account: 'lanNT' },
  { id: 9,  name: 'Đặng Văn Tùng',      avatar: 'Đ', description: 'Phóng viên quốc tế',              title: 'Phóng viên',         account: 'tungDV' },
  { id: 10, name: 'Hoàng Thị Mai',      avatar: 'H', description: 'Biên tập viên sức khỏe',          title: 'Biên tập viên',      account: 'maiHT' },
  { id: 11, name: 'Vũ Đình Khoa',       avatar: 'V', description: 'Cộng tác viên thường xuyên',      title: 'Cộng tác viên',      account: 'khoaVD' },
  { id: 12, name: 'Bùi Thị Thanh',      avatar: 'B', description: 'Phóng viên ảnh',                  title: 'Phóng viên ảnh',     account: 'thanhBT' },
  { id: 13, name: 'Cao Văn Nam',         avatar: 'C', description: 'Biên tập viên giáo dục',          title: 'Biên tập viên',      account: 'namCV' },
  { id: 14, name: 'Đinh Thị Hồng',      avatar: 'Đ', description: 'Phóng viên mảng du lịch',         title: 'Phóng viên',         account: 'hongDT' },
  { id: 15, name: 'Lý Văn Phúc',        avatar: 'L', description: 'Cộng tác viên freelance',         title: 'Cộng tác viên',      account: 'phucLV' },
  { id: 16, name: 'Ngô Thị Dung',       avatar: 'N', description: 'Biên tập viên pháp luật',         title: 'Biên tập viên',      account: 'dungNT' },
  { id: 17, name: 'Phan Minh Đức',      avatar: 'P', description: 'Phóng viên ẩm thực',              title: 'Phóng viên',         account: 'ducPM' },
  { id: 18, name: 'Trương Văn Hòa',     avatar: 'T', description: 'Cộng tác viên khoa học',          title: 'Cộng tác viên',      account: 'hoaTV' },
  { id: 19, name: 'Hà Thị Thu',         avatar: 'H', description: 'Biên tập viên giải trí',          title: 'Biên tập viên',      account: 'thuHT' },
  { id: 20, name: 'Đỗ Quang Trung',     avatar: 'Đ', description: 'Phóng viên kinh doanh',           title: 'Phóng viên',         account: 'trungDQ' },
  { id: 21, name: 'Nguyễn Bảo Long',    avatar: 'N', description: 'Chuyên gia tài chính',            title: 'Chuyên gia',         account: 'longNB' },
  { id: 22, name: 'Lê Thị Kim Anh',     avatar: 'L', description: 'Biên tập viên y tế',             title: 'Biên tập viên',      account: 'anhLTK' },
  { id: 23, name: 'Trần Đại Dương',     avatar: 'T', description: 'Phóng viên môi trường',           title: 'Phóng viên',         account: 'duongTD' },
  { id: 24, name: 'Võ Thành Nhân',      avatar: 'V', description: 'Cộng tác viên thể thao',         title: 'Cộng tác viên',      account: 'nhanVT' },
  { id: 25, name: 'Bùi Quang Vinh',     avatar: 'B', description: 'Biên tập viên công nghệ',         title: 'Biên tập viên',      account: 'vinhBQ' },
  { id: 26, name: 'Phùng Thị Nga',      avatar: 'P', description: 'Phóng viên văn hóa',              title: 'Phóng viên',         account: 'ngaPT' },
  { id: 27, name: 'Kiều Minh Hiếu',     avatar: 'K', description: 'Cộng tác viên quốc tế',          title: 'Cộng tác viên',      account: 'hieuKM' },
  { id: 28, name: 'Dương Văn Phát',     avatar: 'D', description: 'Phóng viên xe cộ',               title: 'Phóng viên',         account: 'phatDV' },
  { id: 29, name: 'Lưu Thị Hạnh',      avatar: 'L', description: 'Biên tập viên bất động sản',     title: 'Biên tập viên',      account: 'hanhLT' },
  { id: 30, name: 'Lương Công Tâm',     avatar: 'L', description: 'Trưởng nhóm phóng viên',         title: 'Trưởng nhóm',        account: 'tamLC' },
  { id: 31, name: 'Mạc Thị Tuyết',     avatar: 'M', description: 'Biên tập viên thời trang',        title: 'Biên tập viên',      account: 'tuyetMT' },
  { id: 32, name: 'Nguyễn Hoàng Anh',  avatar: 'N', description: 'Cộng tác viên phân tích',         title: 'Cộng tác viên',      account: 'anhNH' },
  { id: 33, name: 'Tô Thị Như Quỳnh',  avatar: 'T', description: 'Biên tập viên chuyên sâu',        title: 'Biên tập viên',      account: 'quynhTTN' },
]

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
  'bg-orange-500', 'bg-cyan-500',
]

const PER_PAGE = 20
const SYSTEM_ACCOUNTS = MOCK_AUTHORS.map(a => a.account)

export default function QuanLyTacGia() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [searchApplied, setSearchApplied] = useState('')
  const [page, setPage] = useState(1)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Author | null>(null)
  const [nameValue, setNameValue] = useState('')
  const [titleValue, setTitleValue] = useState('')
  const [descValue, setDescValue] = useState('')
  const [accountValue, setAccountValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthors(MOCK_AUTHORS)
      setLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  const filtered = authors.filter(a =>
    !searchApplied || a.name.toLowerCase().includes(searchApplied.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const openAddModal = () => {
    setEditTarget(null)
    setNameValue('')
    setTitleValue('')
    setDescValue('')
    setAccountValue('')
    setShowModal(true)
  }

  const openEditModal = (a: Author) => {
    setEditTarget(a)
    setNameValue(a.name)
    setTitleValue(a.title)
    setDescValue(a.description)
    setAccountValue(a.account)
    setShowModal(true)
    setOpenMenu(null)
  }

  const handleSave = () => {
    if (!nameValue.trim()) return
    if (editTarget) {
      setAuthors(prev => prev.map(a => a.id === editTarget.id
        ? { ...a, name: nameValue, title: titleValue, description: descValue, account: accountValue }
        : a
      ))
    } else {
      setAuthors(prev => [...prev, {
        id: Date.now(),
        name: nameValue,
        avatar: nameValue[0]?.toUpperCase() ?? 'N',
        description: descValue,
        title: titleValue,
        account: accountValue,
      }])
    }
    setShowModal(false)
  }

  const handleDelete = (id: number) => {
    setAuthors(prev => prev.filter(a => a.id !== id))
    setOpenMenu(null)
  }

  return (
    <div className="p-6" onClick={() => openMenu && setOpenMenu(null)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#17a2b8] text-white text-sm font-medium rounded-md hover:bg-[#138496] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Thêm tác giả mới
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-5">
        <input
          type="text" placeholder="Từ khóa" value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setSearchApplied(keyword)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] w-48"
        />
        <button
          onClick={() => { setSearchApplied(keyword); setPage(1) }}
          className="px-4 py-2 bg-[#17a2b8] text-white text-sm rounded-md hover:bg-[#138496] transition-colors"
        >
          Tìm kiếm
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-[#17a2b8]">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm font-medium">Đang tải thông tin user...</span>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-14">Avatar</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tên tác giả</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Mô tả</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-20">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((a, idx) => {
                  const globalIdx = (page - 1) * PER_PAGE + idx
                  return (
                    <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className={`w-9 h-9 rounded-full ${AVATAR_COLORS[globalIdx % AVATAR_COLORS.length]} flex items-center justify-center`}>
                          <span className="text-white font-bold text-sm">{a.avatar}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{a.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{a.title} · @{a.account}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">{a.description}</td>
                      <td className="px-4 py-3 relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setOpenMenu(openMenu === a.id ? null : a.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 font-bold text-lg">
                          ···
                        </button>
                        {openMenu === a.id && (
                          <div className="absolute right-3 top-11 z-20 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[140px] py-1">
                            <button onClick={() => openEditModal(a)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              Sửa
                            </button>
                            <button onClick={() => handleDelete(a.id)} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              Xóa
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
              <span className="text-sm text-gray-500">
                Tổng <strong>{filtered.length}</strong> tác giả &bull; Trang <strong>{page}</strong>/<strong>{totalPages}</strong>
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm disabled:opacity-40 hover:bg-gray-100">←</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`px-3 py-1.5 border rounded-md text-sm ${page === p ? 'bg-[#17a2b8] text-white border-[#17a2b8]' : 'border-gray-300 hover:bg-gray-100'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm disabled:opacity-40 hover:bg-gray-100">→</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-12 px-4 pb-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-800 text-base">{editTarget ? 'Sửa tác giả' : 'Thêm tác giả mới'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#17a2b8] cursor-pointer transition-colors">
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="text-xs text-gray-400">Kéo thả hoặc click để tải ảnh</p>
                </div>
              </div>
              {/* Name - required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên tác giả <span className="text-red-500">*</span>
                </label>
                <input type="text" value={nameValue} onChange={e => setNameValue(e.target.value)}
                  placeholder="Nhập tên tác giả..."
                  className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 ${!nameValue.trim() ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : 'border-gray-300 focus:border-[#17a2b8] focus:ring-[#17a2b8]'}`}
                />
                {!nameValue.trim() && <p className="text-xs text-red-400 mt-1">Trường này bắt buộc phải nhập</p>}
              </div>
              {/* Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account hệ thống</label>
                <select value={accountValue} onChange={e => setAccountValue(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]">
                  <option value="">-- Chọn tài khoản --</option>
                  {SYSTEM_ACCOUNTS.map(acc => <option key={acc} value={acc}>@{acc}</option>)}
                </select>
              </div>
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chức danh</label>
                <input type="text" value={titleValue} onChange={e => setTitleValue(e.target.value)}
                  placeholder="VD: Phóng viên, Biên tập viên..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea value={descValue} onChange={e => setDescValue(e.target.value)} rows={3}
                  placeholder="Mô tả ngắn về tác giả..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded-md hover:bg-gray-100 tracking-wide">ĐÓNG</button>
              <button onClick={handleSave} disabled={!nameValue.trim()} className="px-5 py-2 text-sm font-semibold bg-[#17a2b8] text-white rounded-md hover:bg-[#138496] disabled:opacity-50 tracking-wide">LƯU</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
