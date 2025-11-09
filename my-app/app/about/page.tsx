'use client';

import React, { useEffect, useRef } from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Canvas Background */}

      {/* Grid Overlay */}
      <div className="fixed inset-0 z-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(0, 200, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 200, 255, 0.3) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/50 backdrop-blur-sm">
            <span className="text-cyan-400 text-sm font-semibold tracking-wider">INNOVATION • EXCELLENCE • ENGINEERING</span>
          </div>
          
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
            IE(i) GAMES
          </h1>
          
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-8" />
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Innovative web-based gaming experiences crafted by talented students of the Institution of Engineers
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* IE(i) Games Card */}
          <div className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-cyan-400">IE(i) Games</h2>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                A collection of cutting-edge web games developed by passionate IEI web development students, showcasing creativity, technical excellence, and innovative game design.
              </p>
              
              <div className="bg-black/40 rounded-xl p-4 border border-cyan-500/20">
                <p className="text-cyan-300 font-semibold mb-2">Led by:</p>
                <p className="text-white text-xl font-bold">Jaskaran Singh</p>
                <p className="text-gray-400 text-sm mt-1">Project Lead & Mentor</p>
              </div>
            </div>
          </div>

          {/* About IEI Card */}
          <div className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-blue-400">About IEI</h2>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed">
                The Institution of Engineers Student Chapter at Chitkara University is one of the fastest-growing technical societies, dedicated to fostering innovation and excellence in engineering.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-purple-400 mb-2">Inclusive Community</h3>
            <p className="text-gray-400">Open core team interviews for all years, believing in dedication over hierarchy</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl rounded-xl p-6 border border-green-500/20 hover:border-green-400/50 transition-all duration-300 hover:scale-105">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-400 mb-2">Recognition & Growth</h3>
            <p className="text-gray-400">Certificates and acknowledgment for hard work, building confidence and healthy culture</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl rounded-xl p-6 border border-orange-500/20 hover:border-orange-400/50 transition-all duration-300 hover:scale-105">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-orange-400 mb-2">Successful Events</h3>
            <p className="text-gray-400">Back-to-back successful events providing clear direction and exploration opportunities</p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="relative bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20 backdrop-blur-xl rounded-2xl p-12 border border-cyan-500/30 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
              Empowering the next generation of engineers through hands-on projects, collaborative learning, and innovative technical events. We believe in providing equal opportunities to all passionate individuals, fostering a culture of dedication, creativity, and continuous growth in the ever-evolving world of technology.
            </p>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Active Members', value: '500+' },
            { label: 'Events Hosted', value: '50+' },
            { label: 'Games Developed', value: '15+' },
            { label: 'Projects Completed', value: '100+' }
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/30">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}