'use client';
import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [spins, setSpins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpins = async () => {
      const res = await fetch('/api/spin/get-all');
      const data = await res.json();
      setSpins(data.spins || []);
      setLoading(false);
    };
    fetchSpins();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-white">
      Loading...
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🎯 Admin Dashboard</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-zinc-800 rounded-lg">
          <thead className="bg-zinc-800">
            <tr>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Prize</th>
              <th className="p-3 text-left">Color</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {spins.map((spin, idx) => (
              <tr key={idx} className="border-t border-zinc-800 hover:bg-zinc-900">
                <td className="p-3">{spin.user?.username || 'N/A'}</td>
                <td className="p-3">{spin.user?.email || 'N/A'}</td>
                <td className="p-3">{spin.prize_label}</td>
                <td className="p-3">
                  <span
                    className="px-3 py-1 rounded-md text-black font-semibold"
                    style={{ backgroundColor: spin.prize_color }}
                  >
                    {spin.prize_color}
                  </span>
                </td>
                <td className="p-3 text-zinc-400">
                  {new Date(spin.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Future controls */}
      <div className="mt-8 flex justify-center gap-4">
        <button className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition">
          Manage Pools
        </button>
        <button className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition">
          System Controls
        </button>
      </div>
    </div>
  );
}
