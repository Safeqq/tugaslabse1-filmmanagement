'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

function AdminDashboard() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your film catalog</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/genres"
            className="glass-card p-8 hover:scale-105 transition-all duration-300 group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎭</div>
            <h3 className="text-2xl font-semibold mb-2 group-hover:text-orange-500 transition-colors">
              Manage Genres
            </h3>
            <p className="text-gray-400">Add, edit, and view all genres</p>
          </Link>

          <Link
            href="/admin/films"
            className="glass-card p-8 hover:scale-105 transition-all duration-300 group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎬</div>
            <h3 className="text-2xl font-semibold mb-2 group-hover:text-orange-500 transition-colors">
              Manage Films
            </h3>
            <p className="text-gray-400">Add new films to the catalog</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
