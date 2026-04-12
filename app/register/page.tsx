'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import Link from 'next/link';

const registerSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  display_name: z.string().min(3, 'Display name minimal 3 karakter'),
  bio: z.string().optional(),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      setError('');
      const response = await api.post('/auth/register', {
        username: data.username,
        email: data.email,
        display_name: data.display_name,
        bio: data.bio || '',
        password: data.password,
      });
      
      if (response.data.success) {
        router.push('/login?registered=true');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Create <span className="gradient-text">Account</span>
          </h1>
          <p className="text-gray-400">Join the community of film enthusiasts</p>
        </div>

        <div className="glass p-8 rounded-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                {...register('username')}
                type="text"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="johndoe"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

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
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <input
                {...register('display_name')}
                type="text"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="John Doe"
              />
              {errors.display_name && (
                <p className="text-red-500 text-sm mt-1">{errors.display_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio (Optional)</label>
              <textarea
                {...register('bio')}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                rows={3}
                placeholder="Tell us about yourself..."
              />
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

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition-all btn-glow"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-500 hover:text-orange-400 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
