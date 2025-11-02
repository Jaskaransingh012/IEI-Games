'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Play, User, LogOut } from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';

interface Segment {
  id: number;
  label: string;
  color: string;
  probability: number;
}

interface SpinCheckResponse {
  hasSpun: boolean;
  prize?: Segment;
}

interface SpinSaveResponse {
  success: boolean;
  error?: string;
}

export default function SpinnerGame(): React.ReactElement {
  const { isSignedIn, user } = useUser();
  const { signOut, openSignIn } = useClerk();
  const [segments] = useState<Segment[]>([
    { id: 1, label: 'Prize 1', color: '#FF6B6B', probability: 20 },
    { id: 2, label: 'Prize 2', color: '#4ECDC4', probability: 20 },
    { id: 3, label: 'Prize 3', color: '#45B7D1', probability: 20 },
    { id: 4, label: 'Prize 4', color: '#FFA07A', probability: 20 },
    { id: 5, label: 'Prize 5', color: '#98D8C8', probability: 20 }
  ]);
  
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [winner, setWinner] = useState<Segment | null>(null);
  const [hasSpun, setHasSpun] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const spinnerRef = useRef<SVGSVGElement | null>(null);

  // Check if user has already spun
  useEffect(() => {
    if (isSignedIn) {
      checkSpinStatus();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const checkSpinStatus = async (): Promise<void> => {
    try {
      const response = await fetch('/api/spin/check');
      const data: SpinCheckResponse = await response.json();
      
      if (data.hasSpun && data.prize) {
        setHasSpun(true);
        setWinner(data.prize);
      }
    } catch (error) {
      console.error('Error checking spin status:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSpin = async (prize: Segment): Promise<SpinSaveResponse> => {
    try {
      const response = await fetch('/api/spin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prize }),
      });

      const data: SpinSaveResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save spin');
      }

      return data;
    } catch (error) {
      console.error('Error saving spin:', error);
      throw error;
    }
  };

  const spinWheel = async (): Promise<void> => {
    if (isSpinning || !isSignedIn || hasSpun) return;
    
    setIsSpinning(true);
    setWinner(null);
    
    // Calculate weighted random selection
    const totalProb = segments.reduce((sum, s) => sum + s.probability, 0);
    let random = Math.random() * totalProb;
    let selectedIndex = 0;
    
    for (let i = 0; i < segments.length; i++) {
      random -= segments[i].probability;
      if (random <= 0) {
        selectedIndex = i;
        break;
      }
    }
    
    const selectedPrize = segments[selectedIndex];
    
    // Calculate rotation
    const segmentAngle = 360 / segments.length;
    const targetAngle = 360 - (selectedIndex * segmentAngle + segmentAngle / 2);
    const spins = 5;
    const finalRotation = rotation + (360 * spins) + targetAngle;
    
    setRotation(finalRotation);
    
    setTimeout(async () => {
      try {
        // Save the spin to database
        await saveSpin(selectedPrize);
        setWinner(selectedPrize);
        setHasSpun(true);
      } catch (error) {
        console.error('Failed to save spin:', error);
        alert('Failed to save your spin. Please try again.');
      } finally {
        setIsSpinning(false);
      }
    }, 4000);
  };

  const segmentAngle = 360 / segments.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with User Info */}
       

        <div className="flex flex-col items-center">
          {/* Spinner Container */}
          <div className="relative mb-12">
            {/* Outer Glow Effect */}
            <div className="absolute inset-0 rounded-full blur-xl opacity-30 bg-gradient-to-r from-purple-600 to-blue-600 animate-pulse"></div>
            
            {/* Arrow Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
              <div className="w-0 h-0 border-l-[24px] border-r-[24px] border-t-[48px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-2xl"></div>
              <div className="w-2 h-8 bg-red-500 absolute top-[-40px] left-1/2 -translate-x-1/2 drop-shadow-lg"></div>
            </div>
            
            {/* Wheel Container with Dark Frame */}
            <div className="relative p-8 bg-gray-900 rounded-full shadow-2xl border-4 border-gray-800">
              {/* Wheel */}
              <svg
                ref={spinnerRef}
                width="400"
                height="400"
                viewBox="0 0 400 400"
                className="drop-shadow-2xl"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
                }}
              >
                {segments.map((segment, index) => {
                  const startAngle = index * segmentAngle - 90;
                  const endAngle = startAngle + segmentAngle;
                  
                  const x1 = 200 + 180 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 200 + 180 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = 200 + 180 * Math.cos((endAngle * Math.PI) / 180);
                  const y2 = 200 + 180 * Math.sin((endAngle * Math.PI) / 180);
                  
                  const largeArc = segmentAngle > 180 ? 1 : 0;
                  
                  const pathData = `M 200 200 L ${x1} ${y1} A 180 180 0 ${largeArc} 1 ${x2} ${y2} Z`;
                  
                  const textAngle = startAngle + segmentAngle / 2;
                  const textX = 200 + 110 * Math.cos((textAngle * Math.PI) / 180);
                  const textY = 200 + 110 * Math.sin((textAngle * Math.PI) / 180);
                  
                  return (
                    <g key={segment.id}>
                      <path
                        d={pathData}
                        fill={segment.color}
                        stroke="#1f2937"
                        strokeWidth="3"
                        className="transition-all duration-300 hover:brightness-110"
                      />
                      <text
                        x={textX}
                        y={textY}
                        fill="white"
                        fontSize="14"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                        className="drop-shadow-md"
                      >
                        {segment.label}
                      </text>
                    </g>
                  );
                })}
                
                {/* Center Circle */}
                <circle cx="200" cy="200" r="35" fill="#1f2937" stroke="#374151" strokeWidth="4" />
                <circle cx="200" cy="200" r="25" fill="#111827" stroke="#4b5563" strokeWidth="2" />
                
                {/* Inner Ring */}
                <circle cx="200" cy="200" r="160" fill="none" stroke="#1f2937" strokeWidth="2" opacity="0.3" />
              </svg>
            </div>
          </div>
          
          {/* Status Messages */}
          {!isSignedIn && (
            <div className="mb-6 p-4 bg-yellow-600/20 border border-yellow-600 rounded-lg">
              <p className="text-yellow-400 text-center">
                Please sign in to spin the wheel
              </p>
            </div>
          )}

          {isSignedIn && hasSpun && !isSpinning && (
            <div className="mb-6 p-4 bg-blue-600/20 border border-blue-600 rounded-lg">
              <p className="text-blue-400 text-center">
                You've already used your spin for this round!
              </p>
            </div>
          )}

          {/* Spin Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning || !isSignedIn || hasSpun}
            className="relative px-16 py-6 bg-gradient-to-r from-red-600 to-purple-600 text-white text-2xl font-bold rounded-full hover:from-red-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-2xl border-2 border-purple-500/50 group"
          >
            <div className="flex items-center gap-3">
              <div className={`transition-transform ${isSpinning ? 'animate-spin' : 'group-hover:scale-110'}`}>
                <Play size={28} className={isSpinning ? 'hidden' : 'block'} />
              </div>
              <span className="text-shadow">
                {!isSignedIn ? 'SIGN IN TO SPIN' : 
                 hasSpun ? 'ALREADY SPUN' :
                 isSpinning ? 'SPINNING...' : 'SPIN WHEEL'}
              </span>
            </div>
            
            {/* Button Glow */}
            <div className="absolute inset-0 rounded-full blur-lg bg-gradient-to-r from-red-600 to-purple-600 opacity-50 -z-10 group-hover:opacity-70 transition-opacity"></div>
          </button>
          
          {/* Winner Display */}
          {winner && (
            <div className="mt-12 p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700 animate-pulse">
              <div className="text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Congratulations!
                </h2>
                <p className="text-xl" style={{ color: winner.color }}>
                  You won: <strong>{winner.label}</strong>
                </p>
                {hasSpun && (
                  <p className="text-gray-400 mt-4">
                    This prize has been saved to your account
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Stats Panel */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-2xl">
            {segments.map((segment) => (
              <div 
                key={segment.id}
                className="bg-gray-900 rounded-lg p-4 text-center border border-gray-800 hover:border-gray-600 transition-colors"
              >
                <div 
                  className="w-8 h-8 rounded-full mx-auto mb-2 shadow-lg"
                  style={{ backgroundColor: segment.color }}
                ></div>
                <div className="text-white font-medium text-sm truncate">
                  {segment.label}
                </div>
                <div className="text-gray-400 text-xs">
                  {segment.probability}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}