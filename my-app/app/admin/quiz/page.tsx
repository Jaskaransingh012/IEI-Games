'use client';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { StarsIcon } from 'lucide-react';
import Loader from '@/components/Loader';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

interface Quiz {
  id: string;
  title: string;
  description: string;
  created_at: Date;
  created_by: {
    image: string;
    userId: string;
    username: string;
  };
}

function Page() {
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useUser();

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/quiz/fetch-all');
      const data = await res.json();
      setQuizzes(data.quizzes || []);
    } catch (err) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    if (!title.trim() || !description.trim() || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if(password.length < 6 || password.includes(' ')) {
      toast.error('Password must be at least 6 characters long and not contain any spaces');
      return
    }

    if (!user) {
      toast.error('You must be logged in to create a quiz');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/quiz/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          created_by: {
            image: user.imageUrl,
            userId: user.id,
            username: user.username || user.fullName || 'Anonymous',
          },
          password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Quiz created successfully!');
        setOpen(false);
        setTitle('');
        setDescription('');
        fetchQuiz();
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Error creating quiz');
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  return (
    <div className="mt-19">
      <h1 className="text-3xl">Welcome!</h1>

      <div className="flex mt-7 gap-6">
        <Button size={'lg'} onClick={() => setOpen(true)}>
          New Quiz
        </Button>
        <Button size={'lg'}>
          <StarsIcon className="mr-2" /> Make with AI
        </Button>
      </div>

      <div className="mt-20">
        <h1 className="text-3xl">Recently made</h1>

        {loading ? (
          <Loader />
        ) : (
          <div className="flex gap-10 flex-wrap mt-10">
            {quizzes.map((quiz) => (
              <Link key={quiz.id} href={`/admin/quiz/${quiz.id}`}>
                <QuizCard
                  mainImage={null}
                  avatar={quiz.created_by.image}
                  title={quiz.title}
                  subtitle={quiz.description}
                  lastEdited={new Date(quiz.created_at).toLocaleDateString()}
                  createdBy={quiz.created_by.username}
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Quiz</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Input
              placeholder="Quiz Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              onClick={handleCreateQuiz}
              disabled={creating}
              className="w-full"
            >
              {creating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}



const QuizCard = ({
    mainImage = null,
    avatar,
    title,
    subtitle,
    lastEdited,
    createdBy,
}: {
    mainImage: string | null
    avatar: string,
    title: string,
    subtitle: string,
    lastEdited: string,
    createdBy: string

}) => {
    return (
        <div
            className="w-md rounded-xl bg-white dark:bg-neutral-900 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
        >
            {/* Main Image */}
            <div className="relative w-full aspect-video bg-gray-100 flex items-center justify-center">
                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={title}
                        className="object-contain w-full h-full"
                    />
                ) : (
                    <div className="text-gray-400 text-sm">{title} <br/>Created By  {createdBy}</div>
                )}
            </div>

            {/* Content */}
            <div className="flex items-start gap-3 p-4">
                {/* Avatar */}
                <img
                    src={avatar}
                    alt="avatar"
                    className="w-9 h-9 rounded-full bg-gray-200 object-cover"
                />

                {/* Texts */}
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500">{subtitle}</p>
                    {lastEdited && (
                        <span className="text-xs text-gray-400 mt-1">
                            Edited {lastEdited}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;
