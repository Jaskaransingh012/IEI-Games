import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Trophy, Zap, Clock, Users } from 'lucide-react';

export default function QuizWelcome() {
  const [mounted, setMounted] = useState(false);
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setPulseIndex(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const floatingIcons = [
    { Icon: Brain, delay: '0s', duration: '3s' },
    { Icon: Sparkles, delay: '0.5s', duration: '2.5s' },
    { Icon: Trophy, delay: '1s', duration: '3.5s' },
    { Icon: Zap, delay: '0.3s', duration: '2.8s' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-indigo-600/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Floating icons */}
      {floatingIcons.map(({ Icon, delay, duration }, idx) => (
        <div
          key={idx}
          className="absolute opacity-5"
          style={{
            top: `${20 + idx * 20}%`,
            left: `${10 + idx * 15}%`,
            animation: `float ${duration} ease-in-out infinite`,
            animationDelay: delay,
          }}
        >
          <Icon size={48} className="text-blue-400" />
        </div>
      ))}

      {/* Main content */}
      <div className={`relative z-10 max-w-4xl w-full transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Dark glass morphism card */}
        <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 p-8 md:p-12 shadow-purple-900/20">
          {/* Quiz illustration */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <svg width="200" height="200" viewBox="0 0 200 200" className="animate-bounce-slow">
                {/* Quiz character - cute brain with sparkles */}
                <defs>
                  <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Brain body with glow */}
                <ellipse cx="100" cy="100" rx="60" ry="65" fill="url(#brainGradient)" filter="url(#glow)" />
                
                {/* Brain texture lines */}
                <path d="M 70 80 Q 80 75 90 80 T 110 80" stroke="#e0e7ff" strokeWidth="2" fill="none" opacity="0.5" />
                <path d="M 75 95 Q 85 90 95 95 T 115 95" stroke="#e0e7ff" strokeWidth="2" fill="none" opacity="0.5" />
                <path d="M 70 110 Q 80 105 90 110 T 110 110" stroke="#e0e7ff" strokeWidth="2" fill="none" opacity="0.5" />
                
                {/* Cute eyes */}
                <circle cx="85" cy="95" r="8" fill="#1e1b4b" />
                <circle cx="115" cy="95" r="8" fill="#1e1b4b" />
                <circle cx="88" cy="95" r="5" fill="#60a5fa" className="animate-pulse" />
                <circle cx="118" cy="95" r="5" fill="#60a5fa" className="animate-pulse" />
                
                {/* Happy smile */}
                <path d="M 80 115 Q 100 125 120 115" stroke="#e0e7ff" strokeWidth="3" fill="none" strokeLinecap="round" />
                
                {/* Sparkles */}
                <g className="animate-spin-slow" style={{ transformOrigin: '100px 100px' }}>
                  <path d="M 50 50 L 52 52 L 50 54 L 48 52 Z" fill="#fbbf24" className="opacity-80" />
                  <path d="M 150 60 L 153 63 L 150 66 L 147 63 Z" fill="#fbbf24" className="opacity-80" />
                  <path d="M 145 130 L 147 132 L 145 134 L 143 132 Z" fill="#fbbf24" className="opacity-80" />
                </g>
              </svg>
              
              {/* Floating particles */}
              <div className="absolute top-0 left-0 w-full h-full">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-500/50"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animation: `ping ${2 + Math.random()}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Welcome text */}
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-100 tracking-tight">
                Welcome to the
                <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 text-transparent bg-clip-text animate-gradient-x">
                  Quiz Challenge
                </span>
              </h1>
            </div>

            {/* Animated subtitle */}
            <p className="text-xl md:text-2xl text-gray-400 font-light">
              Get ready to test your knowledge!
            </p>

            {/* Status card */}
            <div className="inline-block bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl px-8 py-6 mt-8 shadow-xl">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="relative">
                  <Clock className="w-8 h-8 text-blue-400 animate-pulse" />
                  <div className="absolute -top-1 -right-1">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 shadow-lg shadow-blue-500/50"></span>
                    </span>
                  </div>
                </div>
                <span className="text-2xl font-semibold text-gray-100">Starting Soon</span>
              </div>
              
              <p className="text-gray-400 text-lg">
                The admin will start the quiz shortly
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { icon: Users, text: 'Multiplayer', color: 'from-purple-600 to-purple-500' },
                { icon: Zap, text: 'Fast Paced', color: 'from-blue-600 to-blue-500' },
                { icon: Trophy, text: 'Leaderboard', color: 'from-indigo-600 to-indigo-500' },
              ].map(({ icon: Icon, text, color }, idx) => (
                <div
                  key={text}
                  className={`bg-gradient-to-r ${color} px-5 py-2 rounded-full flex items-center space-x-2 shadow-lg shadow-purple-900/30 transform transition-all duration-300 hover:scale-110 hover:shadow-purple-500/50 ${
                    pulseIndex === idx ? 'scale-110' : 'scale-100'
                  }`}
                  style={{
                    animation: 'fadeInUp 0.5s ease-out',
                    animationDelay: `${idx * 0.1}s`,
                    animationFillMode: 'backwards'
                  }}
                >
                  <Icon size={18} className="text-white" />
                  <span className="text-white font-semibold text-sm">{text}</span>
                </div>
              ))}
            </div>

            {/* Loading animation */}
            <div className="mt-12">
              <div className="flex justify-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-bounce shadow-lg shadow-purple-500/50"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <p className="text-gray-500 mt-4 text-sm">Waiting for admin...</p>
            </div>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
            <Sparkles size={16} className="animate-pulse text-blue-400" />
            <span>Prepare yourself for an amazing experience</span>
            <Sparkles size={16} className="animate-pulse text-blue-400" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}