'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Genre } from '@/lib/types';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const response = await api.get('/genres');
      if (response.data.success) {
        setGenres(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Film Genres</h1>
          <p className="text-gray-400">Browse all available genres</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {genres.map((genre) => (
            <div 
              key={genre.id} 
              className="glass-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-center h-full">
                <h3 className="text-lg font-semibold text-center group-hover:text-orange-500 transition-colors">
                  {genre.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
