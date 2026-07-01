interface OptionCardProps {
  number?: number;
  icon: string;
  label: string;
  description?: string;
  onClick: () => void;
  variant?: 'default' | 'subject' | 'mode';
  color?: string;
  disabled?: boolean;
}

export function OptionCard({
  number,
  icon,
  label,
  description,
  onClick,
  variant = 'default',
  color,
  disabled,
}: OptionCardProps) {
  const base =
    'group relative flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left w-full';

  const variants = {
    default:
      'bg-mentor-surface border-mentor-border hover:border-mentor-navy hover:shadow-md hover:-translate-y-0.5',
    subject:
      'bg-mentor-surface border-mentor-border hover:border-mentor-navy hover:shadow-lg hover:-translate-y-1',
    mode: 'bg-mentor-cream border-mentor-border hover:bg-white hover:border-mentor-navy hover:shadow-md',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {number !== undefined && (
        <span className="absolute top-2 right-3 text-xs font-mono text-mentor-muted opacity-60">
          [{number}]
        </span>
      )}
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className={`font-semibold text-sm ${color ?? 'text-mentor-text'}`}>{label}</div>
        {description && (
          <div className="text-xs text-mentor-muted mt-0.5 truncate">{description}</div>
        )}
      </div>
    </button>
  );
}
