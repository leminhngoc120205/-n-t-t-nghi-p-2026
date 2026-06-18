'use client'

import React, { useState } from 'react'

interface ServiceModel {
  id: string
  name: string
  type: string
  enabled: boolean
}

interface AIService {
  id: string
  name: string
  logo: string
  logoColor: string
  addedBy: string
  capabilities: string[]
  hasApiKey: boolean
  models: ServiceModel[]
}

const CAPABILITY_COLORS: Record<string, string> = {
  text_to_image:      'bg-purple-100 text-purple-700',
  image_to_video:     'bg-blue-100 text-blue-700',
  text_to_video:      'bg-cyan-100 text-cyan-700',
  speech_to_text:     'bg-green-100 text-green-700',
  text_to_speech:     'bg-teal-100 text-teal-700',
  image_to_image:     'bg-pink-100 text-pink-700',
  video_to_video:     'bg-orange-100 text-orange-700',
  text_to_3d:         'bg-yellow-100 text-yellow-700',
  image_enhancement:  'bg-lime-100 text-lime-700',
  background_removal: 'bg-red-100 text-red-700',
}

const SERVICES_DATA: AIService[] = [
  {
    id: 'flux_ai',
    name: 'Flux AI',
    logo: 'FX',
    logoColor: 'bg-purple-600',
    addedBy: 'System',
    capabilities: ['text_to_image', 'image_to_image'],
    hasApiKey: false,
    models: [
      { id: 'flux-pro-1.1', name: 'FLUX Pro 1.1', type: 'text_to_image', enabled: true },
      { id: 'flux-dev', name: 'FLUX Dev', type: 'text_to_image', enabled: true },
      { id: 'flux-schnell', name: 'FLUX Schnell', type: 'text_to_image', enabled: false },
    ],
  },
  {
    id: 'luma_ai',
    name: 'Luma AI',
    logo: 'LU',
    logoColor: 'bg-blue-600',
    addedBy: 'System',
    capabilities: ['text_to_video', 'image_to_video'],
    hasApiKey: false,
    models: [
      { id: 'dream-machine-v1.6', name: 'Dream Machine v1.6', type: 'text_to_video', enabled: true },
      { id: 'dream-machine-ray2', name: 'Dream Machine Ray2', type: 'image_to_video', enabled: true },
    ],
  },
  {
    id: 'deepgram',
    name: 'Deepgram',
    logo: 'DG',
    logoColor: 'bg-green-600',
    addedBy: 'System',
    capabilities: ['speech_to_text', 'text_to_speech'],
    hasApiKey: false,
    models: [
      { id: 'nova-3', name: 'Nova-3', type: 'speech_to_text', enabled: true },
      { id: 'nova-2', name: 'Nova-2', type: 'speech_to_text', enabled: false },
      { id: 'aura-asteria', name: 'Aura Asteria', type: 'text_to_speech', enabled: true },
    ],
  },
  {
    id: 'stability',
    name: 'Stability AI',
    logo: 'ST',
    logoColor: 'bg-indigo-600',
    addedBy: 'System',
    capabilities: ['text_to_image', 'image_to_image', 'image_enhancement'],
    hasApiKey: false,
    models: [
      { id: 'sd3.5-large', name: 'SD 3.5 Large', type: 'text_to_image', enabled: true },
      { id: 'sd3.5-medium', name: 'SD 3.5 Medium', type: 'text_to_image', enabled: false },
      { id: 'stable-video', name: 'Stable Video Diffusion', type: 'image_to_video', enabled: true },
    ],
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    logo: 'EL',
    logoColor: 'bg-yellow-600',
    addedBy: 'System',
    capabilities: ['text_to_speech', 'speech_to_text'],
    hasApiKey: false,
    models: [
      { id: 'eleven-turbo-v2.5', name: 'Eleven Turbo v2.5', type: 'text_to_speech', enabled: true },
      { id: 'eleven-multilingual-v2', name: 'Eleven Multilingual v2', type: 'text_to_speech', enabled: true },
    ],
  },
  {
    id: 'runway',
    name: 'Runway ML',
    logo: 'RW',
    logoColor: 'bg-rose-600',
    addedBy: 'System',
    capabilities: ['text_to_video', 'image_to_video', 'video_to_video'],
    hasApiKey: false,
    models: [
      { id: 'gen4-turbo', name: 'Gen-4 Turbo', type: 'text_to_video', enabled: true },
      { id: 'gen3-alpha', name: 'Gen-3 Alpha', type: 'image_to_video', enabled: false },
    ],
  },
  {
    id: 'kling',
    name: 'Kling AI',
    logo: 'KL',
    logoColor: 'bg-orange-500',
    addedBy: 'System',
    capabilities: ['text_to_video', 'image_to_video'],
    hasApiKey: false,
    models: [
      { id: 'kling-v1.6-pro', name: 'Kling v1.6 Pro', type: 'text_to_video', enabled: true },
      { id: 'kling-v1.6-standard', name: 'Kling v1.6 Standard', type: 'image_to_video', enabled: true },
    ],
  },
  {
    id: 'suno',
    name: 'Suno AI',
    logo: 'SN',
    logoColor: 'bg-teal-600',
    addedBy: 'System',
    capabilities: ['text_to_speech'],
    hasApiKey: false,
    models: [
      { id: 'suno-v4', name: 'Suno v4', type: 'text_to_speech', enabled: true },
    ],
  },
  {
    id: 'ideogram',
    name: 'Ideogram',
    logo: 'ID',
    logoColor: 'bg-pink-600',
    addedBy: 'System',
    capabilities: ['text_to_image'],
    hasApiKey: false,
    models: [
      { id: 'ideogram-v3', name: 'Ideogram v3', type: 'text_to_image', enabled: true },
      { id: 'ideogram-v2-turbo', name: 'Ideogram v2 Turbo', type: 'text_to_image', enabled: false },
    ],
  },
  {
    id: 'remove_bg',
    name: 'Remove.bg',
    logo: 'RB',
    logoColor: 'bg-gray-700',
    addedBy: 'System',
    capabilities: ['background_removal'],
    hasApiKey: false,
    models: [
      { id: 'remove-bg-v2', name: 'Remove BG v2', type: 'background_removal', enabled: true },
    ],
  },
  {
    id: 'tripo3d',
    name: 'Tripo3D',
    logo: '3D',
    logoColor: 'bg-cyan-600',
    addedBy: 'System',
    capabilities: ['text_to_3d'],
    hasApiKey: false,
    models: [
      { id: 'tripo-v2', name: 'Tripo v2.0', type: 'text_to_3d', enabled: false },
    ],
  },
]

export default function QuanLyAIService() {
  const [services, setServices] = useState(SERVICES_DATA)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [apiKeyModal, setApiKeyModal] = useState<AIService | null>(null)
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [searchService, setSearchService] = useState('')

  const toggleModel = (serviceId: string, modelId: string) => {
    setServices(prev => prev.map(s =>
      s.id === serviceId
        ? { ...s, models: s.models.map(m => m.id === modelId ? { ...m, enabled: !m.enabled } : m) }
        : s
    ))
  }

  const saveApiKey = () => {
    if (apiKeyModal && apiKeyInput.trim()) {
      setServices(prev => prev.map(s =>
        s.id === apiKeyModal.id ? { ...s, hasApiKey: true } : s
      ))
      setApiKeyModal(null)
      setApiKeyInput('')
    }
  }

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchService.toLowerCase()) ||
    s.capabilities.some(c => c.includes(searchService.toLowerCase()))
  )

  return (
    <div className="p-6">
      {/* Search */}
      <div className="mb-5">
        <div className="relative max-w-xs">
          <input
            type="text"
            placeholder="Tìm kiếm service..."
            value={searchService}
            onChange={e => setSearchService(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"
          />
          <svg className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredServices.map(service => {
          const isExpanded = expandedId === service.id
          return (
            <div key={service.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {/* Service header */}
              <div className="p-4 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg ${service.logoColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <span className="text-white font-bold text-xs">{service.logo}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-semibold text-gray-800 text-sm">{service.name}</h3>
                    <span className="text-xs text-gray-400">· {service.addedBy}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {service.capabilities.map(cap => (
                      <span key={cap} className={`text-xs px-2 py-0.5 rounded-full font-medium ${CAPABILITY_COLORS[cap] || 'bg-gray-100 text-gray-600'}`}>
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {service.hasApiKey ? (
                    <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-md">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Đã thêm API KEY
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 hidden sm:inline">Chưa thêm API_KEY</span>
                      <button
                        onClick={() => { setApiKeyModal(service); setApiKeyInput('') }}
                        className="text-xs px-3 py-1.5 bg-[#17a2b8] text-white rounded-md hover:bg-[#138496] transition-colors font-medium"
                      >
                        Thêm API_KEY
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : service.id)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-600"
                  >
                    {isExpanded ? 'Ẩn Models' : 'Xem Models'}
                    <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expanded models */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-2">
                  {service.models.map(model => (
                    <div key={model.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-800">{model.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CAPABILITY_COLORS[model.type] || 'bg-gray-100 text-gray-600'}`}>
                          {model.type}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleModel(service.id, model.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${model.enabled ? 'bg-[#17a2b8]' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${model.enabled ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {filteredServices.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm">Không tìm thấy service phù hợp</p>
          </div>
        )}
      </div>

      {/* API Key Modal */}
      {apiKeyModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setApiKeyModal(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-[460px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${apiKeyModal.logoColor} flex items-center justify-center`}>
                  <span className="text-white font-bold text-xs">{apiKeyModal.logo}</span>
                </div>
                <h2 className="font-bold text-gray-800">Thêm API KEY — {apiKeyModal.name}</h2>
              </div>
              <button onClick={() => setApiKeyModal(null)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 text-xl">×</button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">API KEY</label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                placeholder="Nhập API KEY..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"
              />
              <p className="text-xs text-gray-400 mt-2">API KEY được mã hoá và lưu trữ an toàn.</p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setApiKeyModal(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100">Đóng</button>
              <button onClick={saveApiKey} disabled={!apiKeyInput.trim()} className="px-4 py-2 text-sm bg-[#17a2b8] text-white rounded-md hover:bg-[#138496] disabled:opacity-50 font-medium">Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
