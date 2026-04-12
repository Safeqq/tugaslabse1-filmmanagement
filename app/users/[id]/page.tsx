'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  film_lists?: Array<{
    film_title: string;
    list_status: string;
  }>;
  reviews?: Array<{
    film: string;
    rating: number;
    comment: string;
  }>;
}

export default function UserProfilePage() {
  const params = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [params.id]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${params.id}`);
      
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <p className="text-xl text-gray-400">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="glass-card p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-4xl font-bold">
                {user.display_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2 gradient-text">{user.display_name}</h1>
                <p className="text-gray-400 text-lg mb-4">@{user.username}</p>
                {user.bio && (
                  <p className="text-gray-300 leading-relaxed">{user.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Film Lists */}
        {user.film_lists && user.film_lists.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📚</span>
              <h2 className="text-3xl font-bold gradient-text">Film Lists</h2>
              <span className="text-gray-400">({user.film_lists.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {user.film_lists.map((item, index) => (
                <div key={index} className="glass-card p-6 hover:scale-105 transition-all duration-300 group">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                    {item.film_title}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full capitalize">
                    {item.list_status.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {user.reviews && user.reviews.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">⭐</span>
              <h2 className="text-3xl font-bold gradient-text">Reviews</h2>
              <span className="text-gray-400">({user.reviews.length})</span>
            </div>
            <div className="space-y-6">
              {user.reviews.map((review, index) => (
                <div key={index} className="glass-card p-6 hover:scale-[1.02] transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-xl">{review.film}</h3>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-lg border border-orange-500/30">
                      <span className="text-yellow-400 text-xl">★</span>
                      <span className="text-white font-bold">{review.rating}</span>
                      <span className="text-gray-400">/10</span>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!user.film_lists || user.film_lists.length === 0) && 
         (!user.reviews || user.reviews.length === 0) && (
          <div className="glass-card p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-400 text-lg">This user hasn't added any films or reviews yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
