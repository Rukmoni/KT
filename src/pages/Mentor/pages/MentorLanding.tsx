import { useNavigate } from 'react-router-dom';
import { SUBJECTS } from '../constants';
import { OptionCard } from '../components/OptionCard';
import type { Subject } from '../types';

interface MentorLandingProps {
  sessionToken: string;
}

const STUDY_MODES = [
  { icon: '📖', label: 'Learn a New Chapter', prompt: 'I want to learn a new chapter. Please show me the subjects.' },
  { icon: '🔄', label: 'Revise a Topic', prompt: 'I want to revise a topic.' },
  { icon: '📝', label: 'Take a Test', prompt: 'I want to take a test.' },
  { icon: '🃏', label: 'Flashcard Session', prompt: 'I want flashcards for a topic.' },
  { icon: '⚡', label: 'Rapid Fire Round', prompt: 'I want a rapid fire round.' },
  { icon: '💪', label: 'Strengthen a Weak Area', prompt: 'I want to strengthen a weak area.' },
  { icon: '📊', label: 'PYQ Analysis', prompt: 'I want PYQ analysis.' },
  { icon: '📈', label: 'View Progress Report', prompt: 'Show me my progress report.' },
  { icon: '📅', label: 'Study Plan', prompt: 'Help me with my study plan.' },
  { icon: '🔬', label: 'Innovation Research', prompt: 'Give me the innovation research update.' },
];

export function MentorLanding({ sessionToken: _ }: MentorLandingProps) {
  const navigate = useNavigate();

  function startSession(subject: Subject) {
    navigate(`/mentor/session/${subject.code}`);
  }

  function startWithPrompt(prompt: string) {
    navigate('/mentor/session', { state: { initialPrompt: prompt } });
  }

  return (
    <div className="min-h-screen bg-mentor-cream">
      {/* Header */}
      <header className="bg-mentor-navy px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-mentor-amber flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <div>
            <h1 className="text-mentor-cream font-semibold text-base leading-tight">AI Board-Exam Mentor</h1>
            <p className="text-mentor-tan-light text-xs">CBSE Class 12 | Sahana's Study Partner</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/mentor/telemetry')}
          className="text-xs text-mentor-tan-light hover:text-mentor-cream transition-colors"
        >
          📊 Telemetry
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <p className="text-3xl mb-3">🎓</p>
          <h2 className="text-2xl font-bold text-mentor-navy mb-2">
            Welcome back, Sahana! 🌟
          </h2>
          <p className="text-mentor-muted text-sm max-w-md mx-auto">
            Your CBSE 12th Board Exam mentor is ready. What would you like to work on today?
          </p>
        </div>

        {/* Quick Start — Chat without subject */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/mentor/session')}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-mentor-navy text-mentor-cream rounded-2xl font-semibold text-base hover:bg-mentor-navy-light transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            <span className="text-xl">💬</span>
            Start a Session
          </button>
        </div>

        {/* Select Subject */}
        <section className="mb-8">
          <h3 className="text-sm font-semibold text-mentor-muted uppercase tracking-wider mb-3">
            Jump to a Subject
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SUBJECTS.map((subject) => (
              <OptionCard
                key={subject.code}
                icon={subject.icon}
                label={subject.name}
                description={`${subject.theoryMarks + subject.practicalMarks} marks`}
                onClick={() => startSession(subject)}
                variant="subject"
                color={subject.color}
              />
            ))}
          </div>
        </section>

        {/* Study Mode Quick Launch */}
        <section>
          <h3 className="text-sm font-semibold text-mentor-muted uppercase tracking-wider mb-3">
            Study Modes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {STUDY_MODES.map((m, i) => (
              <OptionCard
                key={i}
                number={i + 1}
                icon={m.icon}
                label={m.label}
                onClick={() => startWithPrompt(m.prompt)}
                variant="mode"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
