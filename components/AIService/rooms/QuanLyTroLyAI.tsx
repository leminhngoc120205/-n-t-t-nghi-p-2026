'use client'

import React, { useState } from 'react'

const ASSISTANTS_DATA = [
  { id: 1,  name: 'Trợ lý viết tin thời sự',         users: 12, active: true  },
  { id: 2,  name: 'Trợ lý làm video tự động',         users: 8,  active: true  },
  { id: 3,  name: 'Trợ lý phân tích dữ liệu',         users: 5,  active: false },
  { id: 4,  name: 'Trợ lý tổng hợp báo cáo',          users: 15, active: true  },
  { id: 5,  name: 'Trợ lý dịch thuật đa ngôn ngữ',    users: 3,  active: true  },
  { id: 6,  name: 'Trợ lý viết bài SEO',              users: 20, active: true  },
  { id: 7,  name: 'Trợ lý tóm tắt văn bản',           users: 9,  active: false },
  { id: 8,  name: 'Trợ lý kiểm tra chính tả',         users: 6,  active: true  },
  { id: 9,  name: 'Trợ lý tạo caption mạng xã hội',   users: 11, active: true  },
  { id: 10, name: 'Trợ lý viết tin thể thao',         users: 7,  active: true  },
  { id: 11, name: 'Trợ lý phân tích xu hướng',        users: 4,  active: false },
  { id: 12, name: 'Trợ lý viết tin kinh tế',          users: 13, active: true  },
  { id: 13, name: 'Trợ lý tạo newsletter',            users: 2,  active: true  },
  { id: 14, name: 'Trợ lý đăng bài tự động',          users: 18, active: true  },
  { id: 15, name: 'Trợ lý nghiên cứu thị trường',     users: 5,  active: false },
  { id: 16, name: 'Trợ lý viết kịch bản podcast',     users: 8,  active: true  },
  { id: 17, name: 'Trợ lý tạo infographic',           users: 3,  active: true  },
  { id: 18, name: 'Trợ lý viết email marketing',      users: 10, active: false },
  { id: 19, name: 'Trợ lý tổng hợp tin tức quốc tế',  users: 7,  active: true  },
  { id: 20, name: 'Trợ lý phân tích cảm xúc',         users: 6,  active: true  },
  { id: 21, name: 'Trợ lý viết bài blog',             users: 14, active: true  },
  { id: 22, name: 'Trợ lý tạo poll và survey',        users: 2,  active: false },
  { id: 23, name: 'Trợ lý viết tin giải trí',         users: 9,  active: true  },
  { id: 24, name: 'Trợ lý lập kế hoạch nội dung',     users: 5,  active: true  },
  { id: 25, name: 'Trợ lý viết thông cáo báo chí',    users: 3,  active: false },
  { id: 26, name: 'Trợ lý tạo thumbnail',             users: 7,  active: true  },
  { id: 27, name: 'Trợ lý tối ưu tiêu đề bài viết',   users: 11, active: true  },
  { id: 28, name: 'Trợ lý viết review sản phẩm',      users: 4,  active: true  },
  { id: 29, name: 'Trợ lý dự báo nội dung viral',     users: 8,  active: false },
]

const MOCK_MEMBERS = ['Nguyễn Văn An', 'Trần Thị Bích', 'Lê Minh Châu', 'Phạm Đức Dũng']

const PER_PAGE = 20

export default function QuanLyTroLyAI() {
  const [assistants, setAssistants] = useState(ASSISTANTS_DATA)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [editTarget, setEditTarget] = useState<typeof ASSISTANTS_DATA[0] | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<typeof ASSISTANTS_DATA[0] | null>(null)

  const filtered = assistants.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' ? a.active : !a.active)
    return matchSearch && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const toggleActive = (id: number) => {
    setAssistants(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }

  const handleDelete = () => {
    if (deleteTarget) {
      setAssistants(prev => prev.filter(a => a.id !== deleteTarget.id))
      setDeleteTarget(null)
    }
  }

  return (
    <div className="p-6" onClick={() => openMenu && setOpenMenu(null)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="border border-gray-300 rounded-md pl-8 pr-3 py-2 text-sm w-56 focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"
            />
            <svg className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#17a2b8] text-white text-sm font-medium rounded-md hover:bg-[#138496] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm mới
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-12">STT</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-16">Ảnh</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tên trợ lý</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-40">Số người sử dụng</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-36">Đang hoạt động</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((a, idx) => (
              <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-500 text-sm">{(page - 1) * PER_PAGE + idx + 1}</td>
                <td className="px-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#17c3d8] to-[#17a2b8] flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-sm">{a.name[3] ?? 'A'}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{a.name}</td>
                <td className="px-4 py-3 text-gray-600">{a.users} người</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(a.id)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${a.active ? 'bg-[#17a2b8]' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${a.active ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
                  </button>
                </td>
                <td className="px-4 py-3 relative" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setOpenMenu(openMenu === a.id ? null : a.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 font-bold text-lg tracking-widest"
                  >
                    ···
                  </button>
                  {openMenu === a.id && (
                    <div className="absolute right-3 top-11 z-20 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[180px] py-1">
                      <button onClick={() => { setEditTarget(a); setOpenMenu(null) }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Sửa
                      </button>
                      <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        Phân quyền sử dụng
                      </button>
                      <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                        Kho dữ liệu
                      </button>
                      <div className="border-t border-gray-100 my-1" />
                      <button onClick={() => { setDeleteTarget(a); setOpenMenu(null) }} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Xoá
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-500">
            Tổng <strong>{filtered.length}</strong> trợ lý &bull; Trang <strong>{page}</strong>/<strong>{totalPages}</strong>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1.5 border rounded-md text-sm transition-colors ${
                  page === p
                    ? 'bg-[#17a2b8] text-white border-[#17a2b8]'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditTarget(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-[500px] max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-800 text-base">Sửa AI trợ lý tin từ tài liệu</h2>
              <button onClick={() => setEditTarget(null)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full text-xl">×</button>
            </div>
            <div className="p-6 space-y-5">
              {/* Avatar upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện <span className="text-gray-400 font-normal">(tỷ lệ 1:1)</span></label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#17a2b8] cursor-pointer transition-colors group">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-[#e8f7f9]">
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-[#17a2b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">Kéo thả hoặc <span className="text-[#17a2b8] font-medium">click để tải ảnh</span></p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG · Khuyến nghị 200×200px</p>
                </div>
              </div>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên trợ lý</label>
                <input
                  type="text"
                  defaultValue={editTarget.name}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"
                />
              </div>
              {/* Members */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thành viên sử dụng</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Thêm tài khoản..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"
                  />
                  <button className="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-md hover:bg-gray-200 whitespace-nowrap transition-colors">
                    Theo phòng ban
                  </button>
                </div>
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  {MOCK_MEMBERS.map((name, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#17c3d8] to-[#138496] flex items-center justify-center text-xs font-bold text-white">
                          {name[0]}
                        </div>
                        <span className="text-sm text-gray-700">{name}</span>
                      </div>
                      <button className="text-gray-300 hover:text-red-400 transition-colors p-1 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setEditTarget(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">Đóng</button>
              <button onClick={() => setEditTarget(null)} className="px-4 py-2 text-sm bg-[#17a2b8] text-white rounded-md hover:bg-[#138496] transition-colors font-medium">Hoàn thành</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-[400px] p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Xác nhận xoá</h3>
                <p className="text-sm text-gray-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">Bạn có chắc chắn muốn xoá trợ lý <strong className="text-gray-800">"{deleteTarget.name}"</strong>?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Huỷ</button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 font-medium">Xoá</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
