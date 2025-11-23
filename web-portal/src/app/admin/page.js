// src/app/admin/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For redirecting
import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';

export default function AdminDashboard() {
  const { darkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 1. SECURITY CHECK (The Bouncer) ---
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
      // No user? Go to login
      router.push('/login');
    } else {
      const userData = JSON.parse(storedUser);
      
      // User exists, but are they an ADMIN?
      if (userData.role !== 'admin') {
        alert("ACCESS DENIED: You are not an Admin.");
        router.push('/dashboard'); // Kick them to the normal dashboard
      } else {
        setUser(userData);
        setLoading(false);
      }
    }
  }, [router]);

  // --- MOCK DATA ---
  const [reports, setReports] = useState([
    { id: 101, title: "Broken Streetlight", location: "Sector 4", category: "government", status: "pending", date: "2025-10-01" },
    { id: 102, title: "Leaking Tap", location: "Block A", category: "service", status: "open", date: "2025-10-02" },
    { id: 103, title: "Garbage Pileup", location: "Market Rd", category: "government", status: "resolved", date: "2025-10-03" },
    { id: 104, title: "AC Repair", location: "House 22", category: "service", status: "in-progress", date: "2025-10-04" },
  ]);

  // --- THEME ENGINE (Darker Fonts Applied) ---
  const theme = {
    bg: darkMode ? 'bg-slate-950' : 'bg-gray-100',
    text: darkMode ? 'text-gray-100' : 'text-gray-900',
    card: darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200',
    navBg: darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-gray-200',
    tableHeader: darkMode ? 'bg-slate-800 text-gray-300' : 'bg-gray-200 text-gray-800', // Darker text
    tableRow: darkMode ? 'border-slate-800 hover:bg-slate-800/50' : 'border-gray-200 hover:bg-gray-100',
  };

  const deleteReport = (id) => {
    if(confirm("Are you sure you want to delete this report?")) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  // Wait for security check
  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-xl">Verifying Admin Access...</div>;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.bg} ${theme.text}`}>
      
      {/* NAVBAR */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b px-8 py-4 flex justify-between items-center ${theme.navBg}`}>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            CivicConnect
          </Link>
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200 shadow-sm">
            ADMINISTRATOR
          </span>
        </div>
        
        <div className="flex gap-4">
             <button onClick={toggleTheme} className={`p-2 rounded-full transition-all ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
               {darkMode ? '☀️' : '🌙'}
             </button>
             <button onClick={() => { localStorage.removeItem('user'); router.push('/login'); }} className="text-sm font-bold text-red-600 hover:underline">
               Logout
             </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Reports", val: reports.length, color: "text-blue-600" },
            { label: "Govt Issues", val: reports.filter(r => r.category === 'government').length, color: "text-orange-600" },
            { label: "Service Jobs", val: reports.filter(r => r.category === 'service').length, color: "text-green-600" },
            { label: "Resolved", val: reports.filter(r => r.status === 'resolved').length, color: "text-purple-600" },
          ].map((stat, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border shadow-md ${theme.card}`}>
              <div className={`text-sm font-bold mb-1 opacity-80`}>{stat.label}</div>
              <div className={`text-4xl font-extrabold ${stat.color}`}>{stat.val}</div>
            </div>
          ))}
        </div>

        {/* DATA TABLE */}
        <div className={`rounded-2xl border shadow-xl overflow-hidden ${theme.card}`}>
          <div className={`p-6 border-b flex justify-between items-center ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
            <h2 className="text-xl font-bold">Master Report List</h2>
            <button className="text-sm bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-md">
              Export CSV
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`text-xs uppercase tracking-wider font-bold ${theme.tableHeader}`}>
                  <th className="p-4">ID</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className={`border-b transition font-medium ${theme.tableRow}`}>
                    <td className="p-4 font-mono text-sm opacity-70">#{report.id}</td>
                    <td className="p-4 text-base">{report.title}</td>
                    <td className="p-4 text-sm opacity-90">{report.location}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-extrabold uppercase ${report.category === 'government' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                        {report.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-extrabold capitalize border ${report.status === 'resolved' ? 'bg-gray-100 text-gray-700 border-gray-300' : report.status === 'open' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm opacity-80">{report.date}</td>
                    <td className="p-4 text-right space-x-3">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-bold hover:underline">Edit</button>
                      <button onClick={() => deleteReport(report.id)} className="text-red-600 hover:text-red-800 text-sm font-bold hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}