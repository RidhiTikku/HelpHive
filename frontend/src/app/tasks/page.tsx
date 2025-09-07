'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import TaskCard from '@/components/tasks/TaskCard';

// Mock data for demonstration
const mockTasks = [
  {
    id: '1',
    title: 'Fix leaky kitchen faucet',
    description: 'My kitchen faucet has been dripping for a week now. It needs a quick repair. I have most of the tools but need someone experienced with plumbing.',
    category: 'plumbing',
    budget: { min: 50, max: 100, currency: 'USD' },
    location: { address: 'Downtown Seattle, WA' },
    urgency: 'medium' as const,
    estimatedDuration: 2,
    poster: { name: 'Sarah Johnson', rating: 4.8, avatar: '' },
    bidCount: 3,
    postedAt: '2 hours ago'
  },
  {
    id: '2',
    title: 'Laptop screen replacement',
    description: 'My laptop screen cracked and needs replacement. It\'s a Dell XPS 13. Looking for someone who has experience with laptop repairs.',
    category: 'tech support',
    budget: { min: 200, max: 350, currency: 'USD' },
    location: { address: 'Capitol Hill, Seattle' },
    urgency: 'high' as const,
    estimatedDuration: 3,
    poster: { name: 'Mike Chen', rating: 4.5, avatar: '' },
    bidCount: 7,
    postedAt: '4 hours ago'
  },
  {
    id: '3',
    title: 'House cleaning service',
    description: 'Need a thorough cleaning of my 2-bedroom apartment. Kitchen, bathrooms, living areas, and bedrooms. Pet-friendly cleaner preferred.',
    category: 'cleaning',
    budget: { min: 80, max: 120, currency: 'USD' },
    location: { address: 'Bellevue, WA' },
    urgency: 'low' as const,
    estimatedDuration: 4,
    poster: { name: 'Emily Rodriguez', rating: 4.9, avatar: '' },
    bidCount: 12,
    postedAt: '1 day ago'
  },
  {
    id: '4',
    title: 'Emergency electrical outlet repair',
    description: 'Electrical outlet in my home office stopped working suddenly. Need urgent repair as I work from home and need power for my equipment.',
    category: 'electrical',
    budget: { min: 75, max: 150, currency: 'USD' },
    location: { address: 'Redmond, WA' },
    urgency: 'emergency' as const,
    estimatedDuration: 1.5,
    poster: { name: 'David Wilson', rating: 4.7, avatar: '' },
    bidCount: 5,
    postedAt: '30 minutes ago'
  },
];

const categories = [
  'All Categories',
  'Plumbing',
  'Tech Support',
  'Cleaning',
  'Electrical',
  'Carpentry',
  'Automotive',
  'Tutoring',
  'Delivery',
  'Other'
];

export default function TasksPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('newest');
  const [budgetRange, setBudgetRange] = useState({ min: '', max: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = mockTasks.filter(task => {
    const matchesCategory = selectedCategory === 'All Categories' || 
      task.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Tasks</h1>
          <p className="text-gray-600">Find opportunities to help others and earn money</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Tasks
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Budget Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={budgetRange.min}
                    onChange={(e) => setBudgetRange({...budgetRange, min: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={budgetRange.max}
                    onChange={(e) => setBudgetRange({...budgetRange, max: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="budget-high">Highest Budget</option>
                  <option value="budget-low">Lowest Budget</option>
                  <option value="urgent">Most Urgent</option>
                </select>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tasks</span>
                  <span className="font-semibold text-gray-900">{filteredTasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Budget</span>
                  <span className="font-semibold text-gray-900">$125</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New Today</span>
                  <span className="font-semibold text-gray-900">8</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button className="p-2 text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
