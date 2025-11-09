'use client';
import { useState, useEffect, useRef } from 'react';
import { Upload, Clock, Save, Plus, Trash2, Check } from 'lucide-react';
import { useParams } from 'next/navigation';
import Navbar from './QuizNavbar';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  image: string | null;
  duration: number;
}

interface QuizData {
  room?: {
    questions: Question[];
  };
}

export default function QuizEditorPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const params = useParams();
  const quizId = params?.quizId as string;

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let item of items) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            handleImageFile(file);
            e.preventDefault();
            break;
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [currentIndex]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/quiz/' + quizId);
      const data: QuizData = await response.json();
      const fetchedQuestions = data.room?.questions || [];
      setQuestions(fetchedQuestions.length > 0 ? fetchedQuestions : [createEmptyQuestion()]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([createEmptyQuestion()]);
      setLoading(false);
    }
  };

  const createEmptyQuestion = (): Question => ({
    id: Date.now(),
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    image: null,
    duration: 30
  });

  const updateQuestion = (field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[currentIndex] = { ...updated[currentIndex], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[currentIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const handleImageFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateQuestion('image', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const saveQuestions = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/quiz/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, questions })
      });
      const data = res.json();
      console.log(data);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving questions:', error);
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, createEmptyQuestion()]);
    setCurrentIndex(questions.length);
  };

  const deleteQuestion = () => {
    if (questions.length === 1) return;
    const updated = questions.filter((_, i) => i !== currentIndex);
    setQuestions(updated);
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin-slow"></div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-6000"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
            <Navbar />
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-slide-down">
            <div>
              <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient">
                Quiz Editor
              </h1>
              <p className="text-gray-400 text-sm">Create and manage your quiz questions</p>
            </div>
            <button
              onClick={saveQuestions}
              disabled={saving}
              className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                {saved ? (
                  <>
                    <Check className="w-5 h-5" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {saving ? 'Saving...' : 'Save Quiz'}
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Question Navigation */}
          <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap group ${
                  i === currentIndex
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-purple-500/50 scale-105'
                    : 'bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-cyan-500/50 hover:scale-105'
                }`}
              >
                <span className="relative z-10">Question {i + 1}</span>
                {i === currentIndex && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 opacity-50 blur-xl"></div>
                )}
              </button>
            ))}
            <button
              onClick={addQuestion}
              className="relative px-6 py-3 bg-gray-900/50 backdrop-blur-sm border border-dashed border-gray-700 rounded-xl font-medium hover:border-cyan-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2 whitespace-nowrap group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Question</span>
            </button>
          </div>

          {/* Main Editor */}
          <div className="bg-gray-900/30 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-800/50 animate-fade-in">
            {/* Question Heading */}
            <div className="mb-6 group">
              <label className="block text-sm font-medium mb-2 text-cyan-400">Question</label>
              <input
                type="text"
                value={currentQuestion.question}
                onChange={(e) => updateQuestion('question', e.target.value)}
                placeholder="Enter your question here..."
                className="w-full px-4 py-4 bg-black/50 rounded-xl border border-gray-800 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 placeholder-gray-600"
              />
            </div>

            {/* Duration */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-cyan-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duration (seconds)
              </label>
              <input
                type="number"
                value={currentQuestion.duration}
                onChange={(e) => updateQuestion('duration', parseInt(e.target.value) || 30)}
                min="5"
                max="300"
                className="w-full px-4 py-4 bg-black/50 rounded-xl border border-gray-800 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300"
              />
            </div>

            {/* Image Upload */}
            {/* <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-cyan-400 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Question Image (Optional)
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 overflow-hidden ${
                  dragActive
                    ? 'border-cyan-500 bg-cyan-500/10 scale-[1.02]'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                {currentQuestion.image ? (
                  <div className="relative group">
                    <img
                      src={currentQuestion.image}
                      alt="Question"
                      className="max-h-64 mx-auto rounded-lg shadow-2xl border border-gray-800"
                    />
                    <button
                      onClick={() => updateQuestion('image', null)}
                      className="absolute top-2 right-2 p-3 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="relative z-10">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-cyan-400 animate-bounce-slow" />
                    <p className="text-gray-300 mb-2">
                      Drag & drop an image, paste from clipboard, or click to browse
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageFile(e.target.files[0])}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 mt-2 hover:scale-105"
                    >
                      Browse Files
                    </button>
                  </div>
                )}
              </div>
            </div> */}

            {/* Options */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-4 text-cyan-400">
                Answer Options
              </label>
              <div className="grid gap-4">
                {currentQuestion.options.map((option, i) => (
                  <div
                    key={i}
                    className={`group relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                      currentQuestion.correctIndex === i
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-gray-800 bg-black/30 hover:border-gray-700'
                    }`}
                  >
                    {currentQuestion.correctIndex === i && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"></div>
                    )}
                    <div className="relative flex items-center gap-3 flex-1">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentQuestion.correctIndex === i}
                        onChange={() => updateQuestion('correctIndex', i)}
                        className="w-5 h-5 accent-green-500 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(i, e.target.value)}
                        placeholder={`Option ${i + 1}`}
                        className="flex-1 px-4 py-2 bg-transparent focus:outline-none placeholder-gray-600"
                      />
                      <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
                        currentQuestion.correctIndex === i
                          ? 'bg-green-500 text-black'
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                Select the radio button to mark the correct answer
              </p>
            </div>

            {/* Delete Question */}
            {questions.length > 1 && (
              <button
                onClick={deleteQuestion}
                className="w-full py-4 bg-red-500/10 border border-red-500/30 rounded-xl hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Delete Question
              </button>
            )}
          </div>

          {/* Question Counter */}
          <div className="mt-6 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full text-gray-400 text-sm">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(100px);
            opacity: 0;
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
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

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-6000 {
          animation-delay: 6s;
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .bg-grid {
          background-image: 
            linear-gradient(rgba(96, 165, 250, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96, 165, 250, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}