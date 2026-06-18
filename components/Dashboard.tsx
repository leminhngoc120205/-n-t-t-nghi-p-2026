'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiEdit2, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

interface IArticle {
  _id: string;
  title: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  publishedAt?: string;
}

export default function Dashboard() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  useEffect(() => {
    fetchArticles();
  }, [filter]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const response = await fetch(`/api/articles${params}`);
      
      if (!response.ok) throw new Error('Failed to fetch articles');
      
      const data = await response.json();
      setArticles(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete article');

      setArticles(articles.filter(a => a._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
    }
  };

  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      {error && (
        <ErrorDisplay 
          error={error} 
          onDismiss={() => setError(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-gray-600">Manage your articles and content</p>
        </div>
        
        <Link
          href="/editor"
          className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          New Article
        </Link>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {(['all', 'draft', 'published', 'archived'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-secondary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Articles Table */}
      {articles.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">Title</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">Author</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">Date</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {articles.map(article => (
                <tr key={article._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-primary">{article.title}</td>
                  <td className="px-6 py-4 text-gray-600">{article.author}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[article.status]}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/editor/${article._id}`}
                        title="Edit"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </Link>
                      
                      {article.status === 'published' && (
                        <Link
                          href={`/articles/${article._id}`}
                          title="View"
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <FiEye className="w-5 h-5" />
                        </Link>
                      )}
                      
                      <button
                        onClick={() => handleDelete(article._id)}
                        title="Delete"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No articles found</p>
          <Link
            href="/editor"
            className="text-secondary hover:underline font-medium"
          >
            Create your first article
          </Link>
        </div>
      )}
    </div>
  );
}
