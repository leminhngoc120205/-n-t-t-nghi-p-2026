'use client';

import React, { useState, useEffect } from 'react';
import TemplateCard from './TemplateCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

interface ITemplate {
  _id: string;
  title: string;
  description: string;
  category: 'news' | 'magazine' | 'longform' | 'interactive';
  thumbnail: string;
}

interface TemplateSelectorProps {
  onTemplateSelect: (templateId: string) => void;
}

const categories = [
  { id: 'all', label: 'All Templates' },
  { id: 'news', label: 'News Articles' },
  { id: 'magazine', label: 'Magazine' },
  { id: 'longform', label: 'Longform' },
  { id: 'interactive', label: 'Interactive' },
];

export default function TemplateSelector({ onTemplateSelect }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ITemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/templates');
      
      if (!response.ok) throw new Error('Failed to fetch templates');
      
      const data = await response.json();
      setTemplates(data.data || []);
      setFilteredTemplates(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    if (category === 'all') {
      setFilteredTemplates(templates);
    } else {
      setFilteredTemplates(
        templates.filter(t => t.category === category)
      );
    }
  };

  if (loading) return <LoadingSpinner message="Loading templates..." />;

  return (
    <div className="space-y-6">
      {error && (
        <ErrorDisplay 
          error={error} 
          onDismiss={() => setError(null)}
        />
      )}

      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-primary">Choose a Template</h2>
        <p className="text-gray-600">Select a template to start creating your article</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-secondary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template._id}
              template={template}
              onSelect={onTemplateSelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No templates found in this category</p>
          <button
            onClick={() => handleCategoryChange('all')}
            className="mt-4 text-secondary hover:underline font-medium"
          >
            View all templates
          </button>
        </div>
      )}
    </div>
  );
}
