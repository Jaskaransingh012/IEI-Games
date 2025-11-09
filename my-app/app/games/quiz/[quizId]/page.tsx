// app/quiz/[quizId]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { useUser } from '@clerk/nextjs';
import QuizWelcome from './components/WelcomePage';
import WaitingPage from './components/WaitingPage';
import QuestionPage from './components/QuestionPage';

interface Question{
  id:string
  question: string;
  options: string[];
  correctIndex: number;
  duration: number;
}

export default function ParticipantPage() {
  const { quizId } = useParams() as { quizId: string };
  const { user, isLoaded } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currSlide, setCurrSlide] = useState<'waiting' | 'question' | 'results'>('waiting');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currquestion, setCurrentQustion] = useState(0);
  const [canAnswer, setCanAnswer] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // Wait until Clerk loads user

    const token = sessionStorage.getItem(`room_access_${quizId}`);
    if (!token) {
      router.push('/games/quiz');
      return;
    }

    // Initialize socket
    const newSocket = io('http://localhost:8080', {
      transports: ['websocket'],
    });

    setSocket(newSocket);

    // Prepare Clerk user data
    const participant = {
      id: user?.id,
      name: user?.fullName || user?.username || 'Anonymous',
      image: user?.imageUrl || '/default-avatar.png',
    };

    // Join room event
    newSocket.emit('JOIN_ROOM', { roomId: quizId, user: participant });

    newSocket.on('ROOM_UPDATE',(room)=>{
      if(room.slide){
        setQuestions(room.questions);
        setCurrentQustion(room.currQuestion)
        setQuizStarted(room.active);
        setCurrSlide(room.slide);
        setCanAnswer(room.isAbleToAnswer);
      }
    })

    newSocket.on('QUIZ_STARTED', ({ active, slide }) => {
      setQuizStarted(active);
      setCurrSlide(slide);
    })


    // Cleanup on leave/disconnect
    return () => {
      newSocket.emit('LEAVE_ROOM', { roomId: quizId, userId: user?.id });
      newSocket.disconnect();
    };
  }, [quizId, isLoaded]);

  if (!quizStarted) return <QuizWelcome />

  return (
    <div className="p-6">{
      currSlide == 'waiting' ? <WaitingPage /> :

      currSlide == 'question' ?

        <QuestionPage
        questionId = {questions[currquestion].id}
          questionTitle={questions[currquestion].question}
          image={null}
          correctIndex={questions[currquestion].correctIndex}
          options={questions[currquestion].options}
          duration={questions[currquestion].duration}
          ableToAnswer={canAnswer}
        /> :

       <p>Results</p>
    }
    </div>
  );
}
