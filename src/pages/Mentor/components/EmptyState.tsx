interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-mentor-text mb-2">{title}</h3>
      {description && <p className="text-sm text-mentor-muted max-w-xs mb-6">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2.5 bg-mentor-navy text-mentor-cream rounded-xl text-sm font-medium hover:bg-mentor-navy-light transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
