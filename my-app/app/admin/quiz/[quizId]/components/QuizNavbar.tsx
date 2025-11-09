'use client';
import { useState } from 'react';
import { Menu, X, Eye, Share2, ChevronDown } from 'lucide-react';
import { redirect, useParams } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('create');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { quizId } = useParams();

  return (
    <nav className="w-full bg-black border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-900 rounded-lg transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="">
              <h1 className="text-base font-medium text-white">Prompt Lab</h1>
            </div>

            <button className="p-2 hover:bg-gray-900 rounded-full transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="#ffffff" strokeWidth="2" />
                <path d="M10 7V10L12 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Center Section - Tabs */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setActiveTab('create')}
              className={`relative py-4 text-sm font-medium transition-colors ${activeTab === 'create'
                  ? 'text-indigo-400'
                  : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              Create
              {activeTab === 'create' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`relative py-4 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'results'
                  ? 'text-indigo-400'
                  : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              Results
              <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                1
              </span>
              {activeTab === 'results' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <button className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-medium hover:bg-indigo-700 transition-colors">
                J
              </button>


              <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-900 rounded-lg transition-colors">
                <Share2 size={18} className="text-gray-300" />
                <span className="text-sm font-medium text-white">Share</span>
              </button>
            </div>

            <Link href={`/admin/quiz/present/${quizId}`}>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
                <span className="text-sm font-medium">Present</span>
                <ChevronDown size={16} />
              </button>
            </Link>


            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-900 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4 space-y-2">
            <button
              onClick={() => {
                setActiveTab('create');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'create'
                  ? 'bg-gray-900 text-indigo-400'
                  : 'text-gray-400 hover:bg-gray-900'
                }`}
            >
              Create
            </button>

            <button
              onClick={() => {
                setActiveTab('results');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${activeTab === 'results'
                  ? 'bg-gray-900 text-indigo-400'
                  : 'text-gray-400 hover:bg-gray-900'
                }`}
            >
              <span>Results</span>
              <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                1
              </span>
            </button>

            <div className="pt-4 mt-4 border-t border-gray-800 flex items-center gap-2 px-4">
              <button className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-medium">
                J
              </button>
              <button className="w-10 h-10 border-2 border-dashed border-gray-700 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-xl leading-none">+</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}