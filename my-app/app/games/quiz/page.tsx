'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function JoinRoomForm() {
  const router = useRouter()
  const [roomId, setRoomId] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  // 🔥 Function to join room (calls backend route)
  async function joinRoom(roomId: string, password: string) {
    const res = await fetch('/api/join-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, password }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to join room')
    return data
  }

  // ⚡ Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!roomId.trim()) return setError('Room ID is required')
    if (!password) return setError('Password is required')
    

    try {
      setLoading(true)
      const data = await joinRoom(roomId.trim(), password)

      if (data.message === 'Already joined' || data.message === 'Joined successfully') {
        sessionStorage.setItem(`room_access_${roomId}`, data.accessToken);
        // ✅ Redirect to room page
        router.push(`/games/quiz/${data.room.id}`)
      } else {
        setError(data.error || 'Unexpected response')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to join room')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-850/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-lg"
        aria-label="Join room form"
      >
        <h2 className="text-2xl font-semibold mb-2">Join a Room</h2>
        <p className="text-sm text-gray-400 mb-6">
          Enter the Room ID and password to join.
        </p>

        {/* Room ID Input */}
        <label className="block mb-4">
          <span className="text-sm text-gray-300">Room ID</span>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="e.g. ROOM-1234"
            className="mt-2 w-full rounded-md border px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoComplete="off"
          />
        </label>

        {/* Password Input */}
        <label className="block mb-2 relative">
          <span className="text-sm text-gray-300">Password</span>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-2 w-full rounded-md border px-3 py-2 pr-12 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoComplete="current-password"
          />

          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-8 inline-flex items-center gap-2 text-sm text-gray-400 focus:outline-none"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </label>

        {/* Error */}
        {error && (
          <div className="mb-3 text-sm text-red-400 bg-red-900/30 p-2 rounded">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 px-4 py-2 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60"
        >
          {loading ? 'Joining...' : 'Join Room'}
        </button>

        <div className="mt-4 text-xs text-gray-500 text-center">
          By joining you agree to follow the room rules.{' '}
          <span className="text-gray-400">Safe and respectful space only.</span>
        </div>
      </form>
    </div>
  )
}
