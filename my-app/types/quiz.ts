// types/quiz.ts
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  image?: string;
  explanation?: string;
  timeLimit: number;
}

export interface Player {
  userId: string;
  username: string;
  score: number;
  image?: string;
  answers: Answer[];
}

export interface Answer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  points: number;
  timestamp: number;
}

export interface QuizRoom {
  id: string;
  name: string;
  players: Player[];
  questions: Question[];
  currentQuestion: number;
  status: 'waiting' | 'starting' | 'question' | 'results' | 'leaderboard' | 'finished';
  startTime?: number;
  createdBy: string;
}