'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  location: {
    address: string;
  };
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  estimatedDuration: number;
  poster: {
    name: string;
    rating: number;
    avatar?: string;
  };
  bidCount: number;
  postedAt: string;
}

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      plumbing: '🔧',
      'tech support': '💻',
      cleaning: '🧹',
      electrical: '⚡',
      carpentry: '🔨',
      automotive: '🚗',
      tutoring: '📚',
      delivery: '📦',
    };
    return icons[category.toLowerCase()] || '🛠️';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getCategoryIcon(task.category)}</span>
          <div>
            <span className="text-sm text-gray-500 capitalize">{task.category}</span>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(task.urgency)}`}>
                {task.urgency}
              </span>
              <span className="text-xs text-gray-500">
                {task.estimatedDuration}h estimated
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`p-2 rounded-full ${isBookmarked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors`}
        >
          <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <Link href={`/tasks/${task.id}`} className="block group">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {task.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {task.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold text-gray-900">
            ${task.budget.min} - ${task.budget.max}
            <span className="text-sm text-gray-500 font-normal"> {task.budget.currency}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {task.location.address}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">
                {task.poster.name.charAt(0)}
              </span>
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">{task.poster.name}</div>
              <div className="flex items-center text-gray-500">
                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {task.poster.rating.toFixed(1)}
              </div>
            </div>
          </div>

          <div className="text-right text-sm">
            <div className="text-blue-600 font-medium">
              {task.bidCount} bid{task.bidCount !== 1 ? 's' : ''}
            </div>
            <div className="text-gray-500">
              {task.postedAt}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
