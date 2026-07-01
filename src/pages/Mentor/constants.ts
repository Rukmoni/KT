import type { Subject } from './types';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const MENTOR_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/mentor-chat`;

export const SUBJECTS: Subject[] = [
  {
    code: '042',
    name: 'Physics',
    shortName: 'PHY',
    theoryMarks: 70,
    practicalMarks: 30,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    icon: '⚛️',
  },
  {
    code: '043',
    name: 'Chemistry',
    shortName: 'CHE',
    theoryMarks: 70,
    practicalMarks: 30,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    icon: '⚗️',
  },
  {
    code: '041',
    name: 'Mathematics',
    shortName: 'MAT',
    theoryMarks: 80,
    practicalMarks: 20,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    icon: '📐',
  },
  {
    code: '083',
    name: 'Computer Science',
    shortName: 'CS',
    theoryMarks: 70,
    practicalMarks: 30,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    icon: '💻',
  },
  {
    code: '301',
    name: 'English Core',
    shortName: 'ENG',
    theoryMarks: 80,
    practicalMarks: 0,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    icon: '📝',
  },
];

export const SUBJECT_MAP = Object.fromEntries(
  SUBJECTS.map((s) => [s.code, s])
) as Record<string, Subject>;

export const MODE_LABELS: Record<string, string> = {
  chat: 'Chat',
  teach: 'Teach Mode',
  test: 'Test Mode',
  flashcard: 'Flashcards',
  rapidfire: 'Rapid Fire',
  revise: 'Revision',
  strengthen: 'Strengthen',
  pyq: 'PYQ Analysis',
  research: 'Research',
  innovation: 'Innovation',
};

export const SESSION_TOKEN_KEY = 'mentor_session_token';

export const WELCOME_MESSAGE = `👋 Welcome back, Sahana! Great to see you showing up — that's what toppers do! 🌟

🎯 **WHAT WOULD YOU LIKE TO DO TODAY?**

**[ 1 ]** 📖  Learn a New Chapter
**[ 2 ]** 🔄  Revise a Topic
**[ 3 ]** 📝  Take a Test
**[ 4 ]** 🃏  Flashcard Session
**[ 5 ]** ⚡  Rapid Fire Round
**[ 6 ]** 💪  Strengthen a Weak Area
**[ 7 ]** 📊  PYQ Analysis
**[ 8 ]** 📈  View My Progress Report
**[ 9 ]** 📅  Build / Update Study Plan
**[ 10 ]** 🔬  Innovation Research Update

Just type a number or tell me what's on your mind! 😊`;
