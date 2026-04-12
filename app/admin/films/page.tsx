'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Genre } from '@/lib/types';

function AddFilm() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [images, setImages] = useState<FileList | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    synopsis: '',
    airing_status: 'not_yet_aired',
    total_episodes: 12,
    release_date: '',
    release_time: '00:00',
  });

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await api.get('/genres');
      if (response.data.success) {
        setGenres(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setLoading(true);
    setError('');
    
    const combinedDateTime = formData.release_date && formData.release_time
      ? `${formData.release_date} ${formData.release_time}:00`
      : `${formData.release_date} 00:00:00`;
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('synopsis', formData.synopsis);
    formDataToSend.append('airing_status', formData.airing_status);
    formDataToSend.append('total_episodes', formData.total_episodes.toString());
    formDataToSend.append('release_date', combinedDateTime); // sudah digabung
    formDataToSend.append('genres', selectedGenres.join(','));
    
    if (images) {
      Array.from(images).forEach((image) => {
        formDataToSend.append('images', image);
      });
    }
    
    const response = await api.post('/films', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.success) {
      setSuccess('Film berhasil ditambahkan!');
      setFormData({
        title: '',
        synopsis: '',
        airing_status: 'not_yet_aired',
        total_episodes: 12,
        release_date: '',
        release_time: '00:00',
      });
      setSelectedGenres([]);
      setImages(null);
      setTimeout(() => setSuccess(''), 3000);
    }
  } catch (err: any) {
    setError(err.response?.data?.error || err.response?.data?.message || 'Gagal menambahkan film');
  } finally {
    setLoading(false);
  }
};

  const handleGenreToggle = (genreId: string) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Add New Film</h1>
          <p className="text-gray-400">Add a new film to the catalog</p>
        </div>

        {success && (
          <div className="glass-card border-l-4 border-green-500 px-6 py-4 mb-6 animate-slide-up">
            <p className="text-green-400 font-medium">{success}</p>
          </div>
        )}

        {error && (
          <div className="glass-card border-l-4 border-red-500 px-6 py-4 mb-6 animate-slide-up">
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        )}

        <div className="glass-card p-8 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Synopsis</label>
              <textarea
                value={formData.synopsis}
                onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                rows={5}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Airing Status</label>
                <select
                  value={formData.airing_status}
                  onChange={(e) => setFormData({ ...formData, airing_status: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                >
                  <option 
                  className='bg-black'
                  value="not_yet_aired">Not Yet Aired</option>
                  <option 
                  className='bg-black'
                  value="airing">Airing</option>
                  <option 
                  className='bg-black'
                  value="finished_airing">Finished Airing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Total Episodes</label>
                <input
                  type="number"
                  min="1"
                  value={formData.total_episodes}
                  onChange={(e) => setFormData({ ...formData, total_episodes: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Release Date & Time</label>
                <div className="grid grid-cols-2 gap-3">
                <input
                type="date"
                value={formData.release_date}
                onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                required
                />
                <input
                type="time"
                value={formData.release_time}
                onChange={(e) => setFormData({ ...formData, release_time: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500         focus:border-transparent transition-all"
                required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImages(e.target.files)}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white file:cursor-pointer hover:file:bg-orange-600"
              />
              <p className="text-sm text-gray-400 mt-2">You can select multiple images</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">
                Genres (Select multiple)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-4 bg-white/5 border border-gray-600 rounded-lg custom-scrollbar">
                {genres.map((genre) => (
                  <label 
                    key={genre.id} 
                    className="flex items-center gap-2 cursor-pointer hover:text-orange-500 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre.id)}
                      onChange={() => handleGenreToggle(genre.id)}
                      className="w-4 h-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 bg-white/5"
                    />
                    <span className="text-sm">{genre.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || selectedGenres.length === 0}
              className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding Film...' : 'Add Film'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminFilmsPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AddFilm />
    </ProtectedRoute>
  );
}
