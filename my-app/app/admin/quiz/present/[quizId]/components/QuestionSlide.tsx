'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  Cell,
} from 'recharts';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';

interface OptionResult {
  option: string;
  votes: number;
  isCorrect: boolean;
}

interface QuestionSlideProps {
  questionId: string;
  question: string;
  options: string[];
  results?: OptionResult[];
  correct?: string;
  duration?: number; // seconds
}

export default function AdminQuestionSlide({
  questionId,
  question,
  options,
  results = [],
  correct,
  duration = 15,
}: QuestionSlideProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [waiting, setWaiting] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [processedResults, setProcessedResults] = useState<OptionResult[]>([]);
  const [correctOption, setCorrectOption] = useState<string>('');
  const { quizId } = useParams();

  useEffect(() => {
    if (!waiting) return;
    if (timeLeft <= 0) {
      setWaiting(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, waiting]);

const handleReveal = async () => {
  try {
    const res = await fetch(`/api/quiz/${quizId}/question/${questionId}`);
    const data = await res.json();
    console.log('Fetched data:', data);
    
    if (!data.success || !data.question) {
      console.error('Invalid data structure');
      return;
    }

    // Get correct option text
    const correctOptionText = data.question.options[data.question.correctIndex];
    setCorrectOption(correctOptionText);
    
    // Process responses by OPTION INDEX, not by text
    const votesByIndex = new Array(options.length).fill(0);
    
    // Count responses for each option index
    data.question.responses.forEach((resp: any) => {
      if (resp.responseIndex >= 0 && resp.responseIndex < options.length) {
        votesByIndex[resp.responseIndex]++;
      }
    });
    
    // Create results with correct/wrong status
    const processed = options.map((opt, index) => ({
      option: opt,
      votes: votesByIndex[index] || 0,
      isCorrect: index === data.question.correctIndex
    }));
    
    console.log('Processed results:', processed);
    setProcessedResults(processed);
    setRevealed(true);
    setShowResults(true);
  } catch (error) {
    console.error('Error revealing results:', error);
  }
};
  const displayResults = processedResults.length > 0 ? processedResults : results;
  const totalVotes = displayResults.reduce((sum, r) => sum + r.votes, 0);

  // Get bar color based on correctness and reveal state
  const getBarColor = (isCorrect: boolean, votes: number, maxVotes: number) => {
    if (!revealed) {
      // Before reveal - all blue
      return { start: '#3b82f6', end: '#1d4ed8' };
    }
    
    if (isCorrect) {
      // Correct answer - green gradient
      return votes > 0 
        ? { start: '#10b981', end: '#059669' } // Dark green for correct with votes
        : { start: '#6ee7b7', end: '#34d399' }; // Lighter green for correct with no votes
    } else {
      // Wrong answer - red gradient (faded if revealed)
      return revealed 
        ? { start: '#ef4444', end: '#dc2626', opacity: 0.6 } // Faded red when revealed
        : { start: '#ef4444', end: '#dc2626' }; // Normal red before reveal
    }
  };

  const maxVotes = Math.max(...displayResults.map(r => r.votes), 1);

  return (
    <div className={"flex flex-col items-center justify-center w-full h-screen bg-zinc-950 text-white px-6 transition-all duration-300 " + (revealed ? 'mt-20' : '') }>
      {/* Question */}
      <motion.div
        key={question}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl text-center mb-10"
      >
        <h1 className="text-3xl font-bold mb-4">{question}</h1>

        {waiting ? (
          <p className="text-zinc-400 flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            Waiting for participants... <span className="font-semibold">{timeLeft}s</span>
          </p>
        ) : !revealed ? (
          <button
            onClick={handleReveal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium mt-4 transition-all"
          >
            Reveal Results
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-green-400 font-semibold mt-2"
          >
            <CheckCircle className="w-5 h-5" />
            Results Revealed
          </motion.div>
        )}
      </motion.div>

      {/* Options / Graph */}
      <AnimatePresence mode="wait">
        {waiting && (
          <motion.div
            key="options"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-6 max-w-2xl "
          >
            {options.map((opt, i) => (
              <div
                key={i}
                className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl text-center text-lg font-medium hover:bg-zinc-700 transition-all"
              >
                {opt}
              </div>
            ))}
          </motion.div>
        )}

        {!waiting && showResults && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl"
          >
            {/* Total Count Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 shadow-2xl text-center"
            >
              <p className="text-zinc-200 text-sm uppercase tracking-wider mb-2">Total Responses</p>
              <p className="text-6xl font-bold">{totalVotes}</p>
              {revealed && correctOption && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-green-300 font-semibold mt-2 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Correct: {correctOption}
                </motion.p>
              )}
            </motion.div>

            {/* Results Chart */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-zinc-800"
            >
              <h2 className="text-2xl font-semibold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {revealed ? 'Final Results' : 'Live Results'}
              </h2>

              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={displayResults} 
                  barSize={80} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                  <XAxis 
                    dataKey="option" 
                    stroke="#aaa" 
                    tick={{ fill: '#aaa', fontSize: 14 }}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#aaa" tick={{ fill: '#aaa' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      border: '1px solid #3f3f46',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                    }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    formatter={(value: number) => [`${value} votes`, 'Votes']}
                  />

                  <Bar
                    dataKey="votes"
                    animationDuration={1200}
                    animationEasing="ease-out"
                    radius={[12, 12, 0, 0]}
                  >
                    {displayResults.map((entry, index) => {
                      const color = getBarColor(entry.isCorrect, entry.votes, maxVotes);
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#barGradient${index})`}
                          opacity={color.opacity || 1}
                        />
                      );
                    })}
                    <LabelList
                      dataKey="votes"
                      position="top"
                      className="fill-white text-lg font-bold"
                      offset={10}
                    />
                  </Bar>

                  <defs>
                    {displayResults.map((entry, index) => {
                      const color = getBarColor(entry.isCorrect, entry.votes, maxVotes);
                      return (
                        <linearGradient 
                          key={`gradient-${index}`} 
                          id={`barGradient${index}`} 
                          x1="0" 
                          y1="0" 
                          x2="0" 
                          y2="1"
                        >
                          <stop offset="0%" stopColor={color.start} stopOpacity={1} />
                          <stop offset="100%" stopColor={color.end} stopOpacity={color.opacity || 0.8} />
                        </linearGradient>
                      );
                    })}
                  </defs>
                </BarChart>
              </ResponsiveContainer>

              {/* Correct / Wrong indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {displayResults.map((res, i) => {
                  const percentage = totalVotes > 0 ? ((res.votes / totalVotes) * 100).toFixed(1) : '0';
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                      className={`relative p-4 rounded-xl border-2 ${
                        revealed
                          ? res.isCorrect
                            ? 'bg-green-500/20 border-green-500 shadow-lg shadow-green-500/20'
                            : 'bg-red-500/10 border-red-500/30 opacity-70'
                          : 'bg-zinc-800/50 border-zinc-600'
                      } backdrop-blur-sm transition-all duration-300`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        {revealed ? (
                          res.isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-400" />
                          )
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-zinc-600" />
                        )}
                        <span className="text-2xl font-bold">{percentage}%</span>
                      </div>
                      <p className="text-sm text-zinc-300 font-medium truncate">{res.option}</p>
                      <p className="text-xs text-zinc-500 mt-1">{res.votes} votes</p>
                      
                      {revealed && res.isCorrect && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}