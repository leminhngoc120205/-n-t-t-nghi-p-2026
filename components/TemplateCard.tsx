import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

interface ITemplate {
  _id: string;
  title: string;
  description: string;
  category: 'news' | 'magazine' | 'longform' | 'interactive';
  thumbnail: string;
}

interface TemplateCardProps {
  template: ITemplate;
  onSelect?: (id: string) => void;
}

const categoryColors = {
  news: 'bg-blue-100 text-blue-800',
  magazine: 'bg-purple-100 text-purple-800',
  longform: 'bg-green-100 text-green-800',
  interactive: 'bg-orange-100 text-orange-800',
};

export default function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group">
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {template.thumbnail ? (
          <Image
            src={template.thumbnail}
            alt={template.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <span className="text-gray-400 text-sm">No preview</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg text-primary flex-1">{template.title}</h3>
          <span className={`text-xs font-medium px-2 py-1 rounded ${categoryColors[template.category]}`}>
            {template.category}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>
        
        <button
          onClick={() => onSelect?.(template._id)}
          className="w-full bg-secondary text-white px-4 py-2 rounded font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          Use Template
          <FiArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
