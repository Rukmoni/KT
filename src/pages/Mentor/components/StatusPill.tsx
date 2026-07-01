import { MODE_LABELS } from '../constants';
import type { StudyMode } from '../types';

interface StatusPillProps {
  mode: StudyMode;
  subjectName?: string;
  subjectIcon?: string;
}

const MODE_COLORS: Record<string, string> = {
  chat: 'bg-mentor-navy/10 text-mentor-navy',
  teach: 'bg-blue-100 text-blue-700',
  test: 'bg-amber-100 text-amber-700',
  flashcard: 'bg-purple-100 text-purple-700',
  rapidfire: 'bg-red-100 text-red-700',
  revise: 'bg-emerald-100 text-emerald-700',
  strengthen: 'bg-orange-100 text-orange-700',
  pyq: 'bg-indigo-100 text-indigo-700',
  research: 'bg-teal-100 text-teal-700',
  innovation: 'bg-pink-100 text-pink-700',
};

export function StatusPill({ mode, subjectName, subjectIcon }: StatusPillProps) {
  const colorClass = MODE_COLORS[mode] ?? MODE_COLORS.chat;
  return (
    <div className="flex items-center gap-2">
      {subjectName && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-mentor-navy text-mentor-cream">
          {subjectIcon} {subjectName}
        </span>
      )}
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {MODE_LABELS[mode] ?? mode}
      </span>
    </div>
  );
}
