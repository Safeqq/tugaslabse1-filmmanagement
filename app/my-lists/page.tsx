'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { FilmList } from '@/lib/types';
import { getFilmPosterUrl } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

interface FilmListWithDetails extends FilmList {
  film?: {
    id: string;
    title: string;
    images?: string[];
    average_rating?: number;
  };
}

function MyLists() {
  const [lists, setLists] = useState<{ [key: string]: FilmListWithDetails[] }>({
    watching: [],
    completed: [],
    plan_to_watch: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching film lists...');
      const response = await api.get('/film-lists');
      console.log('Film lists response:', response.data);
      
      if (response.data.success) {
        // Group by list_status
        const grouped: { [key: string]: FilmListWithDetails[] } = {
          watching: [],
          completed: [],
          plan_to_watch: [],
        };
        
        response.data.data.forEach((item: FilmListWithDetails) => {
          console.log('Processing item:', item);
          if (grouped[item.list_status]) {
            grouped[item.list_status].push(item);
          }
        });
        
        console.log('Grouped lists:', grouped);
        setLists(grouped);
      }
    } catch (error: any) {
      console.error('Error fetching lists:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.error || 'Failed to load your lists');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (listId: string, currentVisibility: string) => {
    try {
      const newVisibility = currentVisibility === 'public' ? 'private' : 'public';
      const response = await api.patch(`/film-lists/${listId}`, {
        visibility: newVisibility,
      });
      
      if (response.data.success) {
        await fetchLists();
      }
    } catch (error: any) {
      console.error('Error updating visibility:', error);
      alert(error.response?.data?.error || 'Failed to update visibility');
    }
  };

  const handleRemoveFromList = async (listId: string) => {
    if (!confirm('Are you sure you want to remove this film from your list?')) {
      return;
    }

    try {
      const response = await api.delete(`/film-lists/${listId}`);
      
      if (response.data.success) {
        await fetchLists();
      }
    } catch (error: any) {
      console.error('Error removing from list:', error);
      alert(error.response?.data?.error || 'Failed to remove from list');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderList = (title: string, items: FilmListWithDetails[], status: string, icon: string) => (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{icon}</span>
        <h2 className="text-3xl font-bold gradient-text">{title}</h2>
        <span className="text-gray-400">({items.length})</span>
      </div>
      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group">
              <Link href={`/films/${item.film_id}`}>
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 card-hover mb-3">
                  {item.film?.images && item.film.images.length > 0 ? (
                    <img
                      src={getFilmPosterUrl(item.film.images)}
                      alt={item.film?.title || item.film_title || 'Film'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={item.film?.images && item.film.images.length > 0 ? "hidden w-full h-full flex items-center justify-center text-gray-600" : "w-full h-full flex items-center justify-center text-gray-600"}>
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                  
                  {/* Visibility Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium backdrop-blur-sm ${
                      item.visibility === 'public' 
                        ? 'bg-green-500/80 text-white' 
                        : 'bg-gray-500/80 text-white'
                    }`}>
                      {item.visibility === 'public' ? '🌐' : '🔒'}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  {item.film?.average_rating && item.film.average_rating > 0 && (
                    <div className="absolute bottom-2 left-2">
                      <div className="flex items-center gap-1 bg-orange-500 px-2 py-1 rounded text-xs font-bold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {item.film.average_rating.toFixed(1)}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
              
              <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors">
                {item.film?.title || item.film_title || 'Unknown Film'}
              </h3>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleVisibility(item.id, item.visibility)}
                  className="flex-1 px-2 py-1 bg-white/5 hover:bg-white/10 border border-gray-600 rounded text-xs transition-all"
                  title={`Make ${item.visibility === 'public' ? 'Private' : 'Public'}`}
                >
                  {item.visibility === 'public' ? '🔒' : '🌐'}
                </button>
                <button
                  onClick={() => handleRemoveFromList(item.id)}
                  className="flex-1 px-2 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded text-xs transition-all"
                  title="Remove from list"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-400 text-lg mb-4">No films in this list yet.</p>
          <Link href="/films" className="btn-primary inline-block px-6 py-2">
            Browse Films
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-3 gradient-text">My Film Lists</h1>
          <p className="text-gray-400 text-lg">Manage your personal film collection</p>
        </div>

        {error && (
          <div className="glass-card border-l-4 border-red-500 px-6 py-4 mb-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {renderList('Currently Watching', lists.watching, 'watching', '📺')}
        {renderList('Plan to Watch', lists.plan_to_watch, 'plan_to_watch', '📋')}
        {renderList('Completed', lists.completed, 'completed', '✅')}
      </div>
    </div>
  );
}

export default function MyListsPage() {
  return (
    <ProtectedRoute>
      <MyLists />
    </ProtectedRoute>
  );
}
