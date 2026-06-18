'use client'

import React, { useState } from 'react'

interface Model {
  id: string
  name: string
  type: 'Chat' | 'Image Generation' | 'Embedding'
  enabled: boolean
}

interface Provider {
  id: string
  name: string
  logo: string
  addedBy: string
  supportedTypes: string[]
  hasApiKey: boolean
  apiKeyValue?: string
  models: Model[]
}

const PROVIDERS_DATA: Provider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    logo: 'O',
    addedBy: 'System',
    supportedTypes: ['Chat', 'Image Generation'],
    hasApiKey: false,
    models: [
      { id: 'gpt-5.2', name: 'GPT-5.2', type: 'Chat', enabled: true },
      { id: 'gpt-5', name: 'GPT-5', type: 'Chat', enabled: true },
      { id: 'gpt-4-0613', name: 'GPT-4 (0613)', type: 'Chat', enabled: false },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', type: 'Chat', enabled: true },
      { id: 'gpt-4o', name: 'GPT-4o', type: 'Chat', enabled: true },
      { id: 'dall-e-3', name: 'DALL·E 3', type: 'Image Generation', enabled: true },
    ],
  },
  {
    id: 'google',
    name: 'Google Gemini',
    logo: 'G',
    addedBy: 'System',
    supportedTypes: ['Chat'],
    hasApiKey: false,
    models: [
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', type: 'Chat', enabled: true },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', type: 'Chat', enabled: true },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', type: 'Chat', enabled: false },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    logo: 'D',
    addedBy: 'System',
    supportedTypes: ['Chat'],
    hasApiKey: false,
    models: [
      { id: 'deepseek-v3', name: 'DeepSeek V3', type: 'Chat', enabled: true },
      { id: 'deepseek-r1', name: 'DeepSeek R1', type: 'Chat', enabled: true },
      { id: 'deepseek-chat', name: 'DeepSeek Chat', type: 'Chat', enabled: false },
    ],
  },
  {
    id: 'meta',
    name: 'Meta (Facebook)',
    logo: 'M',
    addedBy: 'System',
    supportedTypes: ['Chat'],
    hasApiKey: false,
    models: [
      { id: 'llama-4-scout', name: 'Llama 4 Scout', type: 'Chat', enabled: true },
      { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', type: 'Chat', enabled: false },
      { id: 'llama-3.1-405b', name: 'Llama 3.1 405B', type: 'Chat', enabled: true },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    logo: 'R',
    addedBy: 'System',
    supportedTypes: ['Chat', 'Image Generation'],
    hasApiKey: false,
    models: [
      { id: 'claude-3.5', name: 'Claude 3.5 Sonnet', type: 'Chat', enabled: true },
      { id: 'mistral-large', name: 'Mistral Large', type: 'Chat', enabled: false },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    logo: 'A',
    addedBy: 'System',
    supportedTypes: ['Chat'],
    hasApiKey: false,
    models: [
      { id: 'claude-opus-4', name: 'Claude Opus 4', type: 'Chat', enabled: true },
      { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', type: 'Chat', enabled: true },
      { id: 'claude-haiku-4', name: 'Claude Haiku 4', type: 'Chat', enabled: false },
    ],
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    logo: 'Mi',
    addedBy: 'System',
    supportedTypes: ['Chat', 'Embedding'],
    hasApiKey: false,
    models: [
      { id: 'mistral-large-2', name: 'Mistral Large 2', type: 'Chat', enabled: true },
      { id: 'mistral-embed', name: 'Mistral Embed', type: 'Embedding', enabled: false },
    ],
  },
]

const LOGO_COLORS: Record<string, string> = {
  openai: 'bg-black',
  google: 'bg-blue-500',
  deepseek: 'bg-indigo-600',
  meta: 'bg-blue-600',
  openrouter: 'bg-violet-600',
  anthropic: 'bg-orange-500',
  mistral: 'bg-rose-500',
}

const TYPE_COLORS: Record<string, string> = {
  'Chat': 'bg-blue-100 text-blue-700',
  'Image Generation': 'bg-purple-100 text-purple-700',
  'Embedding': 'bg-green-100 text-green-700',
}

export default function QuanLyModelAI() {
  const [providers, setProviders] = useState(PROVIDERS_DATA)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchModel, setSearchModel] = useState<Record<string, string>>({})
  const [filterType, setFilterType] = useState<Record<string, string>>({})
  const [apiKeyModal, setApiKeyModal] = useState<Provider | null>(null)
  const [apiKeyInput, setApiKeyInput] = useState('')

  const toggleModel = (providerId: string, modelId: string) => {
    setProviders(prev => prev.map(p =>
      p.id === providerId
        ? { ...p, models: p.models.map(m => m.id === modelId ? { ...m, enabled: !m.enabled } : m) }
        : p
    ))
  }

  const saveApiKey = () => {
    if (apiKeyModal && apiKeyInput.trim()) {
      setProviders(prev => prev.map(p =>
        p.id === apiKeyModal.id ? { ...p, hasApiKey: true, apiKeyValue: apiKeyInput } : p
      ))
      setApiKeyModal(null)
      setApiKeyInput('')
    }
  }

  const getFilteredModels = (provider: Provider) => {
    const search = (searchModel[provider.id] || '').toLowerCase()
    const type = filterType[provider.id] || 'all'
    return provider.models.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(search)
      const matchType = type === 'all' || m.type === type
      return matchSearch && matchType
    })
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-4">
        {providers.map(provider => {
          const isExpanded = expandedId === provider.id
          const filteredModels = getFilteredModels(provider)

          return (
            <div key={provider.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {/* Provider header */}
              <div className="p-4 flex items-center gap-4">
                {/* Logo */}
                <div className={`w-10 h-10 rounded-lg ${LOGO_COLORS[provider.id] || 'bg-gray-700'} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{provider.logo}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-800 text-sm">{provider.name}</h3>
                    <span className="text-xs text-gray-400">· {provider.addedBy}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {provider.supportedTypes.map(t => (
                      <span key={t} className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[t] || 'bg-gray-100 text-gray-600'}`}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* API Key status */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {provider.hasApiKey ? (
                    <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-md">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Đã thêm API KEY
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Chưa thêm API_KEY</span>
                      <button
                        onClick={() => { setApiKeyModal(provider); setApiKeyInput('') }}
                        className="text-xs px-3 py-1.5 bg-[#17a2b8] text-white rounded-md hover:bg-[#138496] transition-colors font-medium"
                      >
                        Thêm API_KEY
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : provider.id)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-600"
                  >
                    {isExpanded ? 'Ẩn Models' : 'Xem Models'}
                    <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expanded models section */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 p-4">
                  {/* Filter row */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-1 max-w-xs">
                      <input
                        type="text"
                        placeholder="Tìm kiếm model..."
                        value={searchModel[provider.id] || ''}
                        onChange={e => setSearchModel(prev => ({ ...prev, [provider.id]: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#17a2b8]"
                      />
                      <svg className="absolute left-2.5 top-2 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <select
                      value={filterType[provider.id] || 'all'}
                      onChange={e => setFilterType(prev => ({ ...prev, [provider.id]: e.target.value }))}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:border-[#17a2b8]"
                    >
                      <option value="all">Tất cả loại</option>
                      <option value="Chat">Chat</option>
                      <option value="Image Generation">Image Generation</option>
                      <option value="Embedding">Embedding</option>
                    </select>
                    <span className="text-xs text-gray-500">{filteredModels.length} model</span>
                  </div>

                  {/* Models list */}
                  <div className="space-y-2">
                    {filteredModels.map(model => (
                      <div key={model.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-800">{model.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[model.type] || 'bg-gray-100 text-gray-600'}`}>
                            {model.type}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleModel(provider.id, model.id)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${model.enabled ? 'bg-[#17a2b8]' : 'bg-gray-300'}`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${model.enabled ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
                        </button>
                      </div>
                    ))}
                    {filteredModels.length === 0 && (
                      <div className="text-center py-6 text-sm text-gray-400">Không tìm thấy model phù hợp</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* API Key Modal */}
      {apiKeyModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setApiKeyModal(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-[460px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${LOGO_COLORS[apiKeyModal.id] || 'bg-gray-700'} flex items-center justify-center`}>
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
                placeholder="sk-..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"
              />
              <p className="text-xs text-gray-400 mt-2">API KEY được mã hoá và lưu trữ an toàn trên hệ thống.</p>
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
