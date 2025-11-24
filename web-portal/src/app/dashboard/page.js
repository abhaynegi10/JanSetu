// src/app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';

export default function UserDashboard() {
  const { darkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // REAL DATA STATE
  const [reports, setReports] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // FORM STATE
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState(null); // 👈 New State for File

  // --- AUTH & FETCH ---
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(storedUser));
      fetchReports();
      setLoading(false);
    }
  }, [router]);

  const fetchReports = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/reports');
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  // --- DELETE FUNCTION ---
  const handleDelete = async (reportId) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        // Remove from list immediately
        setReports(reports.filter(r => r.id !== reportId));
        alert("Deleted successfully");
      }
    } catch (err) {
      alert("Error deleting report");
    }
  };

  // --- SUBMIT FUNCTION (Now with File) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRefreshing(true);

    // 1. Prepare FormData (Required for Files)
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('location', location);
    formData.append('user_id', user.id);
    if (file) {
      formData.append('image', file); // 'image' must match backend middleware
    }

    try {
      const res = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        // Note: Do NOT set Content-Type header when sending FormData. Fetch does it automatically.
        body: formData, 
      });

      if (res.ok) {
        setTitle('');
        setDesc('');
        setLocation('');
        setFile(null);
        // Reset file input manually
        document.getElementById('fileInput').value = ""; 
        fetchReports();
        alert("Report Submitted Successfully!");
      } else {
        alert("Failed to submit report.");
      }
    } catch (err) {
      alert("Server error.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const theme = {
    bg: darkMode ? 'bg-slate-950' : 'bg-gray-100',
    text: darkMode ? 'text-gray-100' : 'text-gray-900',
    card: darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200',
    input: darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400',
    subText: darkMode ? 'text-gray-400' : 'text-gray-600',
    navBg: darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-gray-200'
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.bg} ${theme.text}`}>
      
      {/* NAVBAR */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b px-8 py-5 flex justify-between items-center ${theme.navBg}`}>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
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
            <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-700">Logout</button>
        </div>
      </nav>

      <main className="w-[95%] max-w-[1800px] mx-auto p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* LEFT: FORM */}
        <div className={`md:col-span-4 lg:col-span-4 h-fit sticky top-28`}>
          <div className={`p-8 rounded-3xl shadow-xl border ${theme.card}`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              📢 <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Report Issue</span>
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme.subText}`}>Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm ${theme.input}`} placeholder="e.g. Broken Pipe" />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme.subText}`}>Location</label>
                <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)}
                  className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm ${theme.input}`} placeholder="e.g. Sector 5" />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme.subText}`}>Description</label>
                <textarea required rows="4" value={desc} onChange={(e) => setDesc(e.target.value)}
                  className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm ${theme.input}`} placeholder="Describe details..." />
              </div>
              
              {/* REAL FILE INPUT */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme.subText}`}>Upload Photo (Optional)</label>
                <input 
                  id="fileInput"
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className={`w-full text-sm p-2 border rounded-lg cursor-pointer ${theme.input}`}
                />
              </div>

              <button disabled={isRefreshing} type="submit" className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition transform hover:-translate-y-1 text-lg">
                {isRefreshing ? 'Uploading...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: FEED */}
        <div className="md:col-span-8 space-y-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className={`text-3xl font-bold ${theme.text}`}>📍 Live Community Feed</h2>
          </div>
          
          {reports.map((report) => (
            <div key={report.id} className={`relative overflow-hidden rounded-3xl shadow-lg border hover:shadow-2xl transition duration-300 ${theme.card}`}>
              
              {/* DELETE BUTTON (Top Right) */}
              <button 
                onClick={() => handleDelete(report.id)}
                className="absolute top-4 right-4 z-10 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition"
                title="Delete Report"
              >
                🗑️
              </button>

              {/* IMAGE BLOCK - Uses Real Backend URL */}
              {report.image_url && (
                <div className="w-full h-64 md:h-80 relative bg-gray-200">
                  <img 
                    src={`http://localhost:5000${report.image_url}`} 
                    alt="Report" 
                    className="w-full h-full object-cover"
                    onError={(e) => {e.target.src = "https://via.placeholder.com/800x400?text=Image+Load+Error"}} // Fallback
                  />
                  <div className="absolute top-4 left-4">
                     <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg
                      ${report.category === 'government' ? 'bg-orange-500 text-white' : 'bg-green-600 text-white'}`}>
                      {report.category === 'government' ? '🏛 Government' : '🛠 Service'}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-8">
                <h3 className={`text-2xl font-bold mb-2 ${theme.text}`}>{report.title}</h3>
                <p className={`text-sm flex items-center gap-2 font-medium ${theme.subText}`}>
                  <span>📍 {report.location}</span>
                </p>
                <p className={`text-lg mt-4 mb-6 leading-relaxed ${theme.subText}`}>{report.description}</p>
                
                <div className={`pt-6 border-t flex items-center justify-between ${darkMode ? 'border-slate-800' : 'border-gray-100'}`}>
                   <div className="flex items-center gap-2 text-sm">
                      <span className={`w-3 h-3 rounded-full ${report.category === 'government' ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></span>
                      <span className={theme.subText}>
                        {report.category === 'government' ? 'Pending Govt Action' : 'Open for Workers'}
                      </span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}