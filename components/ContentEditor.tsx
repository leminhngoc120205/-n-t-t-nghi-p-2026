'use client';

import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

interface IField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'image' | 'video' | 'richtext';
  placeholder?: string;
  required?: boolean;
}

interface ContentEditorProps {
  templateId: string;
  onContentChange: (content: Record<string, any>) => void;
  initialContent?: Record<string, any>;
}

export default function ContentEditor({
  templateId,
  onContentChange,
  initialContent = {},
}: ContentEditorProps) {
  const [fields, setFields] = useState<IField[]>([]);
  const [content, setContent] = useState<Record<string, any>>(initialContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/templates/${templateId}`);
      
      if (!response.ok) throw new Error('Failed to load template');
      
      const data = await response.json();
      setFields(data.data.fields || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    const updatedContent = { ...content, [fieldId]: value };
    setContent(updatedContent);
    onContentChange(updatedContent);
  };

  if (loading) return <LoadingSpinner message="Loading editor..." />;

  return (
    <div className="space-y-6">
      {error && (
        <ErrorDisplay 
          error={error} 
          onDismiss={() => setError(null)}
        />
      )}

      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-primary">Edit Content</h2>
        <p className="text-gray-600">Fill in the fields below to customize your article</p>
      </div>

      <form className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
        {fields.map(field => (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className="block font-medium text-gray-700">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === 'text' && (
              <input
                id={field.id}
                type="text"
                placeholder={field.placeholder || ''}
                value={content[field.id] || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                id={field.id}
                placeholder={field.placeholder || ''}
                value={content[field.id] || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            )}

            {field.type === 'image' && (
              <div className="space-y-2">
                <input
                  id={field.id}
                  type="text"
                  placeholder="Image URL"
                  value={content[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                {content[field.id] && (
                  <img 
                    src={content[field.id]} 
                    alt="Preview" 
                    className="h-40 object-cover rounded-lg"
                    onError={() => handleFieldChange(field.id, '')}
                  />
                )}
              </div>
            )}

            {field.type === 'video' && (
              <input
                id={field.id}
                type="text"
                placeholder="Video URL (YouTube, Vimeo, etc.)"
                value={content[field.id] || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            )}

            {field.type === 'richtext' && (
              <textarea
                id={field.id}
                placeholder={field.placeholder || 'Enter rich text content...'}
                value={content[field.id] || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary font-mono text-sm"
              />
            )}
          </div>
        ))}
      </form>
    </div>
  );
}
