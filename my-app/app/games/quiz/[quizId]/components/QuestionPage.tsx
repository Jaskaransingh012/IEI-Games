'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

interface QuestionPageProps {
  questionId: string;
  questionTitle: string;
  image?: string | null;
  options: string[];
  duration?: number;
  correctIndex: number;
  ableToAnswer:boolean,
  onScore?: (score: number, selected: number, timeTaken: number) => void;
}

export default function QuestionPage({
  questionId,
  questionTitle,
  image = null,
  options = [],
  duration = 30,
  correctIndex,
  ableToAnswer,
  onScore,
}: QuestionPageProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [score, setScore] = useState<number | null>(null);


  const {quizId} = useParams();

  // Countdown timer
  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, submitted]);

  const handleSelect = (index: number) => {
    if (!submitted && !isSubmitting) setSelected(index);
  };

  const updateScore = async (points: number) => {
    const res = await fetch(`/api/quiz/submit-answer/${quizId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points, questionId, responseIndex: selected }),
    });
    const data = await res.json();
    return data;
  };

  const calculatePreciseScore = (timeLeft: number, selectedIndex: number): number => {
    console.log(selectedIndex, correctIndex);
    if (selectedIndex !== correctIndex) {
      console.log("ethe rola aa");
      return 0;
    }

    const baseScore = 500;
    const maxBonus = 500;
    
    // More precise time-based calculation
    const timeRatio = timeLeft / duration;
    
    // Use exponential decay for more interesting scores
    const timeBonus = Math.floor(maxBonus * Math.pow(timeRatio, 1.5));
    
    // Add a small random variation (±20 points) for uniqueness
    const randomVariation = Math.floor(Math.random() * 41) - 20;
    
    // Calculate final score with constraints
    const rawScore = baseScore + timeBonus + randomVariation;
    
    // Ensure score is within bounds and has more varied numbers
    const finalScore = Math.max(300, Math.min(1000, rawScore));
    
    // Make score end with more interesting digits (not just 0 or 5)
    const lastDigit = finalScore % 10;
    let adjustedScore = finalScore;
    
    if (lastDigit === 0 || lastDigit === 5) {
      // Adjust to make last digit more varied (2, 3, 7, 8, etc.)
      const interestingDigits = [2, 3, 7, 8];
      const newLastDigit = interestingDigits[Math.floor(Math.random() * interestingDigits.length)];
      adjustedScore = Math.floor(finalScore / 10) * 10 + newLastDigit;
    }

    return adjustedScore;
  };

  const handleSubmit = async (auto = false) => {
    if ((selected !== null || auto) && !submitted && ableToAnswer && !isSubmitting) {
      setIsSubmitting(true);

      const timeTaken = duration - timeLeft;
      const selectedIndex = auto ? -1 : selected!;

      // 🎯 Precise scoring logic
      const points = calculatePreciseScore(timeLeft, selectedIndex);
      
      try {
        const data = await updateScore(points);
        if(data.error == 'You have already submitted this question'){
          setSubmitted(true);
          setIsSubmitting(false);
          toast.error('You have already submitted this question');
          return;
        }else{
          toast.success(data.message);
        }
        
      } catch (error) {
        console.error('Failed to update score:', error);
      }
      
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setScore(points);
      setSubmitted(true);
      setIsSubmitting(false);

      if (onScore) onScore(points, selectedIndex, timeTaken);
    }
  };

  const progressPercentage = (timeLeft / duration) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Enhanced background gradients */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-purple-600/20 blur-[180px] rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[180px] rounded-full translate-x-1/3 translate-y-1/3 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[200px] rounded-full -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-gradient-to-br from-[#1a1b1e] to-[#16161a] border border-gray-800/50 rounded-3xl shadow-2xl shadow-purple-900/20 p-8 relative z-10 backdrop-blur-sm"
      >
        {/* Timer Section with Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs text-gray-500 tracking-wider uppercase font-semibold">
              Time Remaining
            </h2>
            <motion.div
              key={timeLeft}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, type: "spring" }}
              className={`text-2xl font-bold tabular-nums ${
                timeLeft <= 5 ? 'text-red-400' : timeLeft <= 10 ? 'text-orange-400' : 'text-indigo-400'
              }`}
            >
              {timeLeft}s
            </motion.div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden">
            <motion.div
              className={`absolute top-0 left-0 h-full rounded-full ${
                timeLeft <= 5 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                timeLeft <= 10 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              initial={{ width: '100%' }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent leading-tight"
        >
          {questionTitle}
        </motion.h1>

        {image && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-8"
          >
            <img
              src={image}
              alt="question visual"
              className="w-full max-h-64 object-cover rounded-2xl border border-gray-700/50 shadow-lg"
            />
          </motion.div>
        )}

        {/* Options */}
        <div className="flex flex-col gap-3 mb-8">
          {options.map((option, index) => {
            const isSelected = selected === index;
            const isDisabled = submitted || isSubmitting;
            
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => handleSelect(index)}
                disabled={isDisabled}
                whileHover={!isDisabled ? { scale: 1.02, x: 4 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 border text-base font-medium relative overflow-hidden group
                  ${
                    isSelected 
                      ? 'border-indigo-500/80 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-white shadow-lg shadow-indigo-500/20'
                      : isDisabled
                      ? 'border-gray-800 bg-gray-900/30 text-gray-500 cursor-not-allowed'
                      : 'border-gray-700/50 bg-gray-800/20 hover:border-gray-600 hover:bg-gray-800/40 text-gray-300'
                  }
                `}
              >
                {/* Shimmer effect on hover */}
                {!isDisabled && !isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                )}
                
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="selected-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-r"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <span className="relative z-10">{option}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <motion.button
            onClick={() => handleSubmit(false)}
            disabled={selected === null || submitted || !ableToAnswer || isSubmitting}
            whileHover={selected !== null && !submitted && ableToAnswer && !isSubmitting ? { scale: 1.05 } : {}}
            whileTap={selected !== null && !submitted && ableToAnswer && !isSubmitting ? { scale: 0.95 } : {}}
            className={`relative px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 overflow-hidden
              ${
                selected === null || submitted || !ableToAnswer || isSubmitting
                  ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed border border-gray-800'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30 border border-indigo-500/50'
              }`}
          >
            {/* Animated background on hover */}
            {selected !== null && !submitted && ableToAnswer && !isSubmitting && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
            
            <span className="relative z-10 flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : submitted ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Submitted
                </>
              ) : (
                'Submit Answer'
              )}
            </span>
          </motion.button>
        </div>

        {/* Score Display */}
        <AnimatePresence>
          {score !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mt-8 text-center"
            >
              <motion.div 
                className="inline-block px-8 py-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl shadow-xl shadow-green-500/10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-semibold">
                  Your Score
                </div>
                <motion.div 
                  className="text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {score}
                </motion.div>
                <div className="text-xs text-gray-500 mt-1">points</div>
                
                {score > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-sm text-gray-400 mt-3 flex items-center justify-center gap-2"
                  >
                    {timeLeft > duration * 0.7 ? (
                      <>
                        <span className="text-2xl">⚡</span>
                        <span>Lightning fast!</span>
                      </>
                    ) : timeLeft > duration * 0.4 ? (
                      <>
                        <span className="text-2xl">🚀</span>
                        <span>Great speed!</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">✅</span>
                        <span>Good answer!</span>
                      </>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/50 to-transparent pointer-events-none" />
    </div>
  );
}