'use client'

import React, { useState } from 'react'
import { StatCard } from './StatCard'
import { QuickActions } from './QuickActions'
import { ArticleList } from './ArticleList'
import { DraftsList } from './DraftsList'
import { TemplateGrid } from './TemplateGrid'

interface DashboardContentProps {
  searchQuery: string
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  searchQuery,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'drafts' | 'templates'>(
    'overview'
  )

  // Mock data
  const stats = [
    {
      label: 'Published Articles',
      value: '24',
      change: '+2 this week',
      color: 'blue',
      icon: '📰',
    },
    {
      label: 'Draft Articles',
      value: '3',
      change: '+1 today',
      color: 'amber',
      icon: '✏️',
    },
    {
      label: 'Total Views',
      value: '12.5K',
      change: '+8% vs last week',
      color: 'green',
      icon: '👁️',
    },
    {
      label: 'Avg. Reading Time',
      value: '5.2min',
      change: '+0.3min vs last week',
      color: 'gold',
      icon: '⏱️',
    },
  ]

  const recentArticles = [
    {
      id: '1',
      title: 'The Future of Digital Journalism',
      excerpt: 'Exploring how AI and data visualization are reshaping storytelling',
      image: '/images/article-1.jpg',
      author: 'Sarah Johnson',
      date: 'Today',
      status: 'published' as const,
      views: 2400,
      readTime: 8,
    },
    {
      id: '2',
      title: 'Breaking News: New Media Trends',
      excerpt: 'Analysis of emerging trends in online news consumption',
      image: '/images/article-2.jpg',
      author: 'Michael Chen',
      date: 'Yesterday',
      status: 'published' as const,
      views: 1800,
      readTime: 6,
    },
    {
      id: '3',
      title: 'Interview: Industry Leaders Speak Out',
      excerpt: 'Exclusive conversation with leading figures in digital media',
      image: '/images/article-3.jpg',
      author: 'Emma Wilson',
      date: '2 days ago',
      status: 'published' as const,
      views: 3200,
      readTime: 12,
    },
  ]

  const draftArticles = [
    {
      id: '4',
      title: 'Understanding Data Journalism',
      excerpt: 'A deep dive into how data shapes modern journalism',
      author: 'John Doe',
      date: 'Today at 2:30 PM',
      status: 'draft' as const,
      progress: 65,
    },
    {
      id: '5',
      title: 'The Evolution of Newsrooms',
      excerpt: 'How traditional newsrooms are transforming',
      author: 'Jane Smith',
      date: 'Yesterday at 10:15 AM',
      status: 'draft' as const,
      progress: 40,
    },
    {
      id: '6',
      title: 'Multimedia Storytelling Guide',
      excerpt: 'Best practices for combining text, video, and interactive elements',
      author: 'Alex Turner',
      date: 'May 26 at 5:45 PM',
      status: 'draft' as const,
      progress: 85,
    },
  ]

  const templates = [
    {
      id: '1',
      name: 'Feature Story',
      description: 'Long-form investigative journalism template',
      category: 'Editorial',
      thumbnail: '📝',
      uses: 128,
    },
    {
      id: '2',
      name: 'News Brief',
      description: 'Quick-format breaking news template',
      category: 'News',
      thumbnail: '⚡',
      uses: 256,
    },
    {
      id: '3',
      name: 'Opinion Piece',
      description: 'Editorial commentary template',
      category: 'Opinion',
      thumbnail: '💭',
      uses: 84,
    },
    {
      id: '4',
      name: 'Visual Story',
      description: 'Photo gallery and multimedia template',
      category: 'Media',
      thumbnail: '🖼️',
      uses: 156,
    },
    {
      id: '5',
      name: 'Data Visualization',
      description: 'Interactive charts and infographics',
      category: 'Data',
      thumbnail: '📊',
      uses: 112,
    },
    {
      id: '6',
      name: 'Interview Q&A',
      description: 'Structured interview format',
      category: 'Interview',
      thumbnail: '🎤',
      uses: 73,
    },
  ]

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-serif text-editorial-dark mb-2">
          Dashboard
        </h1>
        <p className="text-editorial-gray-slate">
          Welcome back! Here's what's happening in your newsroom today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <QuickActions />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-editorial-gray-medium">
        {['overview', 'drafts', 'templates'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`
              px-4 py-3 font-medium text-sm transition-all duration-200
              border-b-2 -mb-px
              ${
                activeTab === tab
                  ? 'border-editorial-blue text-editorial-blue'
                  : 'border-transparent text-editorial-gray-slate hover:text-editorial-dark'
              }
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Recent Articles */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-serif text-editorial-dark mb-2">
                Recent Articles
              </h2>
              <p className="text-editorial-gray-slate text-sm">
                Your most recent published articles
              </p>
            </div>
            <ArticleList articles={recentArticles} />
          </section>
        </div>
      )}

      {activeTab === 'drafts' && (
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-serif text-editorial-dark mb-2">
              Draft Articles
            </h2>
            <p className="text-editorial-gray-slate text-sm">
              Continue working on your in-progress articles
            </p>
          </div>
          <DraftsList articles={draftArticles} />
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-serif text-editorial-dark mb-2">
              Story Templates
            </h2>
            <p className="text-editorial-gray-slate text-sm">
              Choose a template to start creating your next story
            </p>
          </div>
          <TemplateGrid templates={templates} />
        </div>
      )}
    </div>
  )
}
