// src/app/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle Function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Dynamic Classes based on mode
  const theme = {
    bg: darkMode ? 'bg-slate-900' : 'bg-gray-50',
    text: darkMode ? 'text-gray-100' : 'text-gray-900',
    cardBg: darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100',
    cardText: darkMode ? 'text-gray-300' : 'text-gray-600',
    heroGradient: darkMode ? 'from-blue-900 to-slate-900' : 'from-blue-600 to-indigo-700',
    navBg: darkMode ? 'bg-slate-900/90' : 'bg-white/90',
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 ${theme.bg} ${theme.text}`}>
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b ${darkMode ? 'border-slate-800' : 'border-gray-200'} ${theme.navBg}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            CivicConnect
          </div>
          
          {/* Dark Mode Switch */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {darkMode ? (
              // Sun Icon
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              // Moon Icon
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className={`pt-32 pb-20 px-6 text-center bg-gradient-to-br ${theme.heroGradient} text-white`}>
        <div className="max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-sm font-semibold mb-6 backdrop-blur-sm">
            AI-Powered Community Management
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Fix Your Neighborhood.<br/> Find Local Work.
          </h1>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto font-light">
            We use AI to route your complaints: Government issues go to the officials, Service needs go to local freelancers.
          </p>
        </div>
      </header>

      {/* --- ROLE SELECTION CARDS --- */}
      <section className="px-6 -mt-16 pb-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          
          {/* Card 1: Citizen / Job Seeker */}
          <div className={`p-8 rounded-2xl shadow-xl border-t-4 border-blue-500 transform hover:-translate-y-2 transition-all duration-300 ${theme.cardBg}`}>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">🏙️</span>
            </div>
            <h2 className={`text-2xl font-bold mb-3 ${theme.text}`}>Citizen & Job Seeker</h2>
            <p className={`mb-8 leading-relaxed ${theme.cardText}`}>
              Report broken streetlights, potholes, or garbage. Or, if you are a skilled worker (plumber, mechanic), find local jobs instantly.
            </p>
            <Link href="/dashboard" className="block w-full text-center py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg hover:shadow-blue-500/50 transition">
              Enter Portal &rarr;
            </Link>
          </div>

          {/* Card 2: Admin */}
          <div className={`p-8 rounded-2xl shadow-xl border-t-4 border-purple-500 transform hover:-translate-y-2 transition-all duration-300 ${theme.cardBg}`}>
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">🛡️</span>
            </div>
            <h2 className={`text-2xl font-bold mb-3 ${theme.text}`}>Administration</h2>
            <p className={`mb-8 leading-relaxed ${theme.cardText}`}>
              Monitor city issues, oversee AI classifications, manage users, and analyze community data.
            </p>
            <Link href="/admin" className={`block w-full text-center py-4 rounded-xl font-bold border-2 transition ${darkMode ? 'border-gray-600 text-white hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
              Admin Login
            </Link>
          </div>

        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h3 className={`text-center text-2xl font-bold mb-12 ${theme.text}`}>How It Works</h3>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            { title: "1. Report", icon: "📸", desc: "Snap a photo of the problem." },
            { title: "2. AI Sorts", icon: "🤖", desc: "Our AI decides: Govt or Private?" },
            { title: "3. Solved", icon: "✅", desc: "Officials fix it, or Locals are hired." }
          ].map((item, idx) => (
            <div key={idx} className={`p-6 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`}>
              <div className="text-4xl mb-4">{item.icon}</div>
              <h4 className={`text-xl font-bold mb-2 ${theme.text}`}>{item.title}</h4>
              <p className={theme.cardText}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}