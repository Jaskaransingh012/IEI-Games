'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';

interface QuestionPageProps {
  questionTitle: string;
  image?: string | null;
  options: string[];
  duration?: number;
  correctIndex: number;
  ableToAnswer:boolean,
  onScore?: (score: number, selected: number, timeTaken: number) => void;
}

export default function QuestionPage({
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
  const [timeLeft, setTimeLeft] = useState(duration);
  const [score, setScore] = useState<number | null>(null);


  const {quizId} = useParams();

  // Countdown timer
  useEffect(() => {
    console.log("able to answer",ableToAnswer);
    if (submitted) return;
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, submitted]);

  const handleSelect = (index: number) => {
    if (!submitted) setSelected(index);
  };

  const updateScore = async (points: number) => {
    const res = await fetch(`/api/quiz/submit-answer/${quizId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points }),
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
    if ((selected !== null || auto) && !submitted && ableToAnswer) {
      setSubmitted(true);

      const timeTaken = duration - timeLeft;
      const selectedIndex = auto ? -1 : selected!;

      // 🎯 Precise scoring logic
      const points = calculatePreciseScore(timeLeft, selectedIndex);
      
      try {
        const data = await updateScore(points);
        alert(data.message);
      } catch (error) {
        console.error('Failed to update score:', error);
      }
      
      setScore(points);

      if (onScore) onScore(points, selectedIndex, timeTaken);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* background gradient */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/30 blur-[160px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/30 blur-[160px] rounded-full translate-x-1/3 translate-y-1/3" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-[#1a1b1e] border border-gray-800 rounded-2xl shadow-xl p-8 relative z-10"
      >
        {/* Timer */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm text-gray-400 tracking-wider uppercase">
            Time Remaining
          </h2>
          <motion.div
            key={timeLeft}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`text-xl font-bold ${
              timeLeft <= 5 ? 'text-red-400' : 'text-indigo-400'
            }`}
          >
            {timeLeft}s
          </motion.div>
        </div>

        {/* Question */}
        <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          {questionTitle}
        </h1>

        {image && (
          <div className="flex justify-center mb-6">
            <motion.img
              src={image}
              alt="question visual"
              className="w-full max-h-64 object-cover rounded-xl border border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}

        {/* Options */}
        <div className="flex flex-col gap-4">
          {options.map((option, index) => {
            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={submitted}
                className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 border text-lg font-medium relative
                  ${
                    selected === index 
                      ? 'border-indigo-500 bg-indigo-600/20 text-indigo-200'
                      : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800 text-gray-300'
                  }
                `}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => handleSubmit(false)}
            disabled={selected === null || submitted || !ableToAnswer}
            className={`px-8 py-3 rounded-xl text-lg font-semibold transition-all
              ${
                selected === null || submitted || !ableToAnswer
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90'
              }`}
          >
            {submitted ? 'Submitted ✅' : 'Submit'}
          </button>
        </div>

        {/* Score Display */}
        <AnimatePresence>
          {score !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 text-center"
            >
              <div className="text-lg text-gray-300">
                You scored: <span className="text-2xl font-bold text-green-400">{score} points</span>
              </div>
              {score > 0 && (
                <div className="text-sm text-gray-400 mt-2">
                  {timeLeft > duration * 0.7 ? "Lightning fast! ⚡" : 
                   timeLeft > duration * 0.4 ? "Great speed! 🚀" : 
                   "Good answer! ✅"}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
    </div>
  );
}