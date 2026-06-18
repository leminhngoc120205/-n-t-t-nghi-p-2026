'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

interface IArticle {
  _id: string;
  title: string;
  content: Record<string, any>;
  author: string;
  publishedAt: string;
  featuredImage?: string;
  tags: string[];
}

interface ArticleRendererProps {
  articleId: string;
}

export default function ArticleRenderer({ articleId }: ArticleRendererProps) {
  const [article, setArticle] = useState<IArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/articles/${articleId}`);
      
      if (!response.ok) throw new Error('Article not found');
      
      const data = await response.json();
      setArticle(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading article..." />;
  if (error) return <ErrorDisplay error={error} />;
  if (!article) return <ErrorDisplay error="Article not found" />;

  const { title, content, author, publishedAt, featuredImage, tags } = article;

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-5xl font-bold font-serif text-primary mb-4">
          {title}
        </h1>
        
        <div className="flex items-center gap-4 text-gray-600 pb-6 border-b">
          <span className="font-medium">{author}</span>
          <span>•</span>
          <time dateTime={publishedAt}>
            {new Date(publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </header>

      {/* Featured Image */}
      {featuredImage && (
        <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={featuredImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Main Content */}
      <div className="prose prose-lg max-w-none mb-8">
        {content.mainContent && (
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {content.mainContent}
          </div>
        )}
      </div>

      {/* Quote */}
      {content.quote && (
        <blockquote className="border-l-4 border-secondary pl-6 py-4 my-8 text-xl italic">
          "{content.quote}"
          {content.quoteAuthor && (
            <p className="text-sm not-italic text-gray-600 mt-2">
              — {content.quoteAuthor}
            </p>
          )}
        </blockquote>
      )}

      {/* Media Elements */}
      <div className="space-y-8">
        {content.imageWithCaption && (
          <figure>
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image
                src={content.imageWithCaption}
                alt="Article image"
                fill
                className="object-cover"
              />
            </div>
            {content.imageCaption && (
              <figcaption className="text-sm text-gray-600 mt-2 italic">
                {content.imageCaption}
              </figcaption>
            )}
          </figure>
        )}

        {content.videoUrl && (
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-900">
            <iframe
              width="100%"
              height="100%"
              src={content.videoUrl.replace('watch?v=', 'embed/')}
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}
      </div>

      {/* Conclusion */}
      {content.conclusion && (
        <div className="mt-8 pt-8 border-t">
          <p className="text-gray-800 leading-relaxed">
            {content.conclusion}
          </p>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mt-8 pt-8 border-t space-y-4">
          <h3 className="font-semibold text-gray-700">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-secondary text-white text-sm px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
