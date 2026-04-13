'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Film, Review } from '@/lib/types';
import { useAuthStore } from '@/lib/store';
import { getFilmPosterUrl } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function FilmDetailPage() {
  const params = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [addingToList, setAddingToList] = useState(false);
  const [reactingTo, setReactingTo] = useState<string | null>(null);

  useEffect(() => {
    fetchFilmDetail();
  }, [params.id]);

  const fetchFilmDetail = async () => {
    try {
      setLoading(true);
      const filmRes = await api.get(`/films/${params.id}`);
      
      if (filmRes.data.success) {
        setFilm(filmRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching film:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated()) return;

    try {
      setSubmitting(true);
      const response = await api.post('/reviews', {
        film_id: params.id,
        rating,
        comment: reviewText,
      });
      
      if (response.data.success) {
        setReviewText('');
        setRating(5);
        fetchFilmDetail();
        alert('Review submitted successfully!');
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReaction = async (reviewId: string, status: 'like' | 'dislike') => {
    if (!isAuthenticated()) {
      alert('Please login to react to reviews');
      return;
    }

    try {
      setReactingTo(reviewId);
      const response = await api.post('/reactions', { 
        review_id: reviewId, 
        status 
      });
      
      if (response.data.success) {
        // Refresh film data to get updated reactions
        await fetchFilmDetail();
      }
    } catch (error: any) {
      console.error('Error adding reaction:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to add reaction';
      alert(errorMsg);
    } finally {
      setReactingTo(null);
    }
  };

  const handleAddToList = async (listStatus: 'watching' | 'completed' | 'plan_to_watch') => {
    if (!isAuthenticated()) {
      alert('Please login to add films to your list');
      return;
    }

    try {
      setAddingToList(true);
      
      // Log untuk debugging
      console.log('Adding to list:', {
        film_id: params.id,
        list_status: listStatus,
        visibility: 'public'
      });
      
      const response = await api.post('/film-lists', {
        film_id: params.id,
        list_status: listStatus,
        visibility: 'public',
      });
      
      console.log('Add to list response:', response.data);
      
      if (response.data.success) {
        const statusText = listStatus === 'plan_to_watch' ? 'Plan to Watch' : 
                          listStatus === 'watching' ? 'Watching' : 'Completed';
        alert(`✅ Successfully added to ${statusText} list!`);
      } else {
        alert(response.data.message || 'Failed to add to list');
      }
    } catch (error: any) {
      console.error('Error adding to list:', error);
      console.error('Error response:', error.response?.data);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to add to list';
      alert(`❌ ${errorMsg}`);
    } finally {
      setAddingToList(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!film) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Film Not Found</h2>
          <p className="text-gray-400">The film you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <div className="relative h-[400px] md:h-[500px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          {film.images && film.images.length > 0 ? (
            <img
              src={getFilmPosterUrl(film.images)}
              alt={film.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-900"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* Poster */}
            <div className="w-48 md:w-56 flex-shrink-0">
              <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                {film.images && film.images.length > 0 ? (
                  <img
                    src={getFilmPosterUrl(film.images)}
                    alt={film.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={film.images && film.images.length > 0 ? "hidden w-full h-full bg-gray-800 flex items-center justify-center" : "w-full h-full bg-gray-800 flex items-center justify-center"}>
                  <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{film.title}</h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {film.average_rating && film.average_rating > 0 && (
                  <div className="flex items-center gap-2 bg-orange-500 px-3 py-1 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold">{film.average_rating.toFixed(2)}</span>
                  </div>
                )}
                
                <span className="px-3 py-1 bg-gray-800 rounded-lg text-sm capitalize">
                  {film.airing_status.replace(/_/g, ' ')}
                </span>
                
                <span className="px-3 py-1 bg-gray-800 rounded-lg text-sm">
                  {film.total_episodes} Episodes
                </span>
              </div>

              {film.genres && film.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {film.genres.map((genre) => (
                    <span key={genre.id} className="px-3 py-1 bg-orange-500/20 text-orange-500 rounded-lg text-sm border border-orange-500/30">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {isAuthenticated() && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAddToList('watching')}
                    disabled={addingToList}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingToList ? 'Adding...' : '📺 Watching'}
                  </button>
                  <button
                    onClick={() => handleAddToList('plan_to_watch')}
                    disabled={addingToList}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingToList ? 'Adding...' : '📋 Plan to Watch'}
                  </button>
                  <button
                    onClick={() => handleAddToList('completed')}
                    disabled={addingToList}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingToList ? 'Adding...' : '✅ Completed'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <div className="glass p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed">{film.synopsis}</p>
              <p className="text-gray-500 text-sm mt-4">
                Release Date: {new Date(film.release_date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="glass p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-6">Reviews</h2>

              {/* Review Form */}
              {isAuthenticated() && (
                <form onSubmit={handleSubmitReview} className="mb-8 p-4 bg-gray-800/50 rounded-lg">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Rating (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-24 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts about this film..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 resize-none"
                    rows={4}
                    required
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {film.reviews && film.reviews.length > 0 ? (
                  film.reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-gray-800/30 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-semibold">{review.user?.username || 'Anonymous'}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-orange-500">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="font-bold">{review.rating}/10</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3">{review.comment}</p>
                      
                      {/* Reaction Buttons with Counts */}
                      <div className="flex items-center gap-4">
                        {isAuthenticated() && (
                          <>
                            <button
                              onClick={() => handleReaction(review.id, 'like')}
                              disabled={reactingTo === review.id}
                              className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-sm transition-colors disabled:opacity-50"
                            >
                              <span className="text-lg">👍</span>
                              <span className="text-green-400 font-medium">
                                {review.like_count || 0}
                              </span>
                            </button>
                            <button
                              onClick={() => handleReaction(review.id, 'dislike')}
                              disabled={reactingTo === review.id}
                              className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-sm transition-colors disabled:opacity-50"
                            >
                              <span className="text-lg">👎</span>
                              <span className="text-red-400 font-medium">
                                {review.dislike_count || 0}
                              </span>
                            </button>
                          </>
                        )}
                        
                        {!isAuthenticated() && (
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              👍 {review.like_count || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              👎 {review.dislike_count || 0}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-xl sticky top-20">
              <h3 className="text-xl font-bold mb-4">Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className="ml-2 capitalize">{film.airing_status.replace(/_/g, ' ')}</span>
                </div>
                <div>
                  <span className="text-gray-400">Episodes:</span>
                  <span className="ml-2">{film.total_episodes}</span>
                </div>
                <div>
                  <span className="text-gray-400">Rating:</span>
                  <span className="ml-2">{film.average_rating ? film.average_rating.toFixed(2) : 'N/A'}</span>
                </div>
                {film.genres && film.genres.length > 0 && (
                  <div>
                    <span className="text-gray-400">Genres:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {film.genres.map((genre) => (
                        <span key={genre.id} className="px-2 py-1 bg-gray-800 rounded text-xs">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
