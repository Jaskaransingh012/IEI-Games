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
} from 'recharts';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OptionResult {
  option: string;
  votes: number;
}

interface QuestionSlideProps {
  question: string;
  options: string[];
  results?: OptionResult[];
  correct?: string;
  duration?: number; // seconds
}

export default function AdminQuestionSlide({
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

  const handleReveal = () => {
    setRevealed(true);
    setShowResults(true);
  };

  const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-zinc-950 text-white px-6 transition-all duration-300">
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
        ) : null}
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
            className="grid grid-cols-2 gap-6 max-w-2xl"
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

        {revealed && showResults && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl bg-zinc-900 rounded-xl p-6 shadow-xl border border-zinc-800"
          >
            <h2 className="text-xl font-semibold mb-6 text-center">
              Results ({totalVotes} total responses)
            </h2>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={results} barSize={60}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="option" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }} />

                <Bar
                  dataKey="votes"
                  animationDuration={900}
                  radius={[10, 10, 0, 0]}
                  fill="url(#barGradient)"
                >
                  <LabelList
                    dataKey="votes"
                    position="top"
                    className="fill-white text-sm font-semibold"
                  />
                </Bar>

                {/* Gradient for bars */}
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1e3a8a" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>

            {/* Correct / Wrong icons above bars */}
            <div className="flex justify-between max-w-4xl mt-4">
              {results.map((res, i) => {
                const isCorrect = res.option === correct;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex flex-col items-center w-full"
                  >
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-400 mb-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400 mb-1" />
                    )}
                    <p
                      className={`text-sm ${
                        isCorrect ? 'text-green-400' : 'text-red-400'
                      } font-medium`}
                    >
                      {res.option}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
