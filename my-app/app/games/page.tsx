'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

interface Game {
  id: string;
  title: string;
  genre: string;
  rating: number;
  description: string;
  coverImage: string;
  ctaText: string;
  href:string;
}

const games: Game[] = [
  {
    id: '1',
    title: 'Mind Bender Quiz',
    genre: 'Trivia • Puzzle',
    rating: 4.8,
    description: 'Test your knowledge across multiple categories. Challenge your brain with mind-bending questions.',
    coverImage: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&h=450&fit=crop&q=80',
    ctaText: 'Play Quiz',
    href:'/games/quiz'
  },
  {
    id: '2',
    title: 'Fortune Spinner',
    genre: 'Arcade • Luck',
    rating: 4.5,
    description: 'Spin the wheel of destiny. Win amazing rewards and unlock special bonuses with every spin.',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop&q=80',
    ctaText: 'Spin Now',
    href:'/games/spinner'
  }
];

const GameCard: React.FC<{ game: Game; index: number }> = ({ game, index }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const tiltX = prefersReducedMotion ? 0 : mousePosition.y * 10;
  const tiltY = prefersReducedMotion ? 0 : mousePosition.x * -10;
  const parallaxX = prefersReducedMotion ? 0 : mousePosition.x * 20;
  const parallaxY = prefersReducedMotion ? 0 : mousePosition.y * 20;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      ref={cardRef}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 60, rotateZ: -3 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotateZ: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1]
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={
          prefersReducedMotion
            ? {}
            : {
                rotateX: tiltX,
                rotateY: tiltY,
                scale: isHovered ? 1.03 : 1
              }
        }
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
        className="relative h-[420px] rounded-2xl overflow-hidden will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
        role="article"
        aria-label={`${game.title}, ${game.genre} game`}
        tabIndex={0}
      >
        {/* Neon border glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
        
        {/* Card container with glassmorphism */}
        <div className="relative h-full bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Background image with parallax */}
          <motion.div
            animate={
              prefersReducedMotion
                ? {}
                : {
                    x: parallaxX,
                    y: parallaxY
                  }
            }
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 20
            }}
            className="absolute inset-0 will-change-transform"
          >
            <img
              src={game.coverImage}
              alt=""
              className="w-full h-full object-cover scale-110"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          </motion.div>

          {/* Static content (always visible) */}
          <div className="absolute top-4 left-4 right-4 z-10">
            <span className="inline-block px-3 py-1 text-xs font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-full backdrop-blur-sm">
              {game.genre}
            </span>
          </div>

          <div className="absolute top-4 right-4 z-10">
            {renderStars(game.rating)}
          </div>

          {/* Slide-up overlay on hover */}
          <motion.div
            initial={{ y: '100%' }}
            animate={
              prefersReducedMotion
                ? {}
                : { y: isHovered ? '0%' : '100%' }
            }
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black/95 via-black/85 to-transparent backdrop-blur-sm z-20 flex flex-col justify-end p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                prefersReducedMotion
                  ? { opacity: 1, y: 0 }
                  : {
                      opacity: isHovered ? 1 : 0,
                      y: isHovered ? 0 : 20
                    }
              }
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {game.description}
              </p>
              
              {/* CTA Button with neon glow */}
              <Link href={game.href} >
              
              
              <button
                className="group/btn relative w-full py-3 px-6 font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(124,92,255,0.5)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0b0f17]"
                aria-label={`${game.ctaText} for ${game.title}`}
              >
                {/* Animated shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
                <span className="relative flex items-center justify-center gap-2">
                  {game.ctaText}
                  <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                
                {/* Pulsing glow on hover */}
                <span className="absolute inset-0 rounded-lg bg-purple-500/30 blur-md opacity-0 group-hover/btn:opacity-100 group-hover/btn:animate-pulse -z-10" />
              </button>

              </Link>
            </motion.div>
          </motion.div>

          {/* Bottom info (always visible) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
            <h3 className="text-xl font-bold text-white mb-1">{game.title}</h3>
            <p className="text-gray-400 text-sm">{game.description.substring(0, 50)}...</p>
          </div>

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </motion.div>
    </motion.div>
  );
};

const GamesCardGrid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Featured Games
          </h1>
          <p className="text-gray-400 text-lg">Experience the next generation of gaming</p>
        </motion.div>

        {/* Games grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          {games.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} />
          ))}
        </div>

        {/* Decorative elements */}
        <div className="mt-24 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 0.8 }}
            className="inline-flex items-center gap-2 text-gray-500 text-sm"
          >
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-gray-500" />
            More games coming soon
            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-gray-500" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GamesCardGrid;