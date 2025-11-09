import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown, Star, Zap, TrendingUp, Flame } from 'lucide-react';
import { useParams } from 'next/navigation';

// Demo data
const DEMO_DATA = [
  {
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jaskaransingh012",
    score: 2450,
    userId: "user_1",
    username: "jaskaransingh012"
  },
  {
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jaskaran",
    score: 2180,
    userId: "user_2",
    username: "Jaskaran"
  },
  {
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    score: 1895,
    userId: "user_3",
    username: "AlexCoder"
  },
  {
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    score: 1654,
    userId: "user_4",
    username: "SarahDev"
  },
  {
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    score: 1432,
    userId: "user_5",
    username: "MikeQuiz"
  },
  {
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    score: 1287,
    userId: "user_6",
    username: "EmmaWins"
  }
];

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatedScores, setAnimatedScores] = useState({});
  const [hoveredUser, setHoveredUser] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const {quizId} = useParams();

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      // Try to fetch from API, fallback to demo data
      const response = await fetch('/api/quiz/' + quizId);
      const data = await response.json();
      const roomUsers = data.room?.users;
      const sortedData = roomUsers.sort((a, b) => b.score - a.score);
      setUsers(sortedData);
      initializeAnimation(sortedData);
    } catch (error) {
      // Use demo data if API fails
      setUsers(DEMO_DATA);
      initializeAnimation(DEMO_DATA);
    }
  };

  const initializeAnimation = (data) => {
    const initialScores = {};
    data.forEach(user => {
      initialScores[user.userId] = 0;
    });
    setAnimatedScores(initialScores);
    setLoading(false);
    
    setTimeout(() => {
      animateScores(data);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }, 100);
  };

  const animateScores = (userData) => {
    const duration = 2000;
    const fps = 60;
    const frames = duration / (1000 / fps);
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / frames;
      const easeProgress = easeOutCubic(progress);

      const newScores = {};
      userData.forEach(user => {
        newScores[user.userId] = Math.round(user.score * easeProgress);
      });
      setAnimatedScores(newScores);

      if (frame >= frames) {
        clearInterval(interval);
        const finalScores = {};
        userData.forEach(user => {
          finalScores[user.userId] = user.score;
        });
        setAnimatedScores(finalScores);
      }
    }, 1000 / fps);
  };

  const easeOutCubic = (t) => {
    return 1 - Math.pow(1 - t, 3);
  };

  const getBarColor = (index) => {
    const colors = [
      'from-yellow-400 via-yellow-500 to-amber-600',
      'from-slate-300 via-slate-400 to-slate-500',
      'from-orange-400 via-orange-500 to-orange-600',
      'from-blue-400 via-blue-500 to-blue-600',
      'from-purple-400 via-purple-500 to-purple-600',
      'from-green-400 via-green-500 to-green-600',
      'from-pink-400 via-pink-500 to-pink-600',
      'from-indigo-400 via-indigo-500 to-indigo-600',
    ];
    return colors[index % colors.length];
  };

  const getPodiumIcon = (position) => {
    switch (position) {
      case 0:
        return <Crown className="w-8 h-8 text-yellow-400 animate-pulse" />;
      case 1:
        return <Medal className="w-7 h-7 text-slate-300" />;
      case 2:
        return <Award className="w-7 h-7 text-orange-500" />;
      default:
        return null;
    }
  };

  const maxScore = users.length > 0 ? Math.max(...users.map(u => u.score)) : 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400 border-solid mb-4 mx-auto"></div>
          <div className="text-slate-300 text-2xl font-semibold">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <Star className="text-yellow-400" size={16} />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600">
              Leaderboard
            </h1>
            <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Top performers in the quiz challenge
            <Flame className="w-5 h-5 text-orange-500" />
          </p>
        </div>

        {/* Podium - Top 3 */}
        {users.length > 0 && (
          <div className="mb-16">
            <div className="flex items-end justify-center gap-4 md:gap-8 mb-8 flex-wrap md:flex-nowrap">
              {/* 2nd Place */}
              {users[1] && (
                <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                  <div className="relative mb-4 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-300 to-slate-500 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                    <img
                      src={users[1].image}
                      alt={users[1].username}
                      className="w-24 h-24 rounded-full border-4 border-slate-400 object-cover relative z-10 group-hover:border-slate-300 transition-all"
                    />
                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full p-2 z-20 shadow-lg">
                      <Medal className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-t-2xl px-6 py-6 h-32 flex flex-col items-center justify-center border-t-4 border-slate-400 shadow-2xl hover:shadow-slate-500/50 transition-all group">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-slate-300" />
                      <p className="text-white font-bold text-lg">{users[1].username}</p>
                      <Star className="w-4 h-4 text-slate-300" />
                    </div>
                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
                      {animatedScores[users[1].userId]}
                    </p>
                    <p className="text-slate-400 text-sm flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      points
                    </p>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {users[0] && (
                <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-110 hover:-translate-y-3">
                  <div className="relative mb-4 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full blur-2xl opacity-70 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                    <img
                      src={users[0].image}
                      alt={users[0].username}
                      className="w-32 h-32 rounded-full border-4 border-yellow-400 object-cover shadow-2xl relative z-10 group-hover:border-yellow-300 transition-all"
                    />
                    <div className="absolute -top-3 -right-3 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full p-3 z-20 shadow-2xl animate-bounce">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 backdrop-blur-xl rounded-t-2xl px-8 py-6 h-40 flex flex-col items-center justify-center border-t-4 border-yellow-400 shadow-2xl hover:shadow-yellow-500/50 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
                      <p className="text-white font-bold text-xl">{users[0].username}</p>
                      <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
                    </div>
                    <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
                      {animatedScores[users[0].userId]}
                    </p>
                    <p className="text-yellow-300 text-sm flex items-center gap-1 mt-1">
                      <TrendingUp className="w-4 h-4" />
                      points
                    </p>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {users[2] && (
                <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                  <div className="relative mb-4 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                    <img
                      src={users[2].image}
                      alt={users[2].username}
                      className="w-24 h-24 rounded-full border-4 border-orange-500 object-cover relative z-10 group-hover:border-orange-400 transition-all"
                    />
                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full p-2 z-20 shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-900/40 to-orange-950/40 backdrop-blur-xl rounded-t-2xl px-6 py-6 h-28 flex flex-col items-center justify-center border-t-4 border-orange-500 shadow-2xl hover:shadow-orange-500/50 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-orange-400" />
                      <p className="text-white font-bold text-lg">{users[2].username}</p>
                      <Star className="w-4 h-4 text-orange-400" />
                    </div>
                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500">
                      {animatedScores[users[2].userId]}
                    </p>
                    <p className="text-orange-300 text-sm flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      points
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bar Graph */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl border border-slate-800">
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 mb-6 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-yellow-400" />
            Score Comparison
          </h2>
          <div className="space-y-4">
            {users.map((user, index) => (
              <div 
                key={user.userId} 
                className="group transform transition-all duration-300 hover:scale-[1.02]"
                onMouseEnter={() => setHoveredUser(user.userId)}
                onMouseLeave={() => setHoveredUser(null)}
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-3 w-48 md:w-56">
                    <span className={`text-2xl font-bold w-10 text-center transition-all duration-300 ${
                      hoveredUser === user.userId ? 'text-yellow-400 scale-125' : 'text-slate-500'
                    }`}>
                      #{index + 1}
                    </span>
                    <div className="relative">
                      <img
                        src={user.image}
                        alt={user.username}
                        className="w-12 h-12 rounded-full border-2 border-slate-700 object-cover group-hover:border-yellow-400 transition-all group-hover:scale-110"
                      />
                      {hoveredUser === user.userId && (
                        <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping"></div>
                      )}
                    </div>
                    <span className="text-slate-200 font-semibold truncate flex-1 group-hover:text-yellow-400 transition-colors">
                      {user.username}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center gap-4">
                    <div className="flex-1 bg-slate-800/50 rounded-full h-14 overflow-hidden relative group-hover:bg-slate-800 transition-all shadow-inner">
                      <div
                        className={`h-full bg-gradient-to-r ${getBarColor(index)} transition-all duration-500 ease-out flex items-center justify-end pr-4 relative overflow-hidden group-hover:shadow-lg`}
                        style={{
                          width: `${(animatedScores[user.userId] / maxScore) * 100}%`,
                        }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        <div className="relative flex items-center gap-2">
                          <Zap className="w-5 h-5 text-white animate-pulse" />
                          <span className="text-white font-bold text-lg drop-shadow-lg">
                            {animatedScores[user.userId]}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* {index < 3 && (
                      <div className="w-12 flex justify-center group-hover:scale-125 transition-transform">
                        {getPodiumIcon(index)}
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-800 hover:border-yellow-400 transition-all group">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-slate-400 text-sm">Total Players</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-800 hover:border-purple-400 transition-all group">
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-slate-400 text-sm">Highest Score</p>
                <p className="text-2xl font-bold text-white">{maxScore}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-800 hover:border-blue-400 transition-all group">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-slate-400 text-sm">Average Score</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(users.reduce((acc, u) => acc + u.score, 0) / users.length)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}