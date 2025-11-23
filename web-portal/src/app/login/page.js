// src/app/login/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/theme-provider';
import Link from 'next/link';

export default function LoginPage() {
  const { darkMode, toggleTheme } = useTheme();
  const router = useRouter();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Note: Assuming backend runs on 5000
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Cannot connect to server. Ensure Backend is running.');
    }
  };

  // Theme Styles
  const theme = {
    bg: darkMode ? 'bg-slate-950' : 'bg-gray-100',
    text: darkMode ? 'text-white' : 'text-gray-900',
    card: darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/80 border-gray-200',
    input: darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900',
    label: darkMode ? 'text-gray-300' : 'text-gray-700',
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${theme.bg}`}>
      
      {/* Background decoration (Optional) */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none`}>
          <div className={`absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl mix-blend-multiply ${darkMode ? 'opacity-20' : 'opacity-70'}`}></div>
          <div className={`absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl mix-blend-multiply ${darkMode ? 'opacity-20' : 'opacity-70'}`}></div>
      </div>

      <div className={`relative w-full max-w-md p-8 rounded-3xl shadow-2xl border backdrop-blur-xl ${theme.card}`}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            CivicConnect
          </h1>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to manage your community
          </p>
        </div>

        {/* Theme Toggle (Small, in corner) */}
        <button onClick={toggleTheme} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition">
           {darkMode ? '☀️' : '🌙'}
        </button>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-3 rounded-xl mb-6 text-sm text-center font-bold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block text-sm font-bold mb-2 ${theme.label}`}>Email Address</label>
            <input 
              name="email" type="email" required placeholder="user@example.com"
              className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm font-medium ${theme.input}`}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 ${theme.label}`}>Password</label>
            <input 
              name="password" type="password" required placeholder="••••••••"
              className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm font-medium ${theme.input}`}
              onChange={handleChange}
            />
          </div>

          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition transform hover:-translate-y-0.5">
            Sign In
          </button>
        </form>

        <p className={`mt-8 text-center text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Don't have an account? <Link href="/register" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">Register Now</Link>
        </p>
      </div>
    </div>
  );
}