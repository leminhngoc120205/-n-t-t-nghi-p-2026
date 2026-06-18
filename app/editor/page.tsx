'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import TemplateSelector from '@/components/TemplateSelector';
import ContentEditor from '@/components/ContentEditor';
import LivePreview from '@/components/LivePreview';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import { FiSave, FiChevronRight } from 'react-icons/fi';

type Step = 'template' | 'content' | 'preview';

export default function EditorPage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string | undefined;

  const [step, setStep] = useState<Step>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleAuthor, setArticleAuthor] = useState('');
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [articleStatus, setArticleStatus] = useState<'draft' | 'published'>('draft');

  useEffect(() => {
    if (articleId) {
      loadArticle();
    }
  }, [articleId]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/articles/${articleId}`);
      if (!response.ok) throw new Error('Failed to load article');
      
      const data = await response.json();
      const article = data.data;
      
      setArticleTitle(article.title);
      setArticleAuthor(article.author);
      setSelectedTemplate(article.templateId);
      setContent(article.content);
      setArticleStatus(article.status);
      setStep('content');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedTemplate || !articleTitle || !articleAuthor) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const articleData = {
        title: articleTitle,
        author: articleAuthor,
        templateId: selectedTemplate,
        content,
        status: articleStatus,
      };

      const url = articleId ? `/api/articles/${articleId}` : '/api/articles';
      const method = articleId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) throw new Error('Failed to save article');

      await response.json();
      router.push(`/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading editor..." />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-white font-bold">
              J
            </div>
            <h1 className="text-2xl font-bold text-primary hidden sm:block">Journalism CMS</h1>
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-primary transition-colors">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <ErrorDisplay 
            error={error} 
            onDismiss={() => setError(null)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step Indicator */}
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setStep('template')}
                className={`px-4 py-2 rounded ${
                  step === 'template'
                    ? 'bg-secondary text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Template
              </button>
              <FiChevronRight className="w-4 h-4" />
              
              <button
                onClick={() => selectedTemplate && setStep('content')}
                disabled={!selectedTemplate}
                className={`px-4 py-2 rounded ${
                  step === 'content'
                    ? 'bg-secondary text-white'
                    : selectedTemplate
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Content
              </button>
              <FiChevronRight className="w-4 h-4" />
              
              <button
                onClick={() => selectedTemplate && setStep('preview')}
                disabled={!selectedTemplate}
                className={`px-4 py-2 rounded ${
                  step === 'preview'
                    ? 'bg-secondary text-white'
                    : selectedTemplate
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Preview
              </button>
            </div>

            {/* Template Selection */}
            {step === 'template' && (
              <TemplateSelector
                onTemplateSelect={(id) => {
                  setSelectedTemplate(id);
                  setStep('content');
                }}
              />
            )}

            {/* Article Metadata & Content Editor */}
            {(step === 'content' || step === 'preview') && selectedTemplate && (
              <div className="space-y-6">
                {/* Article Title & Author */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
                  <div>
                    <label htmlFor="title" className="block font-medium text-gray-700 mb-2">
                      Article Title *
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      placeholder="Enter article title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>

                  <div>
                    <label htmlFor="author" className="block font-medium text-gray-700 mb-2">
                      Author Name *
                    </label>
                    <input
                      id="author"
                      type="text"
                      value={articleAuthor}
                      onChange={(e) => setArticleAuthor(e.target.value)}
                      placeholder="Enter author name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      id="status"
                      value={articleStatus}
                      onChange={(e) => setArticleStatus(e.target.value as 'draft' | 'published')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                {step === 'content' && (
                  <ContentEditor
                    templateId={selectedTemplate}
                    content={content}
                    onContentChange={setContent}
                  />
                )}
              </div>
            )}

            {/* Preview */}
            {step === 'preview' && selectedTemplate && (
              <LivePreview
                templateId={selectedTemplate}
                content={content}
                articleTitle={articleTitle}
              />
            )}
          </div>

          {/* Sidebar */}
          <aside className="bg-white rounded-lg border border-gray-200 p-6 h-fit sticky top-24 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Editor Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Select a template to start</p>
                <p>• Fill in the content fields</p>
                <p>• Preview your article</p>
                <p>• Save as draft or publish</p>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!selectedTemplate || !articleTitle || !articleAuthor || saving}
              className="w-full flex items-center justify-center gap-2 bg-secondary text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
            >
              <FiSave className="w-5 h-5" />
              {saving ? 'Saving...' : articleId ? 'Update Article' : 'Save Article'}
            </button>

            <Link
              href="/dashboard"
              className="w-full text-center bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Back to Dashboard
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
