'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuthStore();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center font-bold text-xl">
              F
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              FilmHub
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/films" 
              className="text-gray-300 hover:text-orange-500 transition-colors font-medium"
            >
              Browse
            </Link>
            <Link 
              href="/genres" 
              className="text-gray-300 hover:text-orange-500 transition-colors font-medium"
            >
              Genres
            </Link>

            {isAuthenticated() ? (
              <>
                {isAdmin() && (
                  <Link 
                    href="/admin" 
                    className="text-gray-300 hover:text-orange-500 transition-colors font-medium"
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  href="/my-lists" 
                  className="text-gray-300 hover:text-orange-500 transition-colors font-medium"
                >
                  My Lists
                </Link>
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <div className="text-gray-400">Welcome,</div>
                    <div className="text-orange-500 font-medium">{user?.display_name || user?.username}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-2 rounded-lg font-medium transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-orange-500 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-6 py-2 rounded-lg font-medium transition-all btn-glow"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-orange-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800 animate-fade-in">
            <div className="flex flex-col gap-3">
              <Link href="/films" className="text-gray-300 hover:text-orange-500 py-2">
                Browse
              </Link>
              <Link href="/genres" className="text-gray-300 hover:text-orange-500 py-2">
                Genres
              </Link>
              {isAuthenticated() ? (
                <>
                  {isAdmin() && (
                    <Link href="/admin" className="text-gray-300 hover:text-orange-500 py-2">
                      Admin
                    </Link>
                  )}
                  <Link href="/my-lists" className="text-gray-300 hover:text-orange-500 py-2">
                    My Lists
                  </Link>
                  <div className="text-sm text-gray-400 py-2">
                    {user?.display_name || user?.username}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-300 hover:text-orange-500 py-2">
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
