'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { FilmList } from '@/lib/types';
import LoadingSpinner from '@/components/LoadingSpinner';

function MyLists() {
  const [lists, setLists] = useState<{ [key: string]: FilmList[] }>({
    watching: [],
    completed: [],
    plan_to_watch: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      // Note: API endpoint untuk get user's film lists perlu disesuaikan
      // Untuk sementara kita asumsikan endpoint ini ada
      const response = await api.get('/film-lists');
      
      if (response.data.success) {
        // Group by list_status
        const grouped = {
          watching: [],
          completed: [],
          plan_to_watch: [],
        };
        
        response.data.data.forEach((item: FilmList) => {
          if (grouped[item.list_status]) {
            grouped[item.list_status].push(item);
          }
        });
        
        setLists(grouped);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
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
        fetchLists();
      }
    } catch (error) {
      console.error('Error updating visibility:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderList = (title: string, items: FilmList[], status: string, icon: string) => (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{icon}</span>
        <h2 className="text-3xl font-bold gradient-text">{title}</h2>
        <span className="text-gray-400">({items.length})</span>
      </div>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="glass-card p-6 hover:scale-105 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg group-hover:text-orange-500 transition-colors line-clamp-2">
                  {item.film_title || 'Film'}
                </h3>
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                  item.visibility === 'public' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {item.visibility === 'public' ? '🌐 Public' : '🔒 Private'}
                </span>
              </div>
              <button
                onClick={() => handleToggleVisibility(item.id, item.visibility)}
                className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-gray-600 rounded-lg text-sm transition-all"
              >
                Make {item.visibility === 'public' ? 'Private' : 'Public'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-400 text-lg">No films in this list yet.</p>
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
