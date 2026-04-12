'use client';

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (requireAdmin && !isAdmin()) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, requireAdmin, router]);

  if (!isAuthenticated() || (requireAdmin && !isAdmin())) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
}
