'use client';
import React, { useState } from 'react';

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      onSuccess();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
      <div className="bg-zinc-800 p-8 rounded-2xl shadow-xl w-80">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
        <input
          type="password"
          placeholder="Enter admin password"
          className="w-full px-4 py-2 mb-4 rounded-lg bg-zinc-700 text-white outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
