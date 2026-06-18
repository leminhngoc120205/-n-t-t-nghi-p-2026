'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';

interface ITemplate {
  _id: string;
  title: string;
  layout: string;
  fields: Array<{
    id: string;
    name: string;
  }>;
}

interface LivePreviewProps {
  templateId: string;
  content: Record<string, any>;
  articleTitle?: string;
}

export default function LivePreview({
  templateId,
  content,
  articleTitle = 'Untitled Article',
}: LivePreviewProps) {
  const [template, setTemplate] = useState<ITemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/templates/${templateId}`);
      const data = await response.json();
      setTemplate(data.data);
    } catch (err) {
      console.error('Failed to load template:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading preview..." />;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-primary">Live Preview</h2>
        <p className="text-gray-600">How your article will look online</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Preview Container */}
        <div className="bg-gray-50 p-8">
          <article className="max-w-3xl mx-auto bg-white rounded-lg overflow-hidden shadow">
            {/* Header Section */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white p-8">
              <h1 className="text-4xl font-bold font-serif mb-4">{articleTitle}</h1>
              <p className="text-gray-300 text-lg">
                {content.subtitle || 'Add a subtitle to your article'}
              </p>
            </div>

            {/* Featured Image */}
            {content.featuredImage && (
              <div className="relative h-80 w-full bg-gray-200">
                <Image
                  src={content.featuredImage}
                  alt="Featured"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Content Body */}
            <div className="p-8 space-y-6 prose prose-lg max-w-none">
              {/* Headline */}
              {content.headline && (
                <h2 className="text-3xl font-bold text-primary">
                  {content.headline}
                </h2>
              )}

              {/* Byline */}
              {content.author && (
                <div className="flex items-center gap-2 text-sm text-gray-600 border-b pb-4">
                  <span className="font-medium">By {content.author}</span>
                  {content.publishDate && (
                    <span>• {new Date(content.publishDate).toLocaleDateString()}</span>
                  )}
                </div>
              )}

              {/* Main Content */}
              {content.mainContent && (
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {content.mainContent}
                </div>
              )}

              {/* Quote Section */}
              {content.quote && (
                <blockquote className="border-l-4 border-secondary pl-6 py-4 text-xl italic text-gray-700">
                  "{content.quote}"
                  {content.quoteAuthor && (
                    <p className="text-sm text-gray-600 not-italic mt-2">
                      — {content.quoteAuthor}
                    </p>
                  )}
                </blockquote>
              )}

              {/* Image with Caption */}
              {content.imageWithCaption && (
                <figure className="space-y-2">
                  <div className="relative h-64 w-full bg-gray-200 rounded">
                    <Image
                      src={content.imageWithCaption}
                      alt="Article image"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  {content.imageCaption && (
                    <figcaption className="text-sm text-gray-600 italic">
                      {content.imageCaption}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* Video Section */}
              {content.videoUrl && (
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={content.videoUrl.replace('watch?v=', 'embed/')}
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}

              {/* Conclusion */}
              {content.conclusion && (
                <div className="border-t pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    {content.conclusion}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-100 px-8 py-6 border-t">
              {content.tags && (
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(content.tags) &&
                    content.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-secondary text-white text-xs px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
