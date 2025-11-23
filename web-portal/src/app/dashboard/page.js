// src/app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Import the Global Theme Hook
import { useTheme } from '@/components/theme-provider';

export default function UserDashboard() {
  // 1. USE GLOBAL THEME (No more local state)
  const { darkMode, toggleTheme } = useTheme();
  
  // 2. AUTHENTICATION STATE
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. DUMMY DATA STATE
  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Huge Pothole on Main Road",
      description: "This is causing a lot of traffic and is dangerous for bikes.",
      location: "Sector 4, Main Road",
      category: "government",
      image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop", 
      time: "2 hours ago"
    },
    {
      id: 2,
      title: "Kitchen Tap Leaking",
      description: "Need a plumber urgently, water is wasting.",
      location: "Sector 4, Block B",
      category: "service",
      contact: "555-0123",
      image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800&auto=format&fit=crop",
      time: "5 hours ago"
    }
  ]);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');

  // --- SECURITY CHECK ---
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      // If not logged in, go to Login Page
      router.push('/login');
    } else {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    }
  }, [router]);

  // --- FORM HANDLER ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const isService = desc.toLowerCase().includes('mechanic') || desc.toLowerCase().includes('plumber') || desc.toLowerCase().includes('help');
    
    const randomImg = isService 
      ? "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop"
      : "https://images.unsplash.com/photo-1626863905192-39634d288d6c?q=80&w=800&auto=format&fit=crop"; 

    const newReport = {
      id: Date.now(),
      title: title,
      description: desc,
      location: location,
      category: isService ? 'service' : 'government',
      contact: isService ? "999-888-7777" : null,
      image: randomImg,
      time: "Just now"
    };

    setReports([newReport, ...reports]);
    setTitle('');
    setDesc('');
    setLocation('');
  };

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  // --- STYLING OBJECT (Based on Global darkMode) ---
  const theme = {
    bg: darkMode ? 'bg-slate-950' : 'bg-gray-100',
    text: darkMode ? 'text-gray-100' : 'text-gray-900',
    card: darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200',
    input: darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400',
    subText: darkMode ? 'text-gray-400' : 'text-gray-600',
    navBg: darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-gray-200'
  };

  // Don't show anything until we know who the user is
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500">Loading...</div>;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.bg} ${theme.text}`}>
      
      {/* NAVBAR */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b px-8 py-5 flex justify-between items-center ${theme.navBg}`}>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-80 transition">
            CivicConnect
          </Link>
          <span className={`hidden md:block text-sm px-3 py-1 rounded-full border font-medium ${darkMode ? 'border-slate-700 bg-slate-800 text-gray-300' : 'border-gray-200 bg-gray-100 text-gray-600'}`}>
            Welcome, {user?.name}
          </span>
        </div>

        <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className={`p-3 rounded-full transition-all ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
            {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-700">
                Logout
            </button>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <main className="w-[95%] max-w-[1800px] mx-auto p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: FORM */}
        <div className={`md:col-span-4 lg:col-span-4 h-fit sticky top-28`}>
          <div className={`p-8 rounded-3xl shadow-xl border ${theme.card}`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              📢 <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Report Issue</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme.subText}`}>Title</label>
                <input type="text" required
                  className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm ${theme.input}`}
                  placeholder="e.g. Broken Pipe"
                  value={title} onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme.subText}`}>Location</label>
                <input type="text" required
                  className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm ${theme.input}`}
                  placeholder="e.g. Sector 5"
                  value={location} onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme.subText}`}>Description</label>
                <textarea required rows="4"
                  className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm ${theme.input}`}
                  placeholder="Describe details..."
                  value={desc} onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              {/* Fake Image Upload */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme.subText}`}>Upload Photo</label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${darkMode ? 'border-slate-700 hover:border-slate-500 hover:bg-slate-800' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}>
                   <span className="text-2xl block mb-2">📷</span>
                   <span className="text-sm opacity-70">Click to upload image (Demo)</span>
                </div>
              </div>

              <button type="submit" className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition transform hover:-translate-y-1 text-lg">
                Submit Report
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: FEED */}
        <div className="md:col-span-8 space-y-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className={`text-3xl font-bold ${theme.text}`}>📍 Live Community Feed</h2>
            <span className={`text-sm px-3 py-1 rounded-full ${darkMode ? 'bg-slate-800 text-gray-400' : 'bg-white text-gray-500 shadow-sm'}`}>
              Showing all posts
            </span>
          </div>
          
          {reports.map((report) => (
            <div key={report.id} className={`overflow-hidden rounded-3xl shadow-lg border hover:shadow-2xl transition duration-300 ${theme.card}`}>
              
              {/* IMAGE BLOCK */}
              {report.image && (
                <div className="w-full h-64 md:h-80 relative bg-gray-200">
                  <img 
                    src={report.image} 
                    alt="Report" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                     <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg
                      ${report.category === 'government' 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-green-600 text-white'
                      }`}>
                      {report.category === 'government' ? '🏛 Government' : '🛠 Service'}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-2xl font-bold mb-2 ${theme.text}`}>{report.title}</h3>
                    <p className={`text-sm flex items-center gap-2 font-medium ${theme.subText}`}>
                      <span>📍 {report.location}</span>
                      <span>•</span>
                      <span>🕒 {report.time}</span>
                    </p>
                  </div>
                </div>

                <p className={`text-lg mb-6 leading-relaxed ${theme.subText}`}>{report.description}</p>

                {/* Action Area */}
                <div className={`pt-6 border-t flex items-center justify-between ${darkMode ? 'border-slate-800' : 'border-gray-100'}`}>
                   
                   <div className="flex items-center gap-2 text-sm">
                      <span className={`w-3 h-3 rounded-full ${report.category === 'government' ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></span>
                      <span className={theme.subText}>
                        {report.category === 'government' ? 'Pending Govt Action' : 'Open for Workers'}
                      </span>
                   </div>

                  {report.category === 'service' ? (
                    <button 
                      onClick={() => alert(`Connecting to: ${report.contact}`)}
                      className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 shadow-lg hover:shadow-green-500/30 transition flex items-center gap-2 font-bold"
                    >
                      📞 Accept Job
                    </button>
                  ) : (
                    <button className={`px-6 py-3 rounded-xl border font-medium transition cursor-not-allowed opacity-70 ${darkMode ? 'border-slate-700 text-slate-400' : 'border-gray-200 text-gray-500'}`}>
                      View Status
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}