'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import { WaitingSlide } from './components/WaitingSlide';
import AdminQuestionSlide from './components/QuestionSlide';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import Leaderboard from './components/LeaderBoard';

interface Question {
  question: string;
  options: string[];
  correct: string;
  duration: number;
}

interface Participant {
  id: string;
  name: string;
  image: string;
}

export default function AdminQuizPage() {
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentSlide, setCurrentSlide] = useState<'waiting' | 'question' | 'results'>('waiting');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [leaderBoard, setLeaderBoard] = useState<boolean>(false);

  const { quizId } = useParams();

  // ⚡ initialize socket
  const [socket] = useState<Socket>(() =>
    io('http://localhost:8080', { autoConnect: false, transports: ['websocket'] })
  );

  // 🧠 Fetch quiz
  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/quiz/' + quizId);
      const data = await res.json();

      if (!data || !data.room || !Array.isArray(data.room.questions)) {
        setError('Invalid quiz data');
        return;
      }

      setQuiz(data);
      setQuestions(data.room.questions);
      socket.emit('START_QUIZ', {roomId : quizId, data : data})
    } catch (err) {
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Socket connections
  useEffect(() => {
    socket.connect();

    fetchQuiz();


    // tell backend admin joined

    socket.emit('JOIN_ADMIN', { roomId: quizId });

    // listen for live participants
    socket.on('PARTICIPANTS_UPDATE', (list: Participant[]) => {
      setParticipants(list);
    });

    socket.on('connect_error', (err) => console.error('Socket error:', err));

    // cleanup
    return () => {
      socket.disconnect();
    };
  }, [quizId]);


  // 🔁 Slide navigation
  const handleNextSlide = () => {
    if (loading) return;
    const currentIndex = currentQuestion;
    if (currentSlide === 'waiting'){
      setCurrentSlide('question');
      socket.emit('UPDATE_SLIDE', {currentQuestion : currentIndex, roomId : quizId, currentSlide: 'question'});
      socket.emit('ABLE_TO_ANSWER', {roomId : quizId});
      setTimeout(() => {
        socket.emit('NOT_ABLE_TO_ANSWER', {roomId : quizId});
      }, questions[currentIndex].duration * 1000);
    } 
    else if (currentSlide === 'question') {
      if (currentQuestion < questions.length - 1) {
        setCurrentSlide('waiting');
        setCurrentQuestion((prev) => prev + 1);
        socket.emit('UPDATE_SLIDE', {currentQuestion : currentIndex, roomId : quizId, currentSlide: 'waiting'});
      } else setCurrentSlide('results');
    }
  };

 const handlePreviousSlide = () => {
  if (loading) return;
  const currentIndex = currentQuestion;

  if (currentSlide === 'results') {
    setCurrentSlide('question');
    socket.emit('UPDATE_SLIDE', {
      currentQuestion: currentIndex,
      roomId: quizId,
      currentSlide: 'question',
    });
  } 
  else if (currentSlide === 'question') {
    setCurrentSlide('waiting');
    socket.emit('UPDATE_SLIDE', {
      currentQuestion: currentIndex,
      roomId: quizId,
      currentSlide: 'waiting',
    });
  } 
  else if (currentSlide === 'waiting' && currentQuestion > 0) {
    setCurrentQuestion((prev) => prev - 1);
    setCurrentSlide('question');
    socket.emit('UPDATE_SLIDE', {
      currentQuestion: currentIndex - 1,
      roomId: quizId,
      currentSlide: 'question',
    });
  }
};


  const handleLeaderboard = () => {
    setLeaderBoard(!leaderBoard);
  };

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-xl font-semibold mb-4 text-red-600">{error}</h2>
        <Button onClick={fetchQuiz}>Retry</Button>
      </div>
    );

  if(leaderBoard){
    return (
      <>
      <Leaderboard />
       <div className="flex w-full justify-between mt-8">
        <Button onClick={handlePreviousSlide} disabled={currentQuestion === 0 && currentSlide === 'waiting'}>
          Previous
        </Button>
        <Button variant="secondary" onClick={handleLeaderboard}>
          Leaderboard
        </Button>
        <Button onClick={handleNextSlide} disabled={loading}>
          {currentSlide === 'results' ? 'End' : 'Next'}
        </Button>
      </div>
      </>

    )
  }

  return (
  

    <div className="min-h-screen flex flex-col items-center justify-between py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">{quiz?.title || 'Quiz Control'}</h1>

      <div className="w-full flex-grow flex justify-center items-center">
        {currentSlide === 'waiting' ? (
          <WaitingSlide participants={participants} />
        ) : currentSlide === 'question' ? (
          <AdminQuestionSlide
            key={currentQuestion}
            question={questions[currentQuestion].question}
            options={questions[currentQuestion].options}
            correct={questions[currentQuestion].correct}
            duration={questions[currentQuestion].duration}
          />
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-4">🎉 Quiz Completed!</h2>
            <p className="text-lg text-gray-600">You’ve gone through all {questions.length} questions.</p>
            <Button onClick={() => window.location.reload()} className="mt-6">
              Restart Quiz
            </Button>
          </div>
        )}
      </div>

      <div className="flex w-full justify-between mt-8">
        <Button onClick={handlePreviousSlide} disabled={currentQuestion === 0 && currentSlide === 'waiting'}>
          Previous
        </Button>
        <Button variant="secondary" onClick={handleLeaderboard}>
          Leaderboard
        </Button>
        <Button onClick={handleNextSlide} disabled={loading}>
          {currentSlide === 'results' ? 'End' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
