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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching film lists...');
      console.log('Auth token present:', !!localStorage.getItem('token'));
      
      // First, get current user info to get user ID
      const meResponse = await api.get('/auth/me');
      console.log('Me response:', meResponse.data);
      
      if (!meResponse.data.success) {
        throw new Error('Failed to get user info');
      }
      
      const userId = meResponse.data.data.personal_info.id;
      console.log('User ID:', userId);
      
      // Then get user detail which includes film_lists
      const userResponse = await api.get(`/users/${userId}`);
      console.log('User detail response:', userResponse.data);
      
      if (userResponse.data.success) {
        const filmLists = userResponse.data.data.film_lists || [];
        console.log(`Found ${filmLists.length} items in film lists`);
        
        // Fetch all films to get complete details
        const filmsResponse = await api.get('/films', { params: { take: 100, page: 1 } });
        const allFilms = filmsResponse.data.success ? filmsResponse.data.data : [];
        console.log(`Fetched ${allFilms.length} films for matching`);
        
        // Create a map of film titles to film details
        const filmMap = new Map();
        allFilms.forEach((film: any) => {
          filmMap.set(film.title.toLowerCase(), film);
        });
        
        // Group by list_status and enrich with film details
        const grouped: { [key: string]: FilmListWithDetails[] } = {
          watching: [],
          completed: [],
          plan_to_watch: [],
        };
        
        filmLists.forEach((item: any, index: number) => {
          console.log(`Processing item ${index + 1}:`, item);
          
          // Find matching film by title
          const filmDetail = filmMap.get(item.film_title?.toLowerCase());
          console.log('Matched film detail:', filmDetail);
          
          // Convert API response format to our interface
          const filmListItem: FilmListWithDetails = {
            id: item.id || `temp-${index}`,
            user_id: userId,
            film_id: filmDetail?.id || '',
            film_title: item.film_title,
            list_status: item.list_status,
            visibility: item.visibility || 'public',
            film: filmDetail ? {
              id: filmDetail.id,
              title: filmDetail.title,
              images: filmDetail.images || [],
              average_rating: filmDetail.average_rating || 0,
            } : undefined,
          };
          
          if (filmListItem.list_status && grouped[filmListItem.list_status]) {
            grouped[filmListItem.list_status].push(filmListItem);
          } else {
            console.warn('Unknown list_status:', filmListItem.list_status, 'Item:', item);
          }
        });
        
        console.log('Grouped lists:', grouped);
        console.log('Total by status:', {
          watching: grouped.watching.length,
          plan_to_watch: grouped.plan_to_watch.length,
          completed: grouped.completed.length,
        });
        
        setLists(grouped);
      } else {
        throw new Error(userResponse.data.message || 'Failed to fetch user details');
      }
      
    } catch (error: any) {
      console.error('❌ Error fetching lists:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else {
        setError(
          error.response?.data?.error || 
          error.response?.data?.message || 
          error.message ||
          'Failed to load your lists.'
        );
      }
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

  if (!mounted || loading) {
    return <LoadingSpinner />;
  }

  const renderList = (title: string, items: FilmListWithDetails[], status: string, icon: string) => {
    if (!mounted) return null;
    
    return (
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
                          const nextEl = e.currentTarget.nextElementSibling;
                          if (nextEl) nextEl.classList.remove('hidden');
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
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-3 gradient-text">My Film Lists</h1>
          <p className="text-gray-400 text-lg">Manage your personal film collection</p>
        </div>

        {error && (
          <div className="glass-card border-l-4 border-red-500 px-6 py-4 mb-8">
            <p className="text-red-400 font-medium mb-3">❌ {error}</p>
            <div className="text-gray-400 text-sm space-y-2">
              <p className="font-medium">Troubleshooting:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                <li>Make sure you're logged in</li>
                <li>Try adding a film to your list from the film detail page</li>
                <li>Check browser console (F12) for detailed error logs</li>
                <li>If error persists, try logging out and logging in again</li>
              </ul>
            </div>
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
