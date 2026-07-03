import { useNavigate } from 'react-router-dom';
import { SUBJECTS } from '../constants';
import { OptionCard } from '../components/OptionCard';
import { useMentorContext } from '../MentorContext';
import type { Subject } from '../types';

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

export function MentorLanding() {
  const navigate = useNavigate();
  const { openSidebar } = useMentorContext();

  function startSession(subject: Subject) {
    navigate(`/mentor/session/${subject.code}`);
  }

  function startWithPrompt(prompt: string) {
    navigate('/mentor/session', { state: { initialPrompt: prompt } });
  }

  return (
    <div className="h-full overflow-y-auto bg-mentor-cream">
      {/* Header */}
      <header className="bg-mentor-navy px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={openSidebar}
          className="md:hidden text-mentor-tan-light hover:text-mentor-cream transition-colors text-xl leading-none flex-shrink-0"
          aria-label="Open history"
        >
          ☰
        </button>
        <div className="w-8 h-8 rounded-full bg-mentor-amber flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          M
        </div>
        <div>
          <h1 className="text-mentor-cream font-bold text-base leading-tight">Board Exam Mentor</h1>
          <p className="text-mentor-tan-light text-xs">Hello, Sahana! Ready to ace your boards?</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Subject Quick Start */}
        <section>
          <h2 className="text-xs font-semibold text-mentor-muted uppercase tracking-wider mb-3">
            Jump to a Subject
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SUBJECTS.map((subject) => (
              <button
                key={subject.code}
                onClick={() => startSession(subject)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-mentor-border bg-mentor-surface hover:border-mentor-navy hover:shadow-sm transition-all text-left"
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 ${subject.bgColor}`}>
                  {subject.icon}
                </span>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold ${subject.color}`}>{subject.shortName}</p>
                  <p className="text-mentor-text text-xs truncate">{subject.name}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Study Modes */}
        <section>
          <h2 className="text-xs font-semibold text-mentor-muted uppercase tracking-wider mb-3">
            What would you like to do?
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {STUDY_MODES.map((m) => (
              <OptionCard
                key={m.label}
                icon={m.icon}
                label={m.label}
                onClick={() => startWithPrompt(m.prompt)}
              />
            ))}
          </div>
        </section>

        <section className="pb-4">
          <button
            onClick={() => navigate('/mentor/session')}
            className="w-full py-3 rounded-xl bg-mentor-navy text-mentor-cream font-semibold text-sm hover:bg-mentor-navy-light transition-colors"
          >
            + Start a New Session
          </button>
        </section>
      </div>
    </div>
  );
}
