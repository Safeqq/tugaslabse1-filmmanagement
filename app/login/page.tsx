'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password harus diisi'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Account created successfully! Please sign in.');
    }
  }, [searchParams]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      setError('');
      const response = await api.post('/auth/login', data);
      
      if (response.data.success) {
        const { token, role } = response.data.data;
        
        // Get user info
        const meResponse = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (meResponse.data.success) {
          const userInfo = meResponse.data.data.personal_info;
          setAuth(userInfo, token);
          router.push('/films');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome <span className="gradient-text">Back</span>
          </h1>
          <p className="text-gray-400">Sign in to continue your journey</p>
        </div>

        <div className="glass p-8 rounded-2xl">
          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-lg mb-6 animate-fade-in">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                {...register('password')}
                type="password"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition-all btn-glow"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-orange-500 hover:text-orange-400 font-medium">
              Create Account
            </Link>
          </p>

          {/* Demo Account Info */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-500 text-center mb-3">Demo Account</p>
            <div className="bg-gray-800/30 rounded-lg p-3 text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Email:</span>
                <span className="text-gray-300">atmin@email.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Password:</span>
                <span className="text-gray-300">myatmin123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
