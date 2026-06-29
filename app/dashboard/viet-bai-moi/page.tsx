'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

/* ─── Types ─── */
type Device = 'desktop' | 'tablet' | 'mobile'

interface ApiCategory { _id: string; name: string; slug: string; parentId?: string | null }
interface Toast { msg: string; type: 'ok' | 'err' }

const articleTypeLabels: Record<string, string> = {
  'size-s': 'SIZE S', 'size-m': 'SIZE M', 'size-l': 'SIZE L',
  'magazine': 'Magazine', 'big-story': 'Big Story', 'auto-video': 'Video Tự Chạy',
  'livestream': 'Bài Livestream', 'wiki-how': 'Wiki-How', 'cooking': 'Nấu Ăn', 'qa': 'Giải Đáp Kiến Thức',
}

const urlTypeToModel: Record<string, string> = {
  'size-s': 'size_s', 'size-m': 'size_m', 'size-l': 'size_l',
  'big-story': 'big_story', 'auto-video': 'video_autoplay',
  'wiki-how': 'wiki_how', 'magazine': 'magazine', 'livestream': 'livestream',
  'cooking': 'cooking', 'qa': 'qa',
}

// Mirrors TYPE_RULES from lib/news.service.ts — used for client-side checklist display
const CLIENT_TYPE_RULES: Record<string, {
  minWords: number; requireThumbnail: boolean; requireSapo: boolean; requireCategory: boolean
  requireVideoUrl?: boolean; requireStreamUrl?: boolean; requireSteps?: boolean; requireQaItems?: boolean
}> = {
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

const categorySubs: Record<string, string[]> = {
  'thoi-su':  ['Đô thị', 'Đời sống', 'Giáo dục', 'Thời tiết'],
  'kinh-te':  ['Kinh doanh', 'Tiêu dùng', 'Tài chính'],
  'xa-hoi':   ['Trong nước', 'Quốc tế', 'Giao thông'],
  'cong-nghe':['Điện thoại', 'Máy tính', 'Internet'],
  'the-thao': ['Bóng đá', 'Tennis', 'Thể thao khác'],
  'giai-tri': ['Phim ảnh', 'Âm nhạc', 'Nghệ sĩ'],
  'suc-khoe': ['Dinh dưỡng', 'Bệnh lý', 'Làm đẹp'],
}

const countWords = (text: string) => text.trim() === '' ? 0 : text.trim().split(/\s+/).length

/* ═══════════════════════════════════════════════════════ */
export default function VietBaiMoiPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">Đang tải...</div>}>
      <VietBaiMoiContent />
    </Suspense>
  )
}

/* ═══════════════════════════════════════════════════════ */
function VietBaiMoiContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const articleType = searchParams.get('type') || 'size-m'
  const editId      = searchParams.get('id')            // null = viết mới, có giá trị = đang sửa

  const [device,          setDevice]          = useState<Device>('desktop')
  const [title,           setTitle]           = useState('')
  const [sapo,            setSapo]            = useState('')
  const [content,         setContent]         = useState('')
  const [expandedCats,    setExpandedCats]    = useState<string[]>(['thoi-su'])
  const [selectedCatSlug, setSelectedCatSlug] = useState<string | null>(null)
  const [apiCategories,   setApiCategories]   = useState<ApiCategory[]>([])
  const [thumbnail,       setThumbnail]       = useState('')
  const [publishDate,     setPublishDate]     = useState('')
  const [sourceUrl,       setSourceUrl]       = useState('')
  const [uploadingImg,    setUploadingImg]    = useState(false)
  const [saving,          setSaving]          = useState(false)
  const [loadingEdit,     setLoadingEdit]     = useState(!!editId)
  const [toast,           setToast]           = useState<Toast | null>(null)
  const [showPreviewAlert, setShowPreviewAlert] = useState(false)
  // Extra per-type fields
  const [videoUrl,        setVideoUrl]        = useState('')
  const [streamUrl,       setStreamUrl]       = useState('')
  const [scheduledAt,     setScheduledAt]     = useState('')
  const [steps,           setSteps]           = useState<{title:string;content:string;image:string}[]>([])
  const [qaItems,         setQaItems]         = useState<{question:string;answer:string}[]>([])
  const [ingredients,     setIngredients]     = useState('')
  const [cookingTime,     setCookingTime]     = useState('')
  const [servings,        setServings]        = useState('')

  // Fetch danh sách chuyên mục từ API
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => { if (d.ok) setApiCategories(d.data) })
      .catch(() => {})
  }, [])

  // Nếu có ?id= trên URL → đây là chế độ SỬA BÀI → tải dữ liệu bài cũ về điền vào editor
  useEffect(() => {
    if (!editId) return
    setLoadingEdit(true)
    fetch(`/api/articles/${editId}`)
      .then(r => r.json())
      .then(d => {
        if (!d.ok) return
        const a = d.data
        setTitle(a.title ?? '')
        setSapo(a.sapo ?? '')
        setContent(a.content ?? '')
        // categoryId đã được populate → có trường slug để map sang selectedCatSlug
        if (a.categoryId?.slug) setSelectedCatSlug(a.categoryId.slug)
        if (a.thumbnail)        setThumbnail(a.thumbnail)
        if (a.publishedAt)      setPublishDate(new Date(a.publishedAt).toISOString().slice(0, 16))
        if (a.sourceUrl)        setSourceUrl(a.sourceUrl)
        if (a.videoUrl)         setVideoUrl(a.videoUrl)
        if (a.streamUrl)        setStreamUrl(a.streamUrl)
        if (a.scheduledAt)      setScheduledAt(new Date(a.scheduledAt).toISOString().slice(0, 16))
        if (a.steps?.length)    setSteps(a.steps.map((s: {stepTitle:string;stepContent:string;stepImage:string}) => ({ title: s.stepTitle, content: s.stepContent, image: s.stepImage })))
        if (a.qaItems?.length)  setQaItems(a.qaItems)
        if (a.ingredients)      setIngredients(a.ingredients)
        if (a.cookingTime)      setCookingTime(a.cookingTime)
        if (a.servings)         setServings(a.servings)
      })
      .catch(() => {})
      .finally(() => setLoadingEdit(false))
  }, [editId])

  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleImageUpload = async (file: File) => {
    setUploadingImg(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res  = await fetch('/api/media/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!data.ok) { showToast(data.error || 'Lỗi khi tải ảnh lên', 'err'); return }
      setThumbnail(data.data.url)
      showToast('Đã tải ảnh lên thành công!', 'ok')
    } catch {
      showToast('Lỗi kết nối khi tải ảnh', 'err')
    } finally {
      setUploadingImg(false)
    }
  }

  const toggleCatExpand = (slug: string) =>
    setExpandedCats((prev) => prev.includes(slug) ? prev.filter(x => x !== slug) : [...prev, slug])

  const handlePreview = () => {
    if (!title.trim()) { setShowPreviewAlert(true); return }
    alert('Đang xem trước bài viết: ' + title)
  }

  const saveDraft = async (): Promise<string | null> => {
    if (!title.trim()) {
      showToast('Tiêu đề không được để trống', 'err')
      return null
    }
    setSaving(true)
    const catId = apiCategories.find(c => c.slug === selectedCatSlug)?._id ?? null
    const body  = JSON.stringify({
      title, sapo, content, thumbnail,
      articleType: urlTypeToModel[articleType] ?? 'size_m',
      categoryId: catId,
      source: '',
      sourceUrl: sourceUrl || undefined,
      publishedAt: publishDate || undefined,
      videoUrl:    videoUrl    || undefined,
      streamUrl:   streamUrl   || undefined,
      scheduledAt: scheduledAt || undefined,
      steps:       steps.length > 0 ? steps.map(s => ({ stepTitle: s.title, stepContent: s.content, stepImage: s.image })) : undefined,
      qaItems:     qaItems.length > 0 ? qaItems : undefined,
      ingredients: ingredients || undefined,
      cookingTime: cookingTime || undefined,
      servings:    servings    || undefined,
    })
    try {
      let res: Response
      if (editId) {
        // ── CHẾ ĐỘ SỬA: gọi PATCH để cập nhật bài đã có ──
        res = await fetch(`/api/articles/${editId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body,
        })
      } else {
        // ── CHẾ ĐỘ VIẾT MỚI: gọi POST để tạo bài mới ──
        res = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        })
      }
      const data = await res.json()
      if (!data.ok) { showToast(data.error || 'Lỗi khi lưu bài', 'err'); return null }
      // PATCH trả về data.data (bài vừa cập nhật), POST cũng trả về data.data
      return editId ?? String(data.data._id)
    } catch {
      showToast('Lỗi kết nối máy chủ', 'err')
      return null
    } finally {
      setSaving(false)
    }
  }

  const handleSaveDraft = async () => {
    const id = await saveDraft()
    if (id) {
      showToast(editId ? 'Đã cập nhật bài viết!' : 'Đã lưu nháp thành công!', 'ok')
      setTimeout(() => router.push('/dashboard/bai-viet'), 1200)
    }
  }

  const handleSubmitReview = async () => {
    const id = await saveDraft()
    if (!id) return
    setSaving(true)
    try {
      const res = await fetch(`/api/articles/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: 'processing' }),
      })
      const data = await res.json()
      if (!data.ok) { showToast(data.error || 'Lỗi khi gửi duyệt', 'err'); return }
      showToast('Đã gửi bài để biên tập duyệt!', 'ok')
      setTimeout(() => router.push('/dashboard/bai-viet'), 1200)
    } catch {
      showToast('Lỗi kết nối máy chủ', 'err')
    } finally {
      setSaving(false)
    }
  }

  const titleWords = countWords(title)
  const sapoWords = countWords(sapo)

  // Khi đang tải bài cũ → hiện màn chờ, không render editor rỗng
  if (loadingEdit) {
    return (
      <div className="flex flex-col h-screen bg-gray-100 items-center justify-center gap-4">
        <div className="w-8 h-8 border-4 border-[#17a2b8] border-t-transparent rounded-full animate-spin"/>
        <p className="text-sm text-gray-500">Đang tải bài viết...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* TOP BAR */}
      <EditorTopBar
        articleType={articleTypeLabels[articleType] || 'SIZE M'}
        isEditing={!!editId}
        device={device}
        saving={saving}
        onDeviceChange={setDevice}
        onPreview={handlePreview}
        onSaveDraft={handleSaveDraft}
        onSubmitReview={handleSubmitReview}
      />

      {/* MAIN AREA */}
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          apiCategories={apiCategories}
          expandedCats={expandedCats}
          selectedCatSlug={selectedCatSlug}
          onToggleExpand={toggleCatExpand}
          onSelectCat={setSelectedCatSlug}
        />

        <CenterEditor
          device={device}
          title={title}
          sapo={sapo}
          content={content}
          titleWords={titleWords}
          sapoWords={sapoWords}
          onTitleChange={setTitle}
          onSapoChange={setSapo}
          onContentChange={setContent}
        />

        <InfoPanel
          articleType={urlTypeToModel[articleType] ?? 'size_m'}
          content={content}
          sapo={sapo}
          selectedCatSlug={selectedCatSlug}
          thumbnail={thumbnail}
          uploadingImg={uploadingImg}
          onImageUpload={handleImageUpload}
          onClearThumbnail={() => setThumbnail('')}
          publishDate={publishDate}
          onPublishDateChange={setPublishDate}
          sourceUrl={sourceUrl}
          onSourceUrlChange={setSourceUrl}
          videoUrl={videoUrl}         onVideoUrlChange={setVideoUrl}
          streamUrl={streamUrl}       onStreamUrlChange={setStreamUrl}
          scheduledAt={scheduledAt}   onScheduledAtChange={setScheduledAt}
          steps={steps}               onStepsChange={setSteps}
          qaItems={qaItems}           onQaItemsChange={setQaItems}
          ingredients={ingredients}   onIngredientsChange={setIngredients}
          cookingTime={cookingTime}   onCookingTimeChange={setCookingTime}
          servings={servings}         onServingsChange={setServings}
        />
      </div>

      {/* Preview alert */}
      {showPreviewAlert && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Không thể xem trước</h3>
                <p className="text-sm text-gray-500">Tiêu đề không được để trống</p>
              </div>
            </div>
            <button
              onClick={() => setShowPreviewAlert(false)}
              className="w-full py-2 bg-[#17a2b8] text-white rounded-lg font-medium hover:bg-[#138496] transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium transition-all ${
          toast.type === 'ok' ? 'bg-emerald-500' : 'bg-red-500'
        }`}>
          {toast.type === 'ok'
            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          }
          {toast.msg}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════ */
/*  EDITOR TOP BAR                                        */
/* ═══════════════════════════════════════════════════════ */
function EditorTopBar({
  articleType, isEditing, device, saving, onDeviceChange, onPreview, onSaveDraft, onSubmitReview,
}: {
  articleType: string
  isEditing: boolean
  device: Device
  saving: boolean
  onDeviceChange: (d: Device) => void
  onPreview: () => void
  onSaveDraft: () => void
  onSubmitReview: () => void
}) {
  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shadow-sm flex-shrink-0 z-30">
      {/* Back + Logo */}
      <Link href="/dashboard/bai-viet" className="flex items-center gap-2 mr-4 hover:opacity-80 transition-opacity">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <TopbarLogoSmall />
      </Link>

      {/* Badge: SỬA BÀI hoặc loại bài */}
      {isEditing ? (
        <span className="text-xs font-bold text-amber-600 border border-amber-400 bg-amber-50 rounded px-2 py-0.5">
          SỬA BÀI
        </span>
      ) : (
        <span className="text-xs font-bold text-[#17a2b8] border border-[#17a2b8] rounded px-2 py-0.5">
          {articleType}
        </span>
      )}


      <div className="flex-1" />

      {/* Device selector */}
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
        {(['desktop', 'tablet', 'mobile'] as Device[]).map((d) => (
          <button
            key={d}
            onClick={() => onDeviceChange(d)}
            title={d}
            className={`w-9 h-8 flex items-center justify-center transition-colors ${
              device === d ? 'bg-[#17a2b8] text-white' : 'bg-white text-gray-400 hover:bg-gray-50'
            }`}
          >
            {d === 'desktop' ? <DesktopIcon /> : d === 'tablet' ? <TabletIcon /> : <MobileIcon />}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <button
        onClick={onSaveDraft}
        disabled={saving}
        className="px-4 h-8 text-xs font-semibold border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? 'Đang lưu...' : 'Lưu nháp'}
      </button>
      <button
        onClick={onPreview}
        disabled={saving}
        className="px-4 h-8 text-xs font-semibold bg-[#17a2b8] text-white rounded-lg hover:bg-[#138496] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        XEM TRƯỚC
      </button>
      <button
        onClick={onSubmitReview}
        disabled={saving}
        className="px-4 h-8 text-xs font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
      >
        {saving && (
          <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        GỬI DUYỆT
      </button>
    </header>
  )
}

/* ═══════════════════════════════════════════════════════ */
/*  LEFT PANEL — CATEGORIES                               */
/* ═══════════════════════════════════════════════════════ */
function LeftPanel({
  apiCategories, expandedCats, selectedCatSlug, onToggleExpand, onSelectCat,
}: {
  apiCategories: ApiCategory[]
  expandedCats: string[]
  selectedCatSlug: string | null
  onToggleExpand: (slug: string) => void
  onSelectCat: (slug: string | null) => void
}) {
  const fallback: ApiCategory[] = [
    { _id: '1', slug: 'thoi-su',   name: 'Thời Sự',   parentId: null },
    { _id: '2', slug: 'kinh-te',   name: 'Kinh Tế',   parentId: null },
    { _id: '3', slug: 'xa-hoi',    name: 'Xã Hội',    parentId: null },
    { _id: '4', slug: 'cong-nghe', name: 'Công Nghệ', parentId: null },
    { _id: '5', slug: 'the-thao',  name: 'Thể Thao',  parentId: null },
    { _id: '6', slug: 'giai-tri',  name: 'Giải Trí',  parentId: null },
    { _id: '7', slug: 'suc-khoe',  name: 'Sức Khỏe',  parentId: null },
  ]

  const allCats  = apiCategories.length > 0 ? apiCategories : fallback
  const parents  = allCats.filter(c => !c.parentId)
  const children = (parentId: string) => allCats.filter(c => c.parentId === parentId)
  const allNames = Object.fromEntries(allCats.map(c => [c.slug, c.name]))

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2.5 border-b border-gray-100 bg-gray-50">
          <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
            Chuyên Mục Chính
          </span>
        </div>
        <div className="py-1">
          {parents.map((cat) => {
            const isExpanded = expandedCats.includes(cat.slug)
            const isSelected = selectedCatSlug === cat.slug
            const subs = children(cat._id)
            const subSelected = subs.some(s => s.slug === selectedCatSlug)
            return (
              <div key={cat.slug}>
                <div className={`flex items-center px-3 py-2 transition-colors group ${
                  isSelected ? 'bg-[#17a2b8]/10' : subSelected ? 'bg-[#17a2b8]/5' : 'hover:bg-gray-50'
                }`}>
                  {/* Expand arrow — only show if has children */}
                  <button
                    onClick={() => onToggleExpand(cat.slug)}
                    className="mr-1.5 flex-shrink-0 w-4"
                  >
                    {subs.length > 0 && (
                      <svg
                        className={`w-3 h-3 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>

                  {/* Parent category name */}
                  <button
                    onClick={() => onSelectCat(isSelected ? null : cat.slug)}
                    className={`flex-1 text-left text-xs font-semibold transition-colors ${
                      isSelected ? 'text-[#17a2b8]' : 'text-gray-700 group-hover:text-gray-900'
                    }`}
                  >
                    {cat.name}
                  </button>

                  {isSelected && (
                    <svg className="w-3 h-3 text-[#17a2b8] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>

                {isExpanded && subs.length > 0 && (
                  <div className="ml-5 border-l border-gray-100">
                    {subs.map((sub) => {
                      const isSubSelected = selectedCatSlug === sub.slug
                      return (
                        <button
                          key={sub.slug}
                          onClick={() => onSelectCat(isSubSelected ? null : sub.slug)}
                          className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                            isSubSelected
                              ? 'text-[#17a2b8] bg-[#17a2b8]/10 font-medium'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {sub.name}
                          {isSubSelected && (
                            <svg className="w-3 h-3 text-[#17a2b8] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {selectedCatSlug && (
          <div className="px-3 pb-3">
            <div className="text-[10px] text-[#17a2b8] bg-[#17a2b8]/10 rounded-lg px-2 py-1.5 text-center font-medium">
              Đã chọn: {allNames[selectedCatSlug] ?? selectedCatSlug}
            </div>
          </div>
        )}
      </div>

      {/* Related articles section */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="px-3 py-2.5 border-b border-gray-100">
          <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
            Chọn Tin Liên Quan
          </span>
        </div>
        <div className="p-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-[#17a2b8] bg-white"
            />
            <svg className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">Chưa có tin liên quan nào</p>
        </div>
      </div>
    </aside>
  )
}

/* ═══════════════════════════════════════════════════════ */
/*  CENTER EDITOR                                         */
/* ═══════════════════════════════════════════════════════ */
function CenterEditor({ device, title, sapo, content, titleWords, sapoWords, onTitleChange, onSapoChange, onContentChange }: {
  device: Device
  title: string; sapo: string; content: string
  titleWords: number; sapoWords: number
  onTitleChange: (v: string) => void
  onSapoChange: (v: string) => void
  onContentChange: (v: string) => void
}) {
  const widthClass        = device === 'desktop' ? 'max-w-3xl' : device === 'tablet' ? 'max-w-xl' : 'max-w-sm'
  const imgInputRef       = useRef<HTMLInputElement>(null)
  const videoInputRef     = useRef<HTMLInputElement>(null)
  const contentDivRef     = useRef<HTMLDivElement>(null)
  const lastSyncedContent = useRef('')
  const [uploadingInline, setUploadingInline] = useState(false)
  const [uploadingVideo,  setUploadingVideo]  = useState(false)

  // Sync nội dung từ ngoài vào div (vd: tải bài sửa)
  useEffect(() => {
    const div = contentDivRef.current
    if (!div) return
    if (content !== lastSyncedContent.current) {
      div.innerHTML = content
      lastSyncedContent.current = content
    }
  }, [content])

  const insertImageAtCursor = (url: string) => {
    const div = contentDivRef.current
    if (!div) return
    div.focus()
    const img = document.createElement('img')
    img.src = url
    img.alt = 'Ảnh'
    img.style.cssText = 'max-width:100%;height:auto;border-radius:6px;margin:10px 0;display:block;'
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0)
      range.deleteContents()
      range.insertNode(img)
      const after = document.createRange()
      after.setStartAfter(img)
      after.collapse(true)
      sel.removeAllRanges()
      sel.addRange(after)
    } else {
      div.appendChild(img)
    }
    const newHtml = div.innerHTML
    lastSyncedContent.current = newHtml
    onContentChange(newHtml)
  }

  const handleInlineImageUpload = async (file: File) => {
    setUploadingInline(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res  = await fetch('/api/media/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!data.ok) { alert(data.error || 'Lỗi khi tải ảnh lên'); return }
      insertImageAtCursor(data.data.url)
    } catch {
      alert('Lỗi kết nối khi tải ảnh')
    } finally {
      setUploadingInline(false)
    }
  }

  const insertVideoAtCursor = (url: string) => {
    const div = contentDivRef.current
    if (!div) return
    div.focus()
    const video = document.createElement('video')
    video.src = url
    video.controls = true
    video.style.cssText = 'max-width:100%;border-radius:6px;margin:10px 0;display:block;'
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0)
      range.deleteContents()
      range.insertNode(video)
      const after = document.createRange()
      after.setStartAfter(video)
      after.collapse(true)
      sel.removeAllRanges()
      sel.addRange(after)
    } else {
      div.appendChild(video)
    }
    const newHtml = div.innerHTML
    lastSyncedContent.current = newHtml
    onContentChange(newHtml)
  }

  const handleVideoUpload = async (file: File) => {
    setUploadingVideo(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res  = await fetch('/api/media/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!data.ok) { alert(data.error || 'Lỗi khi tải video lên'); return }
      insertVideoAtCursor(data.data.url)
    } catch {
      alert('Lỗi kết nối khi tải video')
    } finally {
      setUploadingVideo(false)
    }
  }

  const isEmpty = !content || content.replace(/<[^>]*>/g, '').trim() === ''

  return (
    <main className="flex-1 overflow-y-auto bg-gray-100 py-6 px-4">
      <div className={`mx-auto bg-white shadow-sm rounded-lg overflow-hidden ${widthClass} w-full`}>
        {/* Title */}
        <div className="border-b border-gray-100 px-8 py-5">
          <div className="flex items-start justify-between gap-2">
            <textarea
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Tiêu đề bài viết..."
              className="flex-1 text-2xl font-bold text-gray-800 placeholder-gray-300 border-none outline-none resize-none leading-tight"
              rows={2}
            />
            <span className={`text-xs font-mono flex-shrink-0 mt-1.5 ${titleWords > 25 ? 'text-red-500' : 'text-gray-400'}`}>
              {titleWords}/25
            </span>
          </div>
        </div>

        {/* Sapo */}
        <div className="border-b border-gray-100 px-8 py-4">
          <div className="flex items-start justify-between gap-2">
            <textarea
              value={sapo}
              onChange={(e) => onSapoChange(e.target.value)}
              placeholder="Mô tả (sapo)..."
              className="flex-1 text-base text-gray-600 placeholder-gray-300 border-none outline-none resize-none leading-relaxed italic"
              rows={3}
            />
            <span className={`text-xs font-mono flex-shrink-0 mt-1 ${sapoWords > 70 ? 'text-red-500' : 'text-gray-400'}`}>
              {sapoWords}/70
            </span>
          </div>
        </div>

        {/* Content + Insert Toolbar */}
        <div className="px-8 py-4 min-h-[60vh]">
          {/* Hidden file inputs */}
          <input
            ref={imgInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleInlineImageUpload(file)
              e.target.value = ''
            }}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleVideoUpload(file)
              e.target.value = ''
            }}
          />

          {/* ContentEditable */}
          <div className="relative min-h-[50vh]">
            {isEmpty && (
              <div className="absolute top-0 left-0 pointer-events-none select-none">
                <p className="text-base text-gray-300">Hãy viết gì đó...</p>
                {/* Gợi ý thêm media — chỉ hiện khi trống */}
                <div className="flex items-center gap-2 mt-4 pointer-events-auto">
                  <button
                    onClick={() => imgInputRef.current?.click()}
                    disabled={uploadingInline}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 rounded-full border border-dashed border-gray-300 hover:border-[#17a2b8] hover:text-[#17a2b8] transition-all disabled:opacity-50"
                  >
                    {uploadingInline
                      ? <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      : <ImgIcon />
                    }
                    {uploadingInline ? 'Đang tải...' : 'Thêm ảnh'}
                  </button>
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    disabled={uploadingVideo}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 rounded-full border border-dashed border-gray-300 hover:border-[#17a2b8] hover:text-[#17a2b8] transition-all disabled:opacity-50"
                  >
                    {uploadingVideo
                      ? <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      : <VideoIcon />
                    }
                    {uploadingVideo ? 'Đang tải...' : 'Thêm video'}
                  </button>
                </div>
              </div>
            )}
            {/* Nút nhỏ góc trên phải — luôn hiện khi đã có nội dung */}
            {!isEmpty && (
              <div className="absolute top-0 right-0 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => imgInputRef.current?.click()}
                  disabled={uploadingInline}
                  title="Chèn ảnh"
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-[#17a2b8] hover:text-[#17a2b8] bg-white shadow-sm transition-all disabled:opacity-50"
                >
                  {uploadingInline ? <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : <ImgIcon />}
                </button>
                <button
                  onClick={() => videoInputRef.current?.click()}
                  disabled={uploadingVideo}
                  title="Chèn video"
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-[#17a2b8] hover:text-[#17a2b8] bg-white shadow-sm transition-all disabled:opacity-50"
                >
                  {uploadingVideo ? <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : <VideoIcon />}
                </button>
              </div>
            )}
            <div
              ref={contentDivRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const html = e.currentTarget.innerHTML
                lastSyncedContent.current = html
                onContentChange(html)
              }}
              className="w-full text-base text-gray-700 outline-none leading-relaxed min-h-[50vh] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </main>
  )
}

/* ═══════════════════════════════════════════════════════ */
/*  RIGHT PANEL ICONS                                     */
/* ═══════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════ */
/*  INFO PANEL — luôn hiển thị bên phải                   */
/* ═══════════════════════════════════════════════════════ */
function InfoPanel({
  articleType, content, sapo, selectedCatSlug,
  thumbnail, uploadingImg, onImageUpload, onClearThumbnail,
  publishDate, onPublishDateChange, sourceUrl, onSourceUrlChange,
  videoUrl, onVideoUrlChange, streamUrl, onStreamUrlChange,
  scheduledAt, onScheduledAtChange,
  steps, onStepsChange, qaItems, onQaItemsChange,
  ingredients, onIngredientsChange, cookingTime, onCookingTimeChange, servings, onServingsChange,
}: {
  articleType: string
  content: string; sapo: string; selectedCatSlug: string | null
  thumbnail: string; uploadingImg: boolean
  onImageUpload: (file: File) => void; onClearThumbnail: () => void
  publishDate: string; onPublishDateChange: (v: string) => void
  sourceUrl: string; onSourceUrlChange: (v: string) => void
  videoUrl: string; onVideoUrlChange: (v: string) => void
  streamUrl: string; onStreamUrlChange: (v: string) => void
  scheduledAt: string; onScheduledAtChange: (v: string) => void
  steps: {title:string;content:string;image:string}[]; onStepsChange: (v: {title:string;content:string;image:string}[]) => void
  qaItems: {question:string;answer:string}[]; onQaItemsChange: (v: {question:string;answer:string}[]) => void
  ingredients: string; onIngredientsChange: (v: string) => void
  cookingTime: string; onCookingTimeChange: (v: string) => void
  servings: string; onServingsChange: (v: string) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const rule = CLIENT_TYPE_RULES[articleType] ?? CLIENT_TYPE_RULES['size_m']
  const wordCount = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length

  // Checklist items
  const checks: { label: string; ok: boolean; note?: string }[] = []
  if (rule.minWords > 0) checks.push({ label: `Nội dung`, ok: wordCount >= rule.minWords, note: `${wordCount}/${rule.minWords} từ` })
  if (rule.requireSapo) checks.push({ label: 'Sapo', ok: !!sapo.trim() })
  if (rule.requireThumbnail) checks.push({ label: 'Thumbnail', ok: !!thumbnail })
  if (rule.requireCategory) checks.push({ label: 'Chuyên mục', ok: !!selectedCatSlug })
  if (rule.requireVideoUrl) checks.push({ label: 'URL video', ok: !!videoUrl.trim() })
  if (rule.requireStreamUrl) checks.push({ label: 'URL stream', ok: !!streamUrl.trim() })
  if (rule.requireSteps) checks.push({ label: 'Các bước', ok: steps.length >= 2, note: `${steps.length} bước` })
  if (rule.requireQaItems) checks.push({ label: 'Cặp hỏi-đáp', ok: qaItems.length >= 2, note: `${qaItems.length} cặp` })

  const ready = checks.every(c => c.ok)

  const addStep = () => onStepsChange([...steps, { title: '', content: '', image: '' }])
  const updateStep = (i: number, field: 'title' | 'content' | 'image', val: string) => {
    const next = steps.map((s, idx) => idx === i ? { ...s, [field]: val } : s)
    onStepsChange(next)
  }
  const removeStep = (i: number) => onStepsChange(steps.filter((_, idx) => idx !== i))

  const addQa = () => onQaItemsChange([...qaItems, { question: '', answer: '' }])
  const updateQa = (i: number, field: 'question' | 'answer', val: string) => {
    const next = qaItems.map((q, idx) => idx === i ? { ...q, [field]: val } : q)
    onQaItemsChange(next)
  }
  const removeQa = (i: number) => onQaItemsChange(qaItems.filter((_, idx) => idx !== i))

  return (
    <aside className="w-72 bg-white border-l border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Thông tin bài viết</span>
      </div>

      <div className="p-4 space-y-5">

        {/* ── Checklist sẵn sàng gửi duyệt ── */}
        {checks.length > 0 && (
          <div className={`rounded-lg border p-3 ${ready ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
            <div className="flex items-center gap-1.5 mb-2">
              {ready
                ? <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                : <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
              }
              <span className={`text-[11px] font-bold uppercase tracking-wide ${ready ? 'text-emerald-600' : 'text-amber-600'}`}>
                {ready ? 'Sẵn sàng gửi duyệt' : 'Chưa đủ điều kiện'}
              </span>
            </div>
            <div className="space-y-1">
              {checks.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  {c.ok
                    ? <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    : <svg className="w-3 h-3 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                  }
                  <span className={`text-[11px] ${c.ok ? 'text-gray-500' : 'text-red-500 font-medium'}`}>
                    {c.label}{c.note ? ` (${c.note})` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Ảnh đại diện ── */}
        <div>
          <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-2">Ảnh Đại Diện</label>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden"
            onChange={e => { const file = e.target.files?.[0]; if (file) onImageUpload(file); e.target.value = '' }}/>
          {thumbnail ? (
            <div className="relative group">
              <img src={thumbnail} alt="Thumbnail" className="w-full h-36 object-cover rounded-lg border border-gray-200"/>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-white text-gray-800 text-xs font-semibold rounded-lg hover:bg-gray-100">Đổi ảnh</button>
                <button onClick={onClearThumbnail} className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600">Xóa</button>
              </div>
            </div>
          ) : (
            <button onClick={() => fileInputRef.current?.click()} disabled={uploadingImg}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-[#17a2b8] transition-colors group disabled:opacity-50">
              {uploadingImg
                ? <><div className="w-5 h-5 border-2 border-[#17a2b8] border-t-transparent rounded-full animate-spin mx-auto mb-2"/><p className="text-xs text-[#17a2b8]">Đang tải lên...</p></>
                : <><svg className="w-7 h-7 mx-auto text-gray-300 group-hover:text-[#17a2b8] mb-1.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <p className="text-xs text-gray-400 group-hover:text-[#17a2b8] transition-colors">Click để tải ảnh lên</p>
                  <p className="text-[10px] text-gray-300 mt-0.5">JPG, PNG, GIF, WebP</p></>
              }
            </button>
          )}
        </div>

        {/* ── Extra fields: Video Tự Chạy ── */}
        {articleType === 'video_autoplay' && (
          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1.5">
              URL Video <span className="text-red-400">*</span>
            </label>
            <input type="url" value={videoUrl} onChange={e => onVideoUrlChange(e.target.value)}
              placeholder="https://cdn.example.com/video.mp4"
              className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8] ${!videoUrl.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}/>
            <p className="text-[10px] text-gray-400 mt-1">Video sẽ tự phát khi đọc bài</p>
          </div>
        )}

        {/* ── Extra fields: Livestream ── */}
        {articleType === 'livestream' && (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1.5">
                URL Livestream <span className="text-red-400">*</span>
              </label>
              <input type="url" value={streamUrl} onChange={e => onStreamUrlChange(e.target.value)}
                placeholder="https://youtube.com/live/..."
                className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8] ${!streamUrl.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}/>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Thời gian bắt đầu</label>
              <input type="datetime-local" value={scheduledAt} onChange={e => onScheduledAtChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8]"/>
            </div>
          </div>
        )}

        {/* ── Extra fields: Wiki-How steps ── */}
        {articleType === 'wiki_how' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                Các bước <span className="text-red-400">*</span>
              </label>
              <button onClick={addStep} className="text-[10px] text-[#17a2b8] hover:text-[#138496] font-semibold">+ Thêm bước</button>
            </div>
            {steps.length === 0 && (
              <p className="text-[11px] text-red-400 italic">Cần ít nhất 2 bước để gửi duyệt</p>
            )}
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#17a2b8]">Bước {i + 1}</span>
                    <button onClick={() => removeStep(i)} className="text-[10px] text-red-400 hover:text-red-600">Xóa</button>
                  </div>
                  <input value={step.title} onChange={e => updateStep(i, 'title', e.target.value)}
                    placeholder="Tiêu đề bước..."
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#17a2b8] mb-1.5 bg-white"/>
                  <textarea value={step.content} onChange={e => updateStep(i, 'content', e.target.value)}
                    placeholder="Mô tả chi tiết bước này..." rows={2}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#17a2b8] resize-none bg-white"/>
                </div>
              ))}
            </div>
            {steps.length > 0 && (
              <button onClick={addStep} className="mt-2 w-full py-1.5 border border-dashed border-gray-300 rounded-lg text-xs text-gray-400 hover:border-[#17a2b8] hover:text-[#17a2b8] transition-colors">
                + Thêm bước
              </button>
            )}
          </div>
        )}

        {/* ── Extra fields: Nấu Ăn ── */}
        {articleType === 'cooking' && (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Nguyên liệu</label>
              <textarea value={ingredients} onChange={e => onIngredientsChange(e.target.value)}
                placeholder={"- 2 quả trứng\n- 100g bột mì\n- 200ml sữa"}
                rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8] resize-none"/>
              <p className="text-[10px] text-gray-400 mt-0.5">Mỗi nguyên liệu trên một dòng</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Thời gian</label>
                <input value={cookingTime} onChange={e => onCookingTimeChange(e.target.value)} placeholder="30 phút"
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#17a2b8]"/>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Khẩu phần</label>
                <input value={servings} onChange={e => onServingsChange(e.target.value)} placeholder="2 người"
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#17a2b8]"/>
              </div>
            </div>
          </div>
        )}

        {/* ── Extra fields: Q&A ── */}
        {articleType === 'qa' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                Hỏi &amp; Đáp <span className="text-red-400">*</span>
              </label>
              <button onClick={addQa} className="text-[10px] text-[#17a2b8] hover:text-[#138496] font-semibold">+ Thêm cặp</button>
            </div>
            {qaItems.length === 0 && (
              <p className="text-[11px] text-red-400 italic">Cần ít nhất 2 cặp hỏi-đáp</p>
            )}
            <div className="space-y-3">
              {qaItems.map((qa, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#17a2b8]">#{i + 1}</span>
                    <button onClick={() => removeQa(i)} className="text-[10px] text-red-400 hover:text-red-600">Xóa</button>
                  </div>
                  <input value={qa.question} onChange={e => updateQa(i, 'question', e.target.value)}
                    placeholder="Câu hỏi..."
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#17a2b8] mb-1.5 bg-white font-medium"/>
                  <textarea value={qa.answer} onChange={e => updateQa(i, 'answer', e.target.value)}
                    placeholder="Câu trả lời..." rows={2}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#17a2b8] resize-none bg-white"/>
                </div>
              ))}
            </div>
            {qaItems.length > 0 && (
              <button onClick={addQa} className="mt-2 w-full py-1.5 border border-dashed border-gray-300 rounded-lg text-xs text-gray-400 hover:border-[#17a2b8] hover:text-[#17a2b8] transition-colors">
                + Thêm cặp hỏi-đáp
              </button>
            )}
          </div>
        )}

        {/* ── Ngày xuất bản ── */}
        <div>
          <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Ngày Xuất Bản</label>
          <input type="datetime-local" value={publishDate} onChange={e => onPublishDateChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8]"/>
        </div>

        {/* ── Link nguồn gốc ── */}
        <div>
          <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Link Nguồn Gốc</label>
          <input type="url" placeholder="https://vnexpress.net/..." value={sourceUrl} onChange={e => onSourceUrlChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8]"/>
          <p className="text-[10px] text-gray-400 mt-1">Để trống nếu là bài viết gốc</p>
        </div>
      </div>
    </aside>
  )
}

/* ─── Icons ─── */
function TopbarLogoSmall() {
  return (
    <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none">
      <path d="M3 28L9 12L14 22L18 14L23 22L28 12L33 28" stroke="#17c3d8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ImgIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> }
function VideoIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> }
function DesktopIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> }
function TabletIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> }
function MobileIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> }
