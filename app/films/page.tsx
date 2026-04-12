'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Film } from '@/lib/types';
import { getFilmPosterUrl } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function FilmsPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();

  useEffect(() => {
    fetchFilms();
  }, [page]);

  const fetchFilms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/films', {
        params: { 
          take: 12, 
          page, 
          filter_by: 'title',
          filter: search || undefined
        },
      });
      
      if (response.data.success) {
        setFilms(response.data.data);
        if (response.data.meta && response.data.meta.length > 0) {
          setTotalPages(response.data.meta[0].total_page);
        }
      }
    } catch (error) {
      console.error('Error fetching films:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    
    const timeout = setTimeout(() => {
      setPage(1);
      fetchFilms();
    }, 500);
    
    setSearchTimeout(timeout);
  };

  if (loading && films.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Browse <span className="gradient-text">Films</span>
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search films..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-5 py-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Films Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {films.map((film) => (
                <Link
                  key={film.id}
                  href={`/films/${film.id}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 card-hover">
                    {film.images && film.images.length > 0 ? (
                      <img
                        src={getFilmPosterUrl(film.images)}
                        alt={film.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={film.images && film.images.length > 0 ? "hidden w-full h-full flex items-center justify-center text-gray-600" : "w-full h-full flex items-center justify-center text-gray-600"}>
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          {film.average_rating && film.average_rating > 0 && (
                            <div className="flex items-center gap-1 bg-orange-500 px-2 py-1 rounded text-xs font-bold">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {film.average_rating.toFixed(1)}
                            </div>
                          )}
                          <span className="text-xs text-gray-400 capitalize">
                            {film.airing_status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-orange-500 transition-colors">
                      {film.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {film.total_episodes} episodes
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={i}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          page === pageNum
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
