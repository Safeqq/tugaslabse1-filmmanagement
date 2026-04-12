'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Genre } from '@/lib/types';
import LoadingSpinner from '@/components/LoadingSpinner';

function GenresAdmin() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    fetchGenres();
  }, [page]);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const response = await api.get('/genres/admin', {
        params: { take: 10, page },
      });
      
      if (response.data.success) {
        setGenres(response.data.data);
        if (response.data.meta && response.data.meta.length > 0) {
          setTotalPages(response.data.meta[0].total_page);
        }
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGenre) {
        const response = await api.put(`/genres/${editingGenre.id}`, formData);
        if (response.data.success) {
          alert('Genre berhasil diupdate!');
        }
      } else {
        const response = await api.post('/genres', formData);
        if (response.data.success) {
          alert('Genre berhasil ditambahkan!');
        }
      }
      setShowModal(false);
      setFormData({ name: '' });
      setEditingGenre(null);
      fetchGenres();
    } catch (error: any) {
      console.error('Error saving genre:', error);
      alert(error.response?.data?.error || 'Gagal menyimpan genre');
    }
  };

  const openEditModal = (genre: Genre) => {
    setEditingGenre(genre);
    setFormData({ name: genre.name });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingGenre(null);
    setFormData({ name: '' });
    setShowModal(true);
  };

  if (loading && genres.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-text">Manage Genres</h1>
            <p className="text-gray-400">Add and edit film genres</p>
          </div>
          <button
            onClick={openAddModal}
            className="btn-primary px-6 py-3"
          >
            + Add Genre
          </button>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {genres.map((genre) => (
                  <tr key={genre.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white">{genre.name}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openEditModal(genre)}
                        className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-6 py-2 glass-card hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-300">
              Page <span className="text-orange-500 font-semibold">{page}</span> of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-6 py-2 glass-card hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="glass-card p-8 max-w-md w-full animate-slide-up">
              <h2 className="text-2xl font-bold mb-6 gradient-text">
                {editingGenre ? 'Edit Genre' : 'Add Genre'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="btn-primary flex-1 py-3"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminGenresPage() {
  return (
    <ProtectedRoute requireAdmin>
      <GenresAdmin />
    </ProtectedRoute>
  );
}
